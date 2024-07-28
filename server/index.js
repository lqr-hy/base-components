const express = require('express');
const logger = require('morgan');
const { StatusCodes } = require('http-status-codes');
const cors = require('cors');
const fs = require('fs-extra');
const path = require('path');

const TEMP = path.join(__dirname, 'temp');
const PUBLIC = path.join(__dirname, 'public');
fs.ensureDirSync(PUBLIC);
fs.ensureDirSync(TEMP);

const app = express();
app.use(logger('dev'));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.post('/upload/:filename', async (req, res, next) => {
  try {
    const { filename } = req.params;
    const { chunkIndex, chunkCount, startSize } = req.query;
    // 写入文件的起始位置
    const start = isNaN(startSize) ? 0 : parseInt(startSize);
    console.log(filename, chunkIndex);
    // const filePath = path.join(__dirname, 'temp', filename);
    // await file.mv(filePath);
    // await fs.move(filePath, path.join(__dirname, 'public', filename));
    const chunkDir = path.resolve(TEMP, filename);
    //
    const chunkPath = path.resolve(chunkDir, chunkIndex);
    // 创建文件夹
    await fs.ensureDirSync(chunkDir);
    // 写入文件流 指定写入文件的起始位置 用于断点续传 flag: 'a' 表示追加写入
    const writeStream = fs.createWriteStream(chunkPath, { start, flags: 'a' });
    // console.log(req.pipe())
    // 监听接口暂停事件 用于关闭文件流
    req.on('aborted', () => {
      writeStream.close();
    });
    try {
      await pipeStream(req, writeStream);
    } catch (error) {
      console.log(error);
      next(error);
    }

    res.json({ success: 'File uploaded successfully' });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: error.message });
  }
});

function pipeStream(readStream, writeStream) {
  return new Promise((resolve, reject) => {
    readStream.pipe(writeStream).on('finish', resolve).on('error', reject);
  });
}

app.get('/merge/:filename', async (req, res) => {
  try {
    const { filename } = req.params;
    const { chunkCount, fragmentSize } = req.query;
    console.log('-----');
    try {
      await mergeChunks(filename, fragmentSize, chunkCount);
    } catch (error) {
      console.log(error);
    }
    res.json({ success: 'Merge endpoint' });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: error.message });
  }
});

async function mergeChunks(filename, fragmentSize, chunkCount) {
  // 临时文件夹路径
  const chunkDir = path.resolve(TEMP, filename);
  // 读取文件夹下的文件
  const chunkPaths = await fs.readdir(chunkDir);
  // 写入文件路径
  const filePath = path.resolve(PUBLIC, filename);

  try {
    // 合并文件
    await Promise.all(
      chunkPaths.map((chunkPath, index) => {
        return pipeStream(
          fs.createReadStream(path.resolve(chunkDir, chunkPath), {
            autoClose: true
          }),
          fs.createWriteStream(filePath, {
            start: index * fragmentSize * 1024 * 1024
          })
        );
      })
    );
    // 删除临时文件夹
    await fs.rm(chunkDir, { recursive: true });
  } catch (error) {
    console.log(error);
    next(error);
  }
}

app.get('/verify/:filename', async (req, res) => {
  try {
    const { filename } = req.params;
    const { chunkCount } = req.query;
    const chunkDir = path.resolve(PUBLIC, filename);

    const exists = await fs.pathExists(chunkDir);
    if (!exists) {
      // 读取temp文件夹下是否有文件
      const chunkDir = path.resolve(TEMP, filename);
      const tempExists = await fs.pathExists(chunkDir);
      let uploadList = [];
      console.log(tempExists, 'tempExists');
      if (tempExists) {
        // 读取temp目录下文件的切片
        const chunkFiles = await fs.readdir(chunkDir);

        console.log(chunkFiles, 'chunkFiles');

        // 读取分片文件大小 表示已经上传的文件大小
        uploadList = await Promise.all(
          chunkFiles.map(async (chunkFile) => {
            const { size } = await fs.stat(path.resolve(chunkDir, chunkFile));
            console.log(size, 'size');
            return { chunkFile, size };
          })
        );
        return res.json({ success: true, needUpload: false, uploadList });
      }
      res.json({ success: true, needUpload: false });
    } else {
      res.json({ success: true, needUpload: true });
    }
  } catch (error) {
    res.json({ error: error.message });
  }
});

app.listen(8080, () => {
  console.log('Server is running on port 8080');
});
