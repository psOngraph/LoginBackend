var express = require('express');
var router = express.Router();
var bcrypt = require('bcryptjs');
const { createNewToken } = require('../utils/jwt');
const responseHandler = require('../utils/responseHandler');
const { validateEmail, validatePassword } = require('../utils/validate');

const User = require('../model/user');
const { sync } = require('../utils/db');

/*
 *   Sign Up API
 */

router.route('/signup').post(async (req, res) => {
  const { email, password } = req.body;
  try {
    if (!validateEmail(email)) {
      res.status(400).send({ message: 'Email is not valid' });
    } else if (!validatePassword(password)) {
      responseHandler.failure(
        res,
        'Password must be minimum eight characters and must include at least one letter and one number',
        400
      );
    } else {
      // Hash Password
      const hashedPassword = await new Promise((resolve, reject) => {
        bcrypt.hash(password, 10, function (err, hash) {
          if (err) reject(err);
          resolve(hash);
        });
      });
      const data = await User.create({ email, password: hashedPassword });
      if (data) {
        responseHandler.data(res, data.dataValues, 200);
      }
    }
  } catch (error) {
    console.log(error);
    responseHandler.failure(res, error?.errors[0], 400);
  }
});
/*
 *   Sign In API
 */
router.route('/signin').post(async (req, res) => {
  const { email, password } = req.body;
  try {
    const data = await User.findOne({ where: { email } });
    if (data && (await bcrypt.compare(password, data.password))) {
      // Create token
      const token = await createNewToken(data.dataValues);
      data.dataValues.token = token;
      responseHandler.data(res, data.dataValues, 200);
    } else {
      responseHandler.failure(res, 'User Not Found', 400);
    }
  } catch (error) {
    console.log(error);
    responseHandler.failure(res, error, 400);
  }
});

module.exports = router;
