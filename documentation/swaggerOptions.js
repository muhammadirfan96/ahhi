const swaggerOptions = {
	definition: {
		openapi: '3.0.0',
		info: {
			title: 'EXPRESS-SERVER',
			version: '1.0.0',
			description: 'RESTFUL API DENGAN EXPRESS JS DAN MONGO DB'
		}
	},
	apis: ['./open-api.yaml'] // Ganti dengan path file-file route Anda
};

export default swaggerOptions;
