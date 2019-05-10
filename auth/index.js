const express = require('express');
const bcrypt = require('bcrypt');


const router = express.Router();

const User = require('../db/user');
//Route paths are /auth
router.get('/', (req, res) => {
  res.json({
    message: 'locked'
  });
});


function validUser(user){
  const validEmail = typeof user.email == 'string' &&
                        user.email.trim() != '';
  const validPassword = typeof user.password == 'string' &&
                        user.password.trim() != '' &&
                        user.password.trim().length >= 6;
  return validEmail && validPassword;
}

router.post('/signup', (req, res, next) => {
if(validUser(req.body)) {
     User
        .getOneByEmail(req.body.email)
        .then(user => {
          console.log('user', user);
          //if user not found
          if(!user) {
            //unique email
            //hash password
            bcrypt.hash(req.body.password, 10)
               .then((hash)=> {
            // insert into DB
                const user = {
                  email: req.body.email,
                  password:hash,
                  created_at: new Date()
                };

                User
                  .create(user)
                  .then(id => {
                    res.json({
                       id,
                       message: 'signed'
                   });
                  });
            //debug

            });
          }
          else{
            //email in use
            next(new Error('Email in use'));
          }
     });
  } else {
  //send an error
  next(new Error('Invalid user'));
  }
});

router.post('/login', (req, res, next) => {
  if(validUser(req.body)){
    //ceck in DB
    User
       .getOneByEmail(req.body.email)
       .then(user => {
         console.log('user', user);
         if(user) {
         //compare pass with hash pass
            bcrypt
              .compare(req.body.password, user.password)
              .then((result) => {
        // if two password match
              if(result){
                res.json({
                    result,
                    message: ' Loggin in ...'
                  });
                }else{
                  next(new Error('Invalid login'));
                }
              });

         }else{
           next(new Error('Invalid login'));
         }
       });
    }else{
        next(new Error('Invalid login'));
  }
});

module.exports = router;
