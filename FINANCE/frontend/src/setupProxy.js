const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
	// Proxy all /backend-api requests to the backend
	app.use(
		'/backend-api',
		createProxyMiddleware({
			target: 'http://localhost',
			changeOrigin: true,
			secure: false,
			timeout: 30000, // 30 seconds timeout
			proxyTimeout: 30000,
			pathRewrite: {
				// Rewrite /backend-api/* to /VET-SUPER-SYSTEM-3E/FINANCE/backend/api/*
				'^/backend-api': '/VET-SUPER-SYSTEM-3E/FINANCE/backend/api',
			},
			onProxyReq: (proxyReq, req, res) => {
				// Log the proxied request for debugging
				console.log(`[PROXY] ${req.method} ${req.url} -> ${proxyReq.path}`);
				
				// Ensure cookies/sessions are forwarded
				proxyReq.setHeader('Origin', 'http://localhost:3000');
				proxyReq.setHeader('X-Forwarded-For', req.ip);
				proxyReq.setHeader('X-Forwarded-Proto', 'http');
			},
			onProxyRes: (proxyRes, req, res) => {
				// Log response status
				console.log(`[PROXY RESPONSE] ${req.method} ${req.url} -> Status: ${proxyRes.statusCode}`);
			},
			onError: (err, req, res) => {
				console.error('Proxy error:', err);
				console.error('Request details:', {
					method: req.method,
					url: req.url,
					path: req.path,
					originalUrl: req.originalUrl
				});
				res.status(503).json({
					success: false,
					message: 'Backend server is not responding. Please ensure XAMPP/WAMP is running and Apache is started.',
					error: err.message
				});
			},
		})
	);

	// Also handle direct /VET-SUPER-SYSTEM-3E paths (fallback)
	app.use(
		'/VET-SUPER-SYSTEM-3E',
		createProxyMiddleware({
			target: 'http://localhost',
			changeOrigin: true,
			secure: false,
			timeout: 30000,
			proxyTimeout: 30000,
			onError: (err, req, res) => {
				console.error('Fallback proxy error:', err);
				res.status(503).json({
					success: false,
					message: 'Backend server is not responding.',
					error: err.message
				});
			},
		})
	);
};


