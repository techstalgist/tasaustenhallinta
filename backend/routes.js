const express = require('express');
const passport = require('./config/passport');
const AnalysisController = require('./controllers/analysis-controller');
const UsersController = require('./controllers/users-controller');
const AdjustmentsController = require('./controllers/adjustments-controller');
const BillsController = require('./controllers/bills-controller');
const CategoriesController = require('./controllers/categories-controller');
const UserGroupsController = require('./controllers/user-groups-controller');
const router = express.Router();

router.post('/signup', UsersController.signUp);
router.post('/login', UsersController.logIn);
router.post('/user_groups/login', UserGroupsController.logIntoGroup);
router.post('/user_groups/signup', UserGroupsController.signUpGroup);
router.get('/users', passport.authenticate('jwt', { session: false }), UsersController.getUsers);

router.get('/adjustments', passport.authenticate('jwt', { session: false }), AdjustmentsController.getAdjustments);
router.post('/adjustments', passport.authenticate('jwt', { session: false }), AdjustmentsController.createAdjustments);
router.put('/adjustments', passport.authenticate('jwt', { session: false }), AdjustmentsController.updateAdjustments);
router.delete('/adjustments/:id', passport.authenticate('jwt', { session: false }), AdjustmentsController.deleteAdjustment);

router.get('/bills', passport.authenticate('jwt', { session: false }), BillsController.getBills);
router.post('/bills', passport.authenticate('jwt', { session: false }), BillsController.createBills);
router.put('/bills', passport.authenticate('jwt', { session: false }), BillsController.updateBills);
router.delete('/bills/:id', passport.authenticate('jwt', { session: false }), BillsController.deleteBill);

router.get('/categories', passport.authenticate('jwt', { session: false }), CategoriesController.getCategories);
router.post('/categories', passport.authenticate('jwt', { session: false}), CategoriesController.createCategories);
router.put('/categories', passport.authenticate('jwt', { session: false}), CategoriesController.updateCategories);
router.delete('/categories/:id', passport.authenticate('jwt', { session: false }), CategoriesController.deleteCategory);

router.post('/analysis', passport.authenticate('jwt', { session: false }), AnalysisController.getDataForUser);

module.exports = router;
