const fs = require('fs').promises;
const path = require('path');
const pathSourceCSS = path.join(__dirname, 'styles');
const pathBundleCSS = path.join(__dirname, 'project-dist', 'bundle.css');

async function mergeCSS(directoryPath) {
  const bundleArray = [];
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

      if (fileInfo.ext !== '.css') {
        continue;
      }

      const fileContent = await fs.readFile(filePath, 'utf8');
      bundleArray.push(fileContent);
    }
    await fs.writeFile(pathBundleCSS, bundleArray.join('\n'), 'utf8');
  } catch (err) {
    console.error(err);
  }
}

mergeCSS(pathSourceCSS);
