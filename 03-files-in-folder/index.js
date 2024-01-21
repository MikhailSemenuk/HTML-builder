const fs = require('fs').promises;
const path = require('path');

// <file name>-<file extension>-<file size>
// example - txt - 128.369kb
async function readDirectory(directoryPath) {
  try {
    const filesFolders = await fs.readdir(directoryPath, {
      withFileTypes: true,
    });

    for (const file of filesFolders) {
      if (file.isDirectory()) {
        continue;
      }

      const filePath = path.join(directoryPath, file.name);
      const fileInfo = path.parse(filePath);

      const stats = await fs.stat(filePath);
      const fileSizeInKb = (stats.size / 1024).toFixed(3);
      console.log(
        `${fileInfo.name} - ${fileInfo.ext.slice(1)}- ${fileSizeInKb}kb`,
      );
    }
  } catch (err) {
    console.error(err);
  }
}

readDirectory(path.join(__dirname, 'secret-folder'));
