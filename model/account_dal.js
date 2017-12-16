var mysql   = require('mysql');
var db  = require('./db_connection.js');

var connection = mysql.createConnection(db.config);


exports.getAll = () => {
  return new Promise((resolve, reject) => {
    let myquery = 'select * from account;';
    connection.query(myquery, (err, result) => {
      err ? reject(err) : resolve(result);
    });
  });
}

exports.getAllC = function(callback) {

    var query = 'SELECT * FROM account;';

    connection.query(query, function(err, result) {
        callback(err, result);
    });
};

exports.join = () => {
  return new Promise((resolve, reject) => {
    let myquery = 'select * from account left join account_company on account.account_id = account_company.account_id;';
    connection.query(myquery, (err, result) => {
      err ? reject(err) : resolve(result);
    });
  });
}

exports.delete = (id) => {
  return new Promise((resolve, reject) => {
    let myquery = `delete from account where account_id = ${connection.escape(id)}`;
    connection.query(myquery, (err, result) => {
      err ? reject(err) : resolve(result);
    });
  })
}

exports.edit = (object) => {
  return new Promise((resolve, reject) => {
    let { email, account_id } = object;
    let myquery = `update account set email=${connection.escape(email)} where account_id=${connection.escape(account_id)}`;
    connection.query(myquery, (err, result) => {
      err ? reject(err) : resolve(result);
    });
  })
}


exports.getById = function(account_id, callback) {
    var query = 'SELECT u.*, s.school_name, k.skill_name, c.company_name FROM account u ' +
        'LEFT JOIN account_school at on at.account_id = u.account_id ' +
        'LEFT JOIN school s on s.school_id = at.school_id ' +
        'LEFT JOIN account_skill ak on ak.account_id = u.account_id ' +
        'LEFT JOIN skill k on k.skill_id = ak.skill_id ' +
        'LEFT JOIN account_company ac on ac.account_id = u.account_id ' +
        'LEFT JOIN company c on c.company_id = ac.company_id ' +
        'WHERE u.account_id = ?';
    var queryData = [account_id];
    console.log(query);

    connection.query(query, queryData, function(err, result) {

        callback(err, result);
    });
};

exports.insert = function(params, callback) {

    // FIRST INSERT THE COMPANY
    var query = 'INSERT INTO account (email) VALUES (?)';

    var queryData = [params.company_name];

    connection.query(query, params.company_name, function(err, result) {

        // THEN USE THE COMPANY_ID RETURNED AS insertId AND THE SELECTED ADDRESS_IDs INTO COMPANY_ADDRESS
        var company_id = result.insertId;

        // NOTE THAT THERE IS ONLY ONE QUESTION MARK IN VALUES ?
        var query = 'INSERT INTO company_address (company_id, address_id) VALUES ?';

        // TO BULK INSERT RECORDS WE CREATE A MULTIDIMENSIONAL ARRAY OF THE VALUES
        var companyAddressData = [];
        if (params.address_id.constructor === Array) {
            for (var i = 0; i < params.address_id.length; i++) {
                companyAddressData.push([company_id, params.address_id[i]]);
            }
        }
        else {
            companyAddressData.push([company_id, params.address_id]);
        }

        // NOTE THE EXTRA [] AROUND companyAddressData
        connection.query(query, [companyAddressData], function(err, result){
            callback(err, result);
        });
    });

};