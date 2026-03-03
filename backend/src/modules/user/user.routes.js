const router = require('express').Router();
const userController = require('./user.controller');
const validate = require('../../middleware/validate');
const { authenticate, authorize } = require('../../middleware/auth');
const auditLog = require('../../middleware/auditLog');
const { createUserSchema, updateUserSchema, userQuerySchema } = require('./user.validation');

// All user routes require authentication and ADMIN role
router.use(authenticate);
router.use(authorize('ADMIN'));

router.get('/', validate(userQuerySchema, 'query'), userController.getAll);
router.get('/:id', userController.getById);
router.post('/', validate(createUserSchema), auditLog('CREATE', 'User'), userController.create);
router.put('/:id', validate(updateUserSchema), auditLog('UPDATE', 'User'), userController.update);
router.delete('/:id', auditLog('DELETE', 'User'), userController.remove);

module.exports = router;
