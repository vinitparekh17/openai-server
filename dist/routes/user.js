'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
const router = require('express').Router();
const auth_middleware_1 = require('../middlewares/auth.middleware');
const userController_1 = require('../controllers/userController');
router.route('/signin').post(userController_1.signIn);
router.route('/signup').post(userController_1.signUp);
router
  .route('/:id')
  .post(auth_middleware_1.requireAuth, userController_1.getUser);
router
  .route('/user/')
  .get(auth_middleware_1.requireAuth, userController_1.Protected);
router
  .route('/resetpassword')
  .get(auth_middleware_1.requireAuth, userController_1.passwardReset);
router
  .route('/forgotpassword')
  .post(auth_middleware_1.requireAuth, userController_1.forgotPassword);
exports.default = router;
//# sourceMappingURL=user.js.map
