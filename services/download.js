const fs = require('fs');
const path = require('path');
const archiver = require('archiver');
const { execSync } = require('child_process');
const { generateDynamicFiles } = require('../utils/dynamicFiles');

const generateFiles = (content, id) => {
  const scriptPath = path.resolve(__dirname, '../utils/generateFiles.sh');

  try {
    execSync(`${scriptPath} ${id}`, { stdio: 'inherit' });
    generateDynamicFiles(content, id);
  } catch (error) {
    throw new Error('Error generating files.');
  }
};

const createZip = async (id, res) => {
  return new Promise((resolve, reject) => {

    // creation of zip file
    const archive = archiver('zip', {
      zlib: { level: 9 }
    });

    archive.on('error', (err) => {
      console.error('Archive error:', err);
      reject(err);
    });

    archive.on('end', () => {
      console.log('Archive has been finalized and the output file descriptor has closed.');
      resolve();
    });

    // pipe archive data to the response
    archive.pipe(res);

    // zip directory
    const downloadPath = path.resolve(__dirname, `../downloads/${id}`);    
    if (fs.existsSync(downloadPath)) {
      archive.directory(downloadPath, false);
    } else {
      console.error('Download directory does not exist.');
    }

    try {
      archive.finalize();
      console.log('Archive finalized successfully.');
    } catch (err) {
      console.error('Error finalizing archive:', err);
      reject(err);
    }
  });
};

const cleanup = (id) => {
  const downloadPath = path.resolve(__dirname, `../downloads/${id}`);
  if (fs.existsSync(downloadPath)) {
    fs.rmSync(downloadPath, { force: true, recursive: true });
  }
}

module.exports = { 
  generateFiles,
  createZip,
  cleanup
};