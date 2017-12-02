const Category = require('../models/category');

function getDataForUser(req,res,next) {
  const userGroupId = parseInt(req.user.userGroupId);
  if (req.body.users.length === 0) {
    res.status(200)
      .json({
        status: 'success',
        data: {},
        message: 'Käyttäjiä ei valittu.'
      });
    return;
  }
  const users = JSON.parse("[" + req.body.users + "]");
  const successCall = (data) => {
    res.status(200)
      .json({
        status: 'success',
        data: groupSumsByCategory(data),
        message: 'Analyysidatat haettu.'
      });
  };

  Category.getAnalysisDataForUsers(userGroupId, users, successCall, next);
}

function getTemplateObject(untilDate) {
  let rollingDate = new Date('2014-01-01');
  let obj = {};
  while(rollingDate <= untilDate) {
    let year = rollingDate.getFullYear();
    obj[year] = 0;
    rollingDate.setMonth(rollingDate.getMonth()+12);
  }
  return obj;
}

function groupSumsByCategory(data) {
 let sumsByCategory = {};

 for (let i = 0; i < data.length; i++) {
   let s = data[i];
   if(!sumsByCategory.hasOwnProperty(s.name)) {
     sumsByCategory[s.name] = getTemplateObject(new Date());
   }
   sumsByCategory[s.name][s.year] = s.sum;
 }
 return sumsByCategory;
}

module.exports = {
  getDataForUser: getDataForUser
};
