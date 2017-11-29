const express = require('express');
const passport = require('./config/passport');
const Bill = require('./bill');
const Category = require('./category');
const Analysis = require('./analysis');
const UsersController = require('./controllers/users-controller');
const AdjustmentsController = require('./controllers/adjustments-controller');

const router = express.Router();

router.post('/signup', UsersController.signUp);
router.post('/login', UsersController.logIn);
router.get('/users', passport.authenticate('jwt', { session: false }), UsersController.getUsers);

router.get('/adjustments', passport.authenticate('jwt', { session: false }), AdjustmentsController.getAdjustments);
router.post('/adjustments', passport.authenticate('jwt', { session: false }), AdjustmentsController.createAdjustments);
router.put('/adjustments', passport.authenticate('jwt', { session: false }), AdjustmentsController.updateAdjustments);
router.delete('/adjustments/:id', passport.authenticate('jwt', { session: false }), AdjustmentsController.deleteAdjustment);

router.get('/bills', passport.authenticate('jwt', { session: false }), Bill.getBills);
router.post('/bills', passport.authenticate('jwt', { session: false }), Bill.createBills);
router.put('/bills', passport.authenticate('jwt', { session: false }), Bill.updateBills);
router.delete('/bills/:id', passport.authenticate('jwt', { session: false }), Bill.deleteBill);

router.get('/categories', passport.authenticate('jwt', { session: false }), Category.getCategories);
router.post('/categories', passport.authenticate('jwt', { session: false}), Category.createCategories);
router.put('/categories', passport.authenticate('jwt', { session: false}), Category.updateCategories);
router.delete('/categories/:id', passport.authenticate('jwt', { session: false }), Category.deleteCategory);

router.post('/analysis', passport.authenticate('jwt', { session: false }), Analysis.getDataForUser);

module.exports = router;
