const express = require('express');
const router = express.Router();
const passport = require('passport');
const indexController = require('../controllers/home_controller');
const adminDashboard = require('../controllers/admin_controller');

router.get('/', indexController.home);
router.use('/users', require('./users'));
router.use('/dashboard', passport.checkAuthentication, adminDashboard.dashboard);
router.use('/admin', require('./users'));

module.exports = router;