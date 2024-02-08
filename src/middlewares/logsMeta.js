const logsMeta = async (req, res, next) => {
	const userIp = req.ip;
	const httpRequestInfo = {
		method: req.method,
		url: req.originalUrl,
		headers: req.headers
	};

	req.logMeta = {
		userIp,
		httpRequestInfo
	};

	next();
};

export default logsMeta;
