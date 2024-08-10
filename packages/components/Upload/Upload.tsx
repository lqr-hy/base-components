import classNames from 'classnames';
import { PropsWithChildren, useEffect, useRef, useState } from 'react';
import { Icon } from '../Icon';
import { createNamespace, useDrag } from '@xb-onepiece/utils';
import request from './request';
import axios, { AxiosResponse, CancelTokenSource } from 'axios';

const upload = createNamespace('upload');

export interface UploadProps {
  className?: string;
  /**
   * 上传地址
   */
  url?: string;
  /**
   * 文件类型 例如：image/png image/jpeg
   */
  accept?: string;
  /**
   * 是否使用分片上传
   */
  isUseFragmentUpload?: boolean;
  /**
   * 宽
   */
  width?: number;
  /**
   * 高
   */
  height?: number;
  /**
   * 最大文件大小(M)
   */
  maxFileSize?: number;
  /**
   * 分片大小(M)
   */
  fragmentSize?: number;
  /**
   * 取消上传
   */
  cancel?: boolean;
  /**
   * 上传进度
   */
  onProgress?: (percent: number) => void;
  /**
   * 上传成功
   */
  onSuccess?: () => void;
  /**
   * 上传失败
   */
  onError?: (e: unknown) => void;
  /**
   * 是否禁用
   */
  disabled?: boolean;
  /**
   * 控制并发数量
   */
  limit?: number;
}

