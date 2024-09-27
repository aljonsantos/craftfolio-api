const archiver = require('archiver');

const createZip = async (content, res) => {
  return new Promise((resolve, reject) => {
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

    archive.pipe(res);

    // copy react codebase of frontend and zip it
    


    try {
      archive.finalize();
      console.log('Archive finalized successfully.');
    } catch (err) {
      console.error('Error finalizing archive:', err);
      reject(err);
    }
  });
};

module.exports = { createZip };