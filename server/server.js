const express = require('express');
const cors = require('cors');
const path = require('path');
const app = express();

// Enables Cross-Origin Resource Sharing
app.use(cors());

// Init Middleware
app.use(express.json());

// Define Routes
app.get('/api/message', (req, res) => {
  res.json({ message: 'Hello from Express!' });
});

// TODO: implement this
// Serve static assets in production
/*
if (process.env.NODE_ENV === 'production') {
  const distPath = path.join(__dirname, '..', 'dist');

  app.use(express.static(distPath));

  app.get('*', (req, res) => {
    res.sendFile(path.resolve(distPath, 'index.html'));
  });
}
*/

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

