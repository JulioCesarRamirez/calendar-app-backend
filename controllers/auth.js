const { request, response } = require('express');
const bcrypt = require('bcryptjs');

const User = require('../models/User');
const { generateJWT } = require('../helpers/jwt');

const createUser = async (req = request, res = response) => {
  const { name, email, password } = req.body;

  try {
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({
        ok: false,
        msg: 'This is user already exist with this email',
      });
    }
    user = new User(req.body);

    const salt = bcrypt.genSaltSync();
    user.password = bcrypt.hashSync(password, salt);

    await user.save();

    const token = await generateJWT(user.id, user.name);

    res.status(201).json({
      ok: true,
      uid: user.id,
      name: user.name,
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: 'Please contact admin for more details',
    });
  }
};

const loginUser = async (req = request, res = response) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        ok: false,
        msg: 'This is user does not exist with this email',
      });
    }
    const validPass = bcrypt.compareSync(password, user.password);
    if (!validPass) {
      return res.status(400).json({
        ok: false,
        msg: 'Wrong password',
      });
    }
    const token = await generateJWT(user.id, user.name);

    res.status(200).json({
      ok: true,
      uid: user.id,
      name: user.name,
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: 'Please contact admin for more details',
    });
  }
};

const revalidateToken = async (req, res = response) => {
  const { uid, name } = req;

  const token = await generateJWT(uid, name);

  res.json({
    ok: true,
    msg: 'renew',
    token,
  });
};

module.exports = {
  createUser,
  loginUser,
  revalidateToken,
};
