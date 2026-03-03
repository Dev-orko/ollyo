const router = require('express').Router();
const fileUploadController = require('./fileUpload.controller');
const { authenticate } = require('../../middleware/auth');
const upload = require('../../middleware/upload');

router.use(authenticate);

router.post('/upload', upload.single('file'), fileUploadController.uploadFile);
router.delete('/:filename', fileUploadController.deleteFile);

module.exports = router;
