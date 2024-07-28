self.addEventListener('message', function (e) {
  const dragFile = e.data;
  getFileName().then((fileName) => {
    self.postMessage(fileName);
  });
  /**
   * 根据文件流获取文件名得到hash文件名
   */
  async function getFileName() {
    const fileHash = await calculateFileHash(dragFile as File);
    // 获取文件后缀
    const ext = dragFile?.name.split('.').pop();

    return `${fileHash}.${ext}`;
  }

  /**
   *
   * @param file 计算文件hash
   * @returns
   */
  async function calculateFileHash(file: File) {
    const arrayBuffer = await file.arrayBuffer();
    const hashBuffer = await crypto.subtle.digest('SHA-256', arrayBuffer);
    return bufferToHex(hashBuffer);
  }

  /**
   *
   * @param buffer buffer 转 16进制
   * @returns
   */
  function bufferToHex(buffer: ArrayBuffer) {
    return Array.from(new Uint8Array(buffer))
      .map((byte) => byte.toString(16).padStart(2, '0'))
      .join('');
  }
});
