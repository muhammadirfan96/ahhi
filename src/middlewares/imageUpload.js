import multer from 'multer';

const storage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, 'public/image');
	},
	filename: (req, file, cb) => {
		cb(null, `${Date.now()}-${file.originalname}`);
	}
});

const filefilter = (req, file, cb) => {
	const originalname = file.originalname.toLowerCase();
	const arr = originalname.split('.');
	const extension = arr[arr.length - 1];
	const allowedExt = ['jpg', 'jpeg', 'png', 'gif'];
	if (allowedExt.includes(extension)) {
		cb(null, true);
	} else {
		cb(new Error('ext not valid'));
	}
};

const upload = multer({
	storage: storage,
	fileFilter: filefilter,
	limits: {
		fileSize: 1024 * 1024
	}
});

export { upload };
