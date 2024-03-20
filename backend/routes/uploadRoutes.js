import path from 'path'
import express from 'express'
import multer from 'multer'


const checkFileType = (file, cb) => {
    const fileTypes = /jpg|jpeg|png/
    const mimetype = fileTypes.test(file.mimetype)
    const extname = fileTypes.test(path.extname(file.originalname).toLowerCase())
    
    if (mimetype && extname) {
        return cb(null, true)
    } else {
        cb('Please upload a valid image file')
    }
}

const router = express.Router()
const storage = multer.diskStorage({
    destination(request, file, cb) {
        cb(null, 'uploads/', `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`)
    }
})

const upload = multer({ storage })

router.post('/', upload.single('image'), (request, response) => {
    response.send({
        message: 'Uploaded Image',
        image: `/${request.file.path}`
    })
})

export default router