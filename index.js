require('dotenv').config();
const express = require('express');
const app = express();

app.use(express.static('dist'));
app.use(express.json());

app.get('/ping', (req, res) => {
  res.send('pong');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});