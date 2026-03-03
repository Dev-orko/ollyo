const router = require('express').Router();
const productController = require('./product.controller');
const validate = require('../../middleware/validate');
const { authenticate } = require('../../middleware/auth');
const auditLog = require('../../middleware/auditLog');
const {
  createProductSchema,
  updateProductSchema,
  productQuerySchema,
} = require('./product.validation');

router.use(authenticate);

router.get('/', validate(productQuerySchema, 'query'), productController.getAll);
router.get('/:id', productController.getById);
router.post('/', validate(createProductSchema), auditLog('CREATE', 'Product'), productController.create);
router.put('/:id', validate(updateProductSchema), auditLog('UPDATE', 'Product'), productController.update);
router.delete('/:id', auditLog('DELETE', 'Product'), productController.remove);

module.exports = router;
