import multer from 'multer'
import { randomBytes } from 'node:crypto'

export const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'thumbnails/')
  },
  filename: function (req, file, cb) {
    const fileExtension = file.originalname.split('.')[1]

    const hash = randomBytes(32).toString('hex')

    cb(null, `${hash}.${fileExtension}`)
  },
})

export const uploadMiddleware = multer({ storage })

