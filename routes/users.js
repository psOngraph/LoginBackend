var express = require("express");
var router = express.Router();
var bcrypt = require("bcryptjs");
var jwt = require("jsonwebtoken");

const { validateEmail, validatePassword } = require("../utils/validate");

const User = require("../model/user");
const { sync } = require("../utils/db");

/*
 *   Sign Up API
 */

router.route("/signup").post(async (req, res) => {
  const { email, password } = req.body;
  try {
    if (!validateEmail(email)) {
      res.status(400).send({ message: "Email is not valid" });
    } else if (!validatePassword(password)) {
      res.status(400).send({
        message:
          "Password must be minimum eight characters and must include at least one letter and one number",
      });
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
        res.status(200).send(data);
      }
    }
  } catch (error) {
    console.log(error);
    res.status(400).send(error?.errors[0].message);
  }
});
/*
 *   Sign In API
 */
router.route("/signin").post(async (req, res) => {
  const { email, password } = req.body;
  try {
    const data = await User.findOne({ where: { email } });
    if (data && (await bcrypt.compare(password, data.password))) {
      // Create token
      const token = await jwt.sign(
        { email: data.email, id: data.myUuid },
        "secret", // secret key
        {
          expiresIn: "2h",
        }
      );
      data.dataValues.token = token;
      console.log("token", token);
      console.log("data is", data.dataValues);
      res.status(200).send(data.dataValues);
    } else {
      res.status(400).send({ message: "User Not found" });
    }
  } catch (error) {
    console.log(error);
    res.status(400).send(error);
  }
});

module.exports = router;
