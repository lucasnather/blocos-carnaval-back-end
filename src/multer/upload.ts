import multer from "multer";

const storage = multer.memoryStorage()

export const upload = multer({
    storage,
    limits: {
        fileSize: 8 * 1024 * 1024
    },
    fileFilter: (_, file, cb) => {
        const mimes = [
			'image/png',
			'image/jpeg',
			'image/pjpeg',
			'image/jpg',
		]

		if (mimes.includes(file.mimetype)) {
			cb(null, true)
		} else {
			cb(new Error('Invalid mime'))
		}
    }
});