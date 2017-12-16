var express = require('express');
var router = express.Router();
var account_dal = require('../model/account_dal');
var inserts = require('../model/inserts_universal.js');
var school_dal = require('../model/school_dal.js');

router.get('/all', (req, res) => {
  account_dal.getAll()
  .then(account => {
    //res.render('account/accountall', {account});
    res.render('account/accountall', {account});
  })
  .catch(err => {res.send(err);});
});

router.post('/insert', (req, res) => {
  inserts
      .insert('account', req.body.account)
      .then(setTimeout(() => {res.redirect('/account/all')}, 200))
      .catch(err => res.send(err));
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

router.get('/inserts', function(req, res){
    // simple validation
    if(req.query.email == null) {
        res.send('Email must be provided.');
    }
    else if(req.query.first_name == null) {
        res.send('A first name must be provided');
    }
    else if(req.query.last_name == null) {
        res.send('A last name must be provided');
    }
    else {
        // passing all the query parameters (req.query) to the insert function instead of each individually
        account_dal.insert(req.query, function(err,result) {
            if (err) {
                console.log(err)
                res.send(err);
            }
            else {
                //poor practice for redirecting the user to a different page, but we will handle it differently once we start using Ajax
                res.redirect(302, '/company/all');
            }
        });
    }
});

router.get('/add', function(req, res){
    // passing all the query parameters (req.query) to the insert function instead of each individually
    school_dal.getAllC(function(err,result) {
        if (err) {
            console.log(result);
            res.send(err);
        }
        else {
            console.log(result);
            res.render('school/schoolAdd', {'school': result});
        }
    });
});


module.exports = router;
