const {
  mkdir,
  copyFile,
  readdir,
  rm,
  readFile,
  writeFile,
} = require('node:fs/promises');
const { join, parse } = require('node:path');
const pathProjectFolder = 'project-dist';

const folderAssets = 'assets';

const folderStyles = 'styles';
const fileStyle = 'style.css';
const pathBundleFolderFromCSS = join(__dirname, folderStyles);
const pathBundleToCSS = join(__dirname, pathProjectFolder, fileStyle);

const folderHTMLComponents = 'components';
const fileHTML = 'index.html';
const fileTemplate = 'template.html';
const pathBundleTemplateToHTML = join(__dirname, fileTemplate);
const pathBundleFolderComponents = join(__dirname, folderHTMLComponents);
const pathBundleToHTML = join(__dirname, pathProjectFolder, fileHTML);

(async () => {
  await makeDirectory(join(__dirname, pathProjectFolder));

  const copyFilesFrom = join(__dirname, folderAssets);
  const copyFileTo = join(__dirname, pathProjectFolder, folderAssets);
  await deleteFilesAndDirectoriesRecursively(
    join(__dirname, pathProjectFolder),
  );
  await copyFilesAndDirectoriesRecursively(copyFilesFrom, copyFileTo);

  await mergeCSS(pathBundleFolderFromCSS, pathBundleToCSS);

  await buildHTML(
    pathBundleTemplateToHTML,
    pathBundleFolderComponents,
    pathBundleToHTML,
  );
})();

async function makeDirectory(projectFolder) {
  const dirCreation = await mkdir(projectFolder, { recursive: true });
  return dirCreation;
}

async function copyFilesAndDirectoriesRecursively(FolderFrom, FolderTo) {
  await makeDirectory(FolderTo);
  const filesFolders = await readdir(FolderFrom, {
    withFileTypes: true,
  });

  for (const fileFolder of filesFolders) {
    const fileFolderFrom = join(FolderFrom, fileFolder.name);
    const fileFolderTo = join(FolderTo, fileFolder.name);

    if (fileFolder.isDirectory()) {
      await copyFilesAndDirectoriesRecursively(fileFolderFrom, fileFolderTo);
      continue;
    }
    await copyFile(fileFolderFrom, fileFolderTo);
  }
}

async function deleteFilesAndDirectoriesRecursively(directoryPath) {
  await rm(directoryPath, { recursive: true });
  // console.log(`Directory ${directoryPath} has been removed recursively`);
}

async function mergeCSS(pathFolderFrom, pathCssTo) {
  const bundleArray = [];
  try {
    const filesFolders = await readdir(pathFolderFrom, {
      withFileTypes: true,
    });

    for (const file of filesFolders) {
      if (file.isDirectory()) {
        continue;
      }

      const filePath = join(pathFolderFrom, file.name);
      const fileInfo = parse(filePath);

      if (fileInfo.ext !== '.css') {
        continue;
      }

      const fileContent = await readFile(filePath, 'utf8');
      bundleArray.push(fileContent);
    }
    await writeFile(pathCssTo, bundleArray.join('\n'), 'utf8');
  } catch (err) {
    console.error(err);
  }
}

async function buildHTML(pathTemplate, pathComponents, pathHTMLTo) {
  const componentsMap = new Map();
  let HTMLBody = '';

  const filesFolders = await readdir(pathComponents, {
    withFileTypes: true,
  });

  for (const file of filesFolders) {
    if (file.isDirectory()) {
      continue;
    }

    const filePath = join(pathComponents, file.name);
    const fileInfo = parse(filePath);
    const fileContent = await readFile(filePath, 'utf8');
    componentsMap.set(fileInfo.name, fileContent);
  }

  HTMLBody = await readFile(pathTemplate, 'utf8');

  for (let [key, value] of componentsMap) {
    const templateTag = `{{${key}}}`;
    while (HTMLBody.includes(templateTag)) {
      HTMLBody = HTMLBody.replace(templateTag, '\n' + value);
    }
  }

  await writeFile(pathHTMLTo, HTMLBody, 'utf8');
}
