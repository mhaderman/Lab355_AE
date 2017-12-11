var express = require('express');
var router = express.Router();
var account_dal = require('../model/account_dal');
var inserts = require('../model/inserts_universal.js');

router.get('/all', (req, res) => {
  account_dal.getAll()
  .then(account => {
    //res.render('account/accountall', {account});
    res.render('account/accountall', {account});
  })
  .catch(err => {res.send(err);});
});

router.post('/insert', (req, res) => {
  inserts.insert('account', req.body.account)
  .then(setTimeout(() => {res.redirect('/account/all')}, 200))
  .catch(err => console.log(err));
})

router.get('/delete/:id', (req, res) => {
  let id = req.params.id;
  console.log('${id} is the id');
  account_dal.delete(id)
  .then(setTimeout(() => {res.redirect('/account/all')}, 200))
  .catch(err => console.log(err));
});

router.post('/edit', (req, res) => {
  account_dal.edit(req.body.account)
  .then(setTimeout(() => {res.redirect('/account/all')}, 200))
  .catch(err => console.log(err));
})

// View the company for the given id
router.get('/', function(req, res){
    if(req.query.account_id == null) {
        res.send('account_id is null');
    }
    else {
        account_dal.getById(req.query.account_id, function(err,result) {
            if (err) {
                res.send(err);
            }
            else {
                //res.render('company/companyViewById', {'result': result});
                res.render('account/accountViewById', {'result': result});
            }
        });
    }
});

module.exports = router;
