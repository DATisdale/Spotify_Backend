const { User, validateLogin, validateUser } = require("../models/user");
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");
const bcrypt = require("bcrypt");
const express = require("express");
const router = express.Router();



router.post("/register", async (req, res) => {
  console.log(req.body)
  try {
    const { error } = validateUser(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    let user = await User.findOne({ email: req.body.email });
    if (user)
      return res.status(400).send(`Email ${req.body.email} already claimed!`);

    const salt = await bcrypt.genSalt(10);
    user = new User({
      name: req.body.name,
      email: req.body.email,
      password: await bcrypt.hash(req.body.password, salt),
      month: req.body.month,
      date: req.body.date,
      year: req.body.year,
      isAdmin: req.body.isAdmin,
    });

    await user.save();
    const token = user.generateAuthToken();
    return res
      .header("x-auth-token", token)
      .header("access-control-expose-headers", "x-auth-token")
      .send({
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
      });
  } catch (ex) {
    return res.status(500).send(`Internal Server Error: ${ex}`);
  }
});

router.post("/login", async (req, res) => {
  try {
    const { error } = validateLogin(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    let user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(400).send(`Invalid email or password.`);

    const validPassword = await bcrypt.compare(
      req.body.password,
      user.password
    );
    if (!validPassword)
      return res.status(400).send("Invalid email or password.");

    const token = user.generateAuthToken();
    return res.send(token);
  } catch (ex) {
    return res.status(500).send(`Internal Server Error: ${ex}`);
  }
});

// get all users

router.get("/", async (req, res) => {
  try {
    const users = await User.find();
    console.log(users)
    return res.send(users);
  } catch (ex) {
    return res.status(500).send(`Internal Server Error: ${ex}`);
  }
});

// delete user

router.delete("/:userid", [auth, admin], async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user)
      return res
        .status(400)
        .send(`User with id ${req.params.userId} does not exist!`);
    await user.remove();
    return res.send(user);
  } catch (ex) {
    return res.status(500).send(`Internal Server Error: ${ex}`);
  }
})

router.get('/current', [auth], async(req,res)=>{
  const user = await User.findById(req.user._id);
  return res.send(user);
})
module.exports = router;
