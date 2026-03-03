const router = require('express').Router();
const complianceLogController = require('./complianceLog.controller');
const validate = require('../../middleware/validate');
const { authenticate } = require('../../middleware/auth');
const auditLog = require('../../middleware/auditLog');
const {
  createComplianceLogSchema,
  updateComplianceLogSchema,
  complianceLogQuerySchema,
} = require('./complianceLog.validation');

router.use(authenticate);

router.get('/', validate(complianceLogQuerySchema, 'query'), complianceLogController.getAll);
router.get('/:id', complianceLogController.getById);
router.post('/', validate(createComplianceLogSchema), auditLog('CREATE', 'ComplianceLog'), complianceLogController.create);
router.put('/:id', validate(updateComplianceLogSchema), auditLog('UPDATE', 'ComplianceLog'), complianceLogController.update);
router.delete('/:id', auditLog('DELETE', 'ComplianceLog'), complianceLogController.remove);

module.exports = router;
