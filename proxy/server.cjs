// proxy/server.cjs
const express = require('express');
const cors = require('cors');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();
const PORT = 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Logging middleware để debug
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// Proxy cho hadith API
app.use('/api/hadith', createProxyMiddleware({
  target: 'https://hadeethenc.com',
  changeOrigin: true,
  pathRewrite: {
    '^/api/hadith': '/api/v1',
  },
  on: {
    proxyReq: (proxyReq, req, res) => {
      console.log('Proxying request to:', proxyReq.path);
      console.log('Original URL:', req.url);
      proxyReq.setHeader('Accept', 'application/json');
      proxyReq.setHeader('User-Agent', 'Mozilla/5.0');
    },
    error: (err, req, res) => {
      console.error('Proxy error:', err);
      res.status(500).json({ error: 'Proxy error' });
    }
  }
}));

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Proxy server is running' });
});

app.listen(PORT, () => {
  console.log(`🚀 Hadith Proxy Server running on http://localhost:${PORT}`);
  console.log(`📡 Proxying: http://localhost:${PORT}/api/hadith -> https://hadeethenc.com/api/v1`);
});