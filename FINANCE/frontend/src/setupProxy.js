const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
	app.use(
		'/backend-api',
		createProxyMiddleware({
			target: 'http://localhost',
			changeOrigin: true,
			secure: false,
			timeout: 30000, // 30 seconds timeout
			proxyTimeout: 30000,
			pathRewrite: {
				'^/backend-api': '/fur-ever-care/backend/api',
			},
			onProxyReq: (proxyReq) => {
				// Ensure cookies/sessions are forwarded
				proxyReq.setHeader('Origin', 'http://localhost:3000');
			},
			onError: (err, req, res) => {
				console.error('Proxy error:', err);
				res.status(500).json({
					success: false,
					message: 'Backend server is not responding. Please ensure XAMPP/WAMP is running and Apache is started.'
				});
			},
		})
	);
};

