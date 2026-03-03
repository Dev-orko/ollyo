const router = require('express').Router();
const supplierController = require('./supplier.controller');
const validate = require('../../middleware/validate');
const { authenticate } = require('../../middleware/auth');
const auditLog = require('../../middleware/auditLog');
const {
  createSupplierSchema,
  updateSupplierSchema,
  supplierQuerySchema,
} = require('./supplier.validation');

router.use(authenticate);

router.get('/', validate(supplierQuerySchema, 'query'), supplierController.getAll);
router.get('/:id', supplierController.getById);
router.post('/', validate(createSupplierSchema), auditLog('CREATE', 'Supplier'), supplierController.create);
router.put('/:id', validate(updateSupplierSchema), auditLog('UPDATE', 'Supplier'), supplierController.update);
router.delete('/:id', auditLog('DELETE', 'Supplier'), supplierController.remove);

module.exports = router;
