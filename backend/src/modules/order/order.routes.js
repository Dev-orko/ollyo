const router = require('express').Router();
const orderController = require('./order.controller');
const validate = require('../../middleware/validate');
const { authenticate } = require('../../middleware/auth');
const auditLog = require('../../middleware/auditLog');
const {
  createOrderSchema,
  updateOrderSchema,
  orderQuerySchema,
} = require('./order.validation');

router.use(authenticate);

router.get('/', validate(orderQuerySchema, 'query'), orderController.getAll);
router.get('/:id', orderController.getById);
router.post('/', validate(createOrderSchema), auditLog('CREATE', 'Order'), orderController.create);
router.put('/:id', validate(updateOrderSchema), auditLog('UPDATE', 'Order'), orderController.update);
router.delete('/:id', auditLog('DELETE', 'Order'), orderController.remove);

module.exports = router;
