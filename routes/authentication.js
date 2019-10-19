const User = require("../models/user");
const jwt = require('jsonwebtoken');
const config = require('../config/database');

module.exports = (router) => {
  router.post("/register", (req, res) => {
    if (!req.body.fullName) {
      res.json({ success: false, message: 'You must provide your full name'})
    } else {
      if (!req.body.email) {
        res.json({ success: false, message: 'You must provide an email'})
      } else {
        if (!req.body.username) {
          res.json({ success: false, message: 'You must provide a username'})
        } else {
          if (!req.body.password) {
            res.json({ success: false, message: 'You must provide a password'})
          } else {
            const user = new User ({
              fullName: req.body.fullName,
              email: req.body.email.toLowerCase(),
              username: req.body.username.toLowerCase(),
              password: req.body.password
            });
            user.save((err) => {
              if (err) {
                if (err.code === 11000) {
                  res.json({ success: false, message: 'Username or e-mail already exist!'})
                } else {
                  if (err.errors) {
                    if (err.errors.fullName) {
                      res.json({ success: false, message: err.errors.fullName.message });
                    } else {
                      if (err.errors.email) {
                        res.json({ success: false, message: err.errors.email.message });
                      } else {
                        if (err.errors.username) {
                          res.json({ success: false, message: err.errors.username.message });
                        } else {
                          if (err.errors.password) {
                            res.json({ success: false, message: err.errors.password.message });
                          } else {
                            res.json({ success: false, message: err });
                          }
                        }
                      }
                    }
                  } else {
                    res.json({ success: false, message: 'Could NOT register User. Error! ', err})
                  }
                }
              } else {
                res.json({ success: true, message: 'Account registration Successful'})
              }
            });
          }
        }
      }
    }
  });

  router.get('/checkFullName/:fullName', (req, res) => {
    if(!req.params.fullName) {
      res.json({ success: false, message: 'Name was not provided' })
    } else {
      User.findOne({ fullName: req.params.fullName }, (err, user) => {
        if (err) {
          res.json({ success: false, message: err });
        } else {
          if (user) {
            res.json({ success: false, message: 'Name is already taken' });
          } else {
            res.json({ success: true, message: 'Name is available' });
          }
        }
      });
    }
  });

  router.get('/checkEmail/:email', (req, res) => {
    if(!req.params.email) {
      res.json({ success: false, message: 'Email was not provided' })
    } else {
      User.findOne({ email: req.params.email }, (err, user) => {
        if (err) {
          res.json({ success: false, message: err });
        } else {
          if (user) {
            res.json({ success: false, message: 'Email is already taken' });
          } else {
            res.json({ success: true, message: 'Email is available' });
          }
        }
      });
    }
  });

  router.get('/checkUsername/:username', (req, res) => {
    if(!req.params.username) {
      res.json({ success: false, message: 'Username was not provided' })
    } else {
      User.findOne({ username: req.params.username }, (err, user) => {
        if (err) {
          res.json({ success: false, message: err });
        } else {
          if (user) {
            res.json({ success: false, message: 'Username is already taken' })
          } else {
            res.json({ success: true, message: 'Username is available' })
          }
        }
      });
    }
  });

  router.post('/login', (req, res) => {
    if (!req.body.username) {
      res.json({ success: false, message: 'No username was provided'});
    } else {
      if (!req.body.password) {
        res.json({ success: false, message: 'No password was provided'});
      } else {
        User.findOne({ username: req.body.username.toLowerCase() }, (err, user) => {
          if (err) {
            res.json({ success: false, message: err })
          } else {
            if (!user) {
              res.json({ success: false, message: 'Username not found in our database.' });
            } else {
              const validPassword = user.comparePassword(req.body.password);
              if (!validPassword) {
                res.json({ success: false, message: 'Password invalid, please try again!.' });
              } else {
                const token = jwt.sign(
                  { userId: user._id }, 
                  config.secret, 
                  { expiresIn: '24h' }
                );
              res.json({ success: true, message: 'You are now logged in!.', token: token, user: { username: user.username} });
              }
            }
          }
        });
      }
    }
  });

  router.use((req, res, next) => {
   const token = req.headers['authorization'];
    if (!token) {
      res.json({ success: false, message: 'No token provided'});
    } else {
      jwt.verify(token, config.secret, (err, decoded) => {
        if (err) {
          res.json({ success: false, message: 'Token invalid: ' + err });
        } else {
          req.decoded = decoded;
          next();
        }
      });
    }
  });

  router.get('/profile', (req, res) => {
   User.findOne({ _id: req.decoded.userId }).select('username email fullName').exec((err, user) => {
     if (err) {
       res.json({ success: false, message: err });
     } else {
       if(!user) {
        res.json({ success: false, message: 'User not found!' });
       } else {
         res.json({ success: true, user: user});
       }
     }
   });
  });

  router.get('/publicProfile/:username', (req, res) => {
    if (!req.params.username) {
      res.json({ success: false, message: 'No username was provided/' });
    } else {
      User.findOne({ username: req.params.username }).select('username email').exec((err, user) => {
        if (err) {
          res.json({ success: false, message: 'Something went wroong' });
        } else {
          if (!user) {
            res.json({ success: false, message: 'Username not found.' });
          } else {
            res.json({ success: true, user: user });
          }
        }
      })
    }
  });

  return router;
};


