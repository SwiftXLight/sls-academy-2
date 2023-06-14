const fs = require('fs');
const path = require('path');
const { performance } = require('perf_hooks');
const { Transform } = require('stream');

(async () => {
  function readUsernamesFromFile(filePath) {
    const readStream = fs.createReadStream(filePath, 'utf-8');
    const transformStream = new Transform({
      readableObjectMode: true,
      transform(chunk, encoding, callback) {
        const usernames = chunk.toString().split('\n');
        for (const username of usernames) {
          this.push(username);
        }
        callback();
      }
    });

    readStream.pipe(transformStream);
    return transformStream;
  }

  function uniqueValues() {
    return new Promise((resolve, reject) => {
      const usernamesSet = new Set();
      const filesPath = './files';

      const filePromises = Array.from({ length: 20 }, (_, i) => {
        const filePath = path.join(filesPath, `out${i}.txt`);
        return new Promise((fileResolve, fileReject) => {
          const usernamesStream = readUsernamesFromFile(filePath);
          usernamesStream.on('data', (username) => {
            usernamesSet.add(username);
          });
          usernamesStream.on('end', () => fileResolve());
          usernamesStream.on('error', (error) => fileReject(error));
        });
      });

      Promise.all(filePromises)
        .then(() => resolve(usernamesSet.size))
        .catch(reject);
    });
  }

  function existInAllFiles() {
    return new Promise((resolve, reject) => {
      const filesPath = './files';
      const commonUsernames = new Set();
  
      const filePath = path.join(filesPath, 'out0.txt');
      const usernamesStream = readUsernamesFromFile(filePath);
      usernamesStream.on('data', (username) => {
        commonUsernames.add(username);
      });
      usernamesStream.on('end', () => {
        let processedCount = 0;
        const totalFiles = 20;
  
        const processFile = (index) => {
          if (index >= totalFiles) {
            resolve(commonUsernames.size);
            return;
          }
  
          const filePath = path.join(filesPath, `out${index}.txt`);
          const usernamesStream = readUsernamesFromFile(filePath);
          const usernamesSet = new Set();
  
          usernamesStream.on('data', (username) => {
            if (commonUsernames.has(username)) {
              usernamesSet.add(username);
            }
          });
  
          usernamesStream.on('end', () => {
            commonUsernames.clear();
            for (const username of usernamesSet) {
              commonUsernames.add(username);
            }
            processedCount++;
            processFile(processedCount);
          });
  
          usernamesStream.on('error', (error) => reject(error));
        };
  
        processFile(1);
      });
      usernamesStream.on('error', (error) => reject(error));
    });
  }   

  function existInAtleastTen() {
    return new Promise((resolve, reject) => {
      const filesPath = './files';
      const usernamesCountMap = new Map();

      const filePromises = Array.from({ length: 20 }, (_, i) => {
        const filePath = path.join(filesPath, `out${i}.txt`);
        return new Promise((fileResolve, fileReject) => {
          const usernamesStream = readUsernamesFromFile(filePath);
          usernamesStream.on('data', (username) => {
            const count = usernamesCountMap.get(username) || 0;
            usernamesCountMap.set(username, count + 1);
          });
          usernamesStream.on('end', () => fileResolve());
          usernamesStream.on('error', (error) => fileReject(error));
        });
      });

      Promise.all(filePromises)
        .then(() => {
          let count = 0;
          for (const occurrence of usernamesCountMap.values()) {
            if (occurrence >= 10) {
              count++;
            }
          }
          resolve(count);
        })
        .catch(reject);
    });
  }

  const startTime = performance.now();
  const uniqueUsernames = await uniqueValues();
  const allFilesUsernames = await existInAllFiles();
  const tenFilesUsernames = await existInAtleastTen();
  const endTime = performance.now();

  console.log('Unique Usernames:', uniqueUsernames);
  console.log('Usernames in All Files:', allFilesUsernames);
  console.log('Usernames in at Least 10 Files:', tenFilesUsernames);
  console.log('Elapsed Time:', endTime - startTime, 'ms');
})();
