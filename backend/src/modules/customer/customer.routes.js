const router = require('express').Router();
const customerController = require('./customer.controller');
const validate = require('../../middleware/validate');
const { authenticate } = require('../../middleware/auth');
const auditLog = require('../../middleware/auditLog');
const {
  createCustomerSchema,
  updateCustomerSchema,
  customerQuerySchema,
} = require('./customer.validation');

router.use(authenticate);

router.get('/', validate(customerQuerySchema, 'query'), customerController.getAll);
router.get('/:id', customerController.getById);
router.post('/', validate(createCustomerSchema), auditLog('CREATE', 'Customer'), customerController.create);
router.put('/:id', validate(updateCustomerSchema), auditLog('UPDATE', 'Customer'), customerController.update);
router.delete('/:id', auditLog('DELETE', 'Customer'), customerController.remove);

module.exports = router;
