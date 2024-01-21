const { mkdir, readdir, rm, copyFile } = require('node:fs/promises');
const { join } = require('node:path');
const BASIC_FOLDER = 'files';
const COPY_FOLDER = 'files-copy';

async function makeDirectory() {
  const projectFolder = join(__dirname, COPY_FOLDER);
  const dirCreation = await mkdir(projectFolder, { recursive: true });

  try {
    await clearDirectory();
    await copyFiles();
  } catch {
    console.error('The file could not be copied');
  }

  return dirCreation;
}

async function copyFiles() {
  const FolderIn = join(__dirname, BASIC_FOLDER);

  const filesFolders = await readdir(FolderIn, {
    withFileTypes: true,
  });

  for (const file of filesFolders) {
    if (file.isDirectory()) {
      continue;
    }
    const FileIn = join(__dirname, BASIC_FOLDER, file.name);
    const FileOut = join(__dirname, COPY_FOLDER, file.name);

    await copyFile(FileIn, FileOut);
  }
}

async function clearDirectory() {
  const FolderOut = join(__dirname, COPY_FOLDER);
  const filesFolders = await readdir(FolderOut, {
    withFileTypes: true,
  });

  for (const file of filesFolders) {
    if (file.isDirectory()) {
      continue;
    }
    const filePath = join(FolderOut, file.name);
    await rm(filePath);
  }
}

makeDirectory().catch(console.error);
