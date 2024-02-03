const logsMeta = async (req, res, next) => {
	const userId = req.me?.id;
	const userIp = req.ip;
	const httpRequestInfo = {
		method: req.method,
		url: req.originalUrl,
		headers: req.headers
	};

	req.logMeta = {
		userId,
		userIp,
		httpRequestInfo
	};

	next();
};

export default logsMeta;
