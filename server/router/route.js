import {Router} from 'express'

const router = Router();

// Import All Controller Functions
import * as controller from '../controller/AppController.js';
import {registerMail} from '../controller/mailer.js'
import {Auth, localVariables} from '../middleware/auth.js'

// Post Method
router.route('/register').post(controller.register);
router.route('/register-mail').post(registerMail);
router.route('/authenticate').post(controller.verifyUser, (req, res) => res.end());
router.route('/login').post(controller.verifyUser, controller.login);

// Get Method
router.route('/user/:username').get(controller.getUser);
router.route('/generate-otp').get(controller.verifyUser, localVariables, controller.generateOTP);
router.route('/verify-otp').get(controller.verifyUser, controller.verifyOTP);
router.route('/create-reset-session').get(controller.createResetSession);


// Put Method
router.route('/update-user').put(Auth, controller.updateUser);
router.route('/reset-password').put(controller.verifyUser, controller.resetPassword);



export default router;