function Upload(props: PropsWithChildren<UploadProps>) {
  const {
    className,
    children,
    fragmentSize = 100,
    maxFileSize = 1000,
    isUseFragmentUpload = false,
    cancel,
    onProgress,
    onError,
    onSuccess,
    accept,
    disabled,
    limit = 5
  } = props;
  const uploadContainerRef = useRef<HTMLDivElement>(null);
  const { dragFile } = useDrag(uploadContainerRef, accept);
  const [uploadProgress, setUploadProgress] = useState({});
  const [cancelTokens, setCancelTokens] = useState<CancelTokenSource[]>([]);
  const [chunkCache, setChunkCache] = useState<{
    [key: string]: { file: Blob; fileName: string; chunkIndex: number; chunkCount: number }[];
  }>({});

  useEffect(() => {
    if (cancel) {
      cancelUpload();
      return;
    }
    if (dragFile) {
      // 校验文件
      if (!checkFile(dragFile)) {
        return;
      }
      // 获取文件名
      const fileNameWorker = new Worker(new URL('./filteNameWorker.ts', import.meta.url));
      fileNameWorker.postMessage(dragFile);
      fileNameWorker.onmessage = (e) => {
        const fileName = e.data;
        uploadFile(dragFile, fileName);
      };
    }
  }, [dragFile, cancel]);

  useEffect(() => {
    if (Object.keys(uploadProgress).length) {
      const totalProgress = (Object.values(uploadProgress) as number[]).reduce(
        (prev, cur) => prev + cur,
        0
      );
      const percent = Math.round(totalProgress / Object.keys(uploadProgress).length);
      onProgress?.(percent);
    }
  }, [uploadProgress]);

  /**
   * 校验文件大小 和文件类型
   */
  function checkFile(file: File) {
    // 判断文件大小
    if (file.size > maxFileSize * 1024 * 1024) {
      onError?.('文件过大');
      return false;
    }
    // 判断文件类型
    if (accept && !accept.includes(file.type)) {
      onError?.('文件类型不支持');
      return false;
    }
    return true;
  }

  /**
   * 上传文件
   * @param fileName 文件名
   */
  async function uploadFile(file: File, fileName: string) {
    const { needUpload, uploadList } = await request.get<
      unknown,
      { needUpload: boolean; uploadList: { chunkFile: string; size: number }[] }
    >(`/verify/${fileName}`);
    if (needUpload) {
      console.log('文件已存在');
      onSuccess?.();
      return;
    }

    const chunks = fragmentUpload(file, fileName);

    const cancelTokens: CancelTokenSource[] = [];
    // const chunksRequests = chunks.map(({ file, fileName, chunkCount, chunkIndex }) => {
    //   const cancelToken = axios.CancelToken.source();
    //   cancelTokens.push(cancelToken);
    //   const existingChunk = uploadList?.find((item) => Number(item.chunkFile) === chunkIndex);
    //   if (existingChunk) {
    //     // 获取已上传的文件大小
    //     const startSize = existingChunk.size;
    //     // 从 chunk 中截取已上传的文件 得到剩下需要上传的文件
    //     const remainingChunk = file.slice(startSize);
    //     if (remainingChunk.size === 0) {
    //       return Promise.resolve();
    //     }
    //     return createRequest(
    //       remainingChunk,
    //       fileName,
    //       chunkCount,
    //       chunkIndex,
    //       cancelToken.token,
    //       startSize
    //     );
    //   } else {
    //     return createRequest(file, fileName, chunkCount, chunkIndex, cancelToken.token);
    //   }
    // });
    // 修改后的代码
    const chunksRequests = chunks.map(({ file, fileName, chunkCount, chunkIndex }) => {
      return () => {
        const cancelToken = axios.CancelToken.source();
        cancelTokens.push(cancelToken);
        const existingChunk = uploadList?.find((item) => Number(item.chunkFile) === chunkIndex);
        if (existingChunk) {
          // 获取已上传的文件大小
          const startSize = existingChunk.size;
          // 从 chunk 中截取已上传的文件 得到剩下需要上传的文件
          const remainingChunk = file.slice(startSize);
          if (remainingChunk.size === 0) {
            return Promise.resolve();
          }
          return createRequest(
            remainingChunk,
            fileName,
            chunkCount,
            chunkIndex,
            cancelToken.token,
            startSize
          );
        } else {
          return createRequest(file, fileName, chunkCount, chunkIndex, cancelToken.token);
        }
      };
    });

    setCancelTokens(cancelTokens);
    try {
      console.log(chunksRequests);
      // 并发上传
      // await Promise.all(chunksRequests);
      // 控制并发数量为 5
      await limitConcurrentRequests(chunksRequests, limit);
      // 合并请求
      await request.get(`/merge/${fileName}`, {
        params: {
          chunkCount: chunks.length,
          fragmentSize
        }
      });
      onSuccess?.();
    } catch (e) {
      if (axios.isCancel(e)) {
        console.log('取消上传');
        onError?.(e);
      } else {
        onError?.(e);
        console.log(e);
      }
    }
  }

  // 辅助函数：限制并发请求数量
  const limitConcurrentRequests = (
    requests: (() => Promise<void> | Promise<AxiosResponse<unknown, unknown>>)[],
    limit: number
  ) => {
    let activeRequests = 0;
    let currentIndex = 0;

    return new Promise((resolve, reject) => {
      const results: (void | AxiosResponse<unknown, unknown>)[] = [];
      const errors: unknown[] = [];

      const executeNext = () => {
        if (currentIndex >= requests.length) {
          if (activeRequests === 0) {
            if (errors.length > 0) {
              reject(errors);
            } else {
              resolve(results);
            }
          }
          return;
        }

        const request = requests[currentIndex];
        currentIndex++;
        activeRequests++;

        request()
          .then((result) => {
            results.push(result);
          })
          .catch((error) => {
            errors.push(error);
          })
          .finally(() => {
            activeRequests--;
            executeNext();
          });

        if (activeRequests < limit) {
          executeNext();
        }
      };

      executeNext();
    });
  };

  /**
   * 取消上传
   */
  const cancelUpload = () => {
    if (cancelTokens.length) {
      cancelTokens.forEach((cancelToken) => {
        cancelToken.cancel('取消上传');
      });
    }
  };

  /**
   * 创建请求
   * @param data 请求数据
   */
  function createRequest(
    file: Blob,
    fileName: string,
    chunkCount: number,
    chunkIndex: number,
    cancelToken: CancelTokenSource['token'],
    startSize?: number
  ) {
    return request.post(`/upload/${fileName}`, file, {
      headers: {
        'Content-Type': 'application/octet-stream' // 二进制流
      },
      params: {
        chunkCount,
        chunkIndex,
        startSize
      },
      onUploadProgress(progressEvent) {
        const percent = Math.round((progressEvent.loaded * 100) / (progressEvent.total as number));
        setUploadProgress((prev) => ({
          ...prev,
          [chunkIndex]: percent
        }));
      },
      cancelToken
    });
  }

  /**
   * 分片上传
   * @param file 文件
   * @param fileName 文件名
   */
  function fragmentUpload(file: File, fileName: string) {
    const chunkSize = fragmentSize * 1024 * 1024;
    const chunkCount = Math.ceil(file.size / chunkSize);
    if (chunkCache[fileName]) {
      return chunkCache[fileName];
    }
    let chunkList = [];
    //  是否使用分片上传
    if (isUseFragmentUpload) {
      chunkList = Array.from({ length: chunkCount }).map((_, index) => {
        const start = index * chunkSize;
        const end = Math.min(start + chunkSize, file.size);
        return {
          file: file.slice(start, end),
          fileName,
          chunkIndex: index + 1,
          chunkCount
        };
      });
    } else {
      // 不使用分片上传
      chunkList = [
        {
          file,
          fileName,
          chunkIndex: 1,
          chunkCount
        }
      ];
    }

    setChunkCache((prev) => ({
      ...prev,
      [fileName]: chunkList
    }));

    return chunkList;
  }

  // /**
  //  * 根据文件流获取文件名得到hash文件名
  //  */
  // async function getFileName() {
  //   const fileHash = await calculateFileHash(dragFile as File);
  //   // 获取文件后缀
  //   const ext = dragFile?.name.split('.').pop();

  //   return `${fileHash}.${ext}`;
  // }

  // /**
  //  *
  //  * @param file 计算文件hash
  //  * @returns
  //  */
  // async function calculateFileHash(file: File) {
  //   const arrayBuffer = await file.arrayBuffer();
  //   const hashBuffer = await crypto.subtle.digest('SHA-256', arrayBuffer);
  //   return bufferToHex(hashBuffer);
  // }

  // /**
  //  *
  //  * @param buffer buffer 转 16进制
  //  * @returns
  //  */
  // function bufferToHex(buffer: ArrayBuffer) {
  //   return Array.from(new Uint8Array(buffer))
  //     .map((byte) => byte.toString(16).padStart(2, '0'))
  //     .join('');
  // }

  function renderFile() {
    if (!dragFile) {
      return null;
    }

    const { name, type } = dragFile;

    if (type.includes('video')) {
      return <video src={URL.createObjectURL(dragFile)} controls></video>;
    }

    return <img src={URL.createObjectURL(dragFile)} alt={name} />;
  }

  return (
    <div
      className={classNames(
        upload.b('container'),
        className,
        upload.is('disabled', disabled as boolean)
      )}
      ref={uploadContainerRef}
    >
      {dragFile ? <div className={upload.be('container', 'file')}>{renderFile()}</div> : null}
      {children ? (
        children
      ) : (
        <div className={upload.be('container', 'icon')}>
          <Icon icon={'file'}></Icon>
        </div>
      )}
    </div>
  );
}

export default Upload;
