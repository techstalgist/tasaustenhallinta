const express = require('express');
const passport = require('./config/passport');
const AnalysisController = require('./controllers/analysis-controller');
const UsersController = require('./controllers/users-controller');
const AdjustmentsController = require('./controllers/adjustments-controller');
const BillsController = require('./controllers/bills-controller');
const CategoriesController = require('./controllers/categories-controller');
const UserGroupsController = require('./controllers/user-groups-controller');
const router = express.Router();

router.post('/api/signup', UsersController.signUp);
router.post('/api/login', UsersController.logIn);
router.post('/api/user_groups/login', UserGroupsController.logIntoGroup);
router.post('/api/user_groups/signup', UserGroupsController.signUpGroup);
router.get('/api/users', passport.authenticate('jwt', { session: false }), UsersController.getUsers);
router.patch('/api/forgot-password', UsersController.forgotPassword)
router.patch('/api/reset-password/:token', UsersController.resetPassword)

router.get('/api/adjustments', passport.authenticate('jwt', { session: false }), AdjustmentsController.getAdjustments);
router.post('/api/adjustments', passport.authenticate('jwt', { session: false }), AdjustmentsController.createAdjustments);
router.put('/api/adjustments', passport.authenticate('jwt', { session: false }), AdjustmentsController.updateAdjustments);
router.delete('/api/adjustments/:id', passport.authenticate('jwt', { session: false }), AdjustmentsController.deleteAdjustment);

router.get('/api/bills', passport.authenticate('jwt', { session: false }), BillsController.getBills);
router.post('/api/bills', passport.authenticate('jwt', { session: false }), BillsController.createBills);
router.put('/api/bills', passport.authenticate('jwt', { session: false }), BillsController.updateBills);
router.delete('/api/bills/:id', passport.authenticate('jwt', { session: false }), BillsController.deleteBill);

router.get('/api/categories', passport.authenticate('jwt', { session: false }), CategoriesController.getCategories);
router.post('/api/categories', passport.authenticate('jwt', { session: false}), CategoriesController.createCategories);
router.put('/api/categories', passport.authenticate('jwt', { session: false}), CategoriesController.updateCategories);
router.delete('/api/categories/:id', passport.authenticate('jwt', { session: false }), CategoriesController.deleteCategory);

router.post('/api/analysis', passport.authenticate('jwt', { session: false }), AnalysisController.getDataForUser);

// nämä ovat UI-sovelluksen polkuja, mutta jos joku yrittää suoraan käyttää ko. polkuja ilman kirjautumista, niin ennen kirjautumista
// pyyntö menee backendiin asti => pyyntö on ohjattava uudelleen juureen
router.get('/*', sendIndexHtml);

function sendIndexHtml(req, res) {
  res.sendFile('/app/client/build/index.html');
}

module.exports = router;
