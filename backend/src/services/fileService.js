const fs = require('fs');
const path = require('path');
const config = require('../config');

/**
 * Abstracted file storage service.
 * Currently uses local disk. Swap this implementation for S3 in production.
 */
class FileService {
  /**
   * Get the public URL/path for a stored file.
   * @param {string} filename
   * @returns {string}
   */
  static getFileUrl(filename) {
    return `/uploads/${filename}`;
  }

  /**
   * Delete a file from storage.
   * @param {string} filename
   */
  static async deleteFile(filename) {
    const filePath = path.resolve(config.upload.dir, filename);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  }

  /**
   * Check if a file exists.
   * @param {string} filename
   * @returns {boolean}
   */
  static fileExists(filename) {
    const filePath = path.resolve(config.upload.dir, filename);
    return fs.existsSync(filePath);
  }
}

module.exports = FileService;
