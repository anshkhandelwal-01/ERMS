const express = require('express');
const router = express.Router();
const passport = require('passport');
const userController = require('../controllers/user_controller');

router.get('/profile/:id', passport.checkAuthentication, userController.profile);
router.get('/sign-up', userController.signUp);
router.get('/sign-in', userController.signIn);
router.post('/create', userController.create);
router.post('/create-session', passport.authenticate(
    'local',
    {failureRedirect: '/users/sign-in'},
) ,userController.createSession);

router.get('/sign-out', userController.destroySession);
router.get('/edit/:id', userController.edit);
router.post('/update/:id', userController.update);
router.get('/employee', userController.employee);
router.get('/createAdmin/:id', userController.createAdmin);
router.get('/removeAdmin/:id', userController.removeAdmin);
router.get('/remove/:id', userController.remove);
router.post('/completeReview', userController.completeReview);
router.post('/createReview', userController.createReview);


module.exports = router;