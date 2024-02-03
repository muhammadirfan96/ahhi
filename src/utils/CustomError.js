class CustomError extends Error {
	constructor(status, message) {
		super(message);
		this.status = status || 500;
	}
}

export default CustomError;