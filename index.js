require('dotenv').config();
const express = require('express');
const { v4: uuid } = require('uuid');
const { generateFiles, createZip, cleanup } = require('./services/download');

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

  const id = uuid();

  try {
    generateFiles(content, id);
    await createZip(id, res);
  } catch (err) {
    res.status(500).send({ error: err.message });
  } finally {
    cleanup(id);
  }
});

app.get('/ping', (req, res) => {
  res.send('pong');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});