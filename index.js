require('dotenv').config();
const express = require('express');
const archiver = require('archiver');
const app = express();

app.use(express.static('dist'));
app.use(express.json());

app.post('/api/download-code', async (req, res) => {
  const { content } = req.body;

  if (!content) {
    return res.status(400).send({ error: 'No content provided' });
  }

  const filename = 'code.zip';
  res.setHeader('Content-Type', 'application/zip');
  res.setHeader('Content-Disposition', `attachment; filename=${filename}`);

  const archive = archiver('zip', {
    zlib: { level: 9 }
  });

  archive.on('error', (err) => {
    console.error('Archive error:', err);
    res.status(500).send({ error: err.message });
  });

  archive.on('end', () => {
    console.log('Archive has been finalized and the output file descriptor has closed.');
  });

  archive.pipe(res);

  // Add files to the zip
  archive.append('hello', { name: 'hello.txt' });
  archive.file('./test.txt', { name: 'test.txt' });

  archive.finalize().then(() => {
    console.log('Archive finalized successfully.');
  }).catch((err) => {
    console.error('Error finalizing archive:', err);
    res.status(500).send({ error: err.message });
  });
});

app.get('/ping', (req, res) => {
  res.send('pong');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});