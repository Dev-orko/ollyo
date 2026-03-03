const catchAsync = require('../../utils/catchAsync');
const { successResponse } = require('../../utils/response');
const FileService = require('../../services/fileService');
const AppError = require('../../utils/AppError');

const uploadFile = catchAsync(async (req, res) => {
  if (!req.file) {
    throw AppError.badRequest('No file uploaded');
  }

  const fileUrl = FileService.getFileUrl(req.file.filename);

  successResponse(
    res,
    {
      data: {
        filename: req.file.filename,
        originalName: req.file.originalname,
        mimetype: req.file.mimetype,
        size: req.file.size,
        url: fileUrl,
      },
    },
    201,
    'File uploaded successfully'
  );
});

const deleteFile = catchAsync(async (req, res) => {
  const { filename } = req.params;

  if (!FileService.fileExists(filename)) {
    throw AppError.notFound('File not found');
  }

  await FileService.deleteFile(filename);

  successResponse(res, { data: { message: 'File deleted successfully' } });
});

module.exports = { uploadFile, deleteFile };
