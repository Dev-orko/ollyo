const router = require('express').Router();
const certificationController = require('./certification.controller');
const validate = require('../../middleware/validate');
const { authenticate } = require('../../middleware/auth');
const auditLog = require('../../middleware/auditLog');
const {
  createCertificationSchema,
  updateCertificationSchema,
  certificationQuerySchema,
} = require('./certification.validation');

router.use(authenticate);

router.get('/expiring', certificationController.getExpiringSoon);
router.get('/', validate(certificationQuerySchema, 'query'), certificationController.getAll);
router.get('/:id', certificationController.getById);
router.post('/', validate(createCertificationSchema), auditLog('CREATE', 'Certification'), certificationController.create);
router.put('/:id', validate(updateCertificationSchema), auditLog('UPDATE', 'Certification'), certificationController.update);
router.delete('/:id', auditLog('DELETE', 'Certification'), certificationController.remove);

module.exports = router;
