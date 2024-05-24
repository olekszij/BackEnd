const express = require('express');
const User = require('./../models/User');
const { default: mongoose } = require('mongoose');
const uid2 = require('uid2');
const SHA256 = require('crypto-js/sha256');
const encBase64 = require('crypto-js/enc-base64');

const router = express.Router();

router.post('/user/signup', async (req, res) => {
  try {
    const passwordU = req.body.password;
    const saltU = uid2(16);
    const hashU = SHA256(passwordU + saltU).toString(encBase64);

    const tokenU = uid2(20);

    const newUser = new User({
      email: req.body.email,
      account: {
        username: req.body.username,
      },
      newsletter: req.body.newsletter,
      token: tokenU,
      hash: hashU,
      salt: saltU,
    });

    await console.log(newUser);

    const userMail = await User.findOne({ email: req.body.email });

    // console.log(userMail);
    if (userMail !== null) {
      return res.status(400).json({
        message:
          "l'email renseigné lors de l'inscription existe déjà dans la base de données",
      });
    }

    if (!newUser.account.username) {
      return res.status(400).json({
        message: "le username n'est pas renseigné",
      });
    }

    //console.log(newUser);

    res.status(201).json({
      _id: newUser._id,
      token: tokenU,
      account: newUser.account,
    });
    await newUser.save();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// user/login

router.post('/user/login', async (req, res) => {
  try {
    const emailFromBody = req.body.email;

    const dataUserFromDB = await User.findOne({ email: req.body.email });
    console.log(dataUserFromDB);
    const dataUserResponse = {
      _id: dataUserFromDB._id,
      token: dataUserFromDB.token,
      account: {
        username: dataUserFromDB.account.username,
      },
    };

    /**   start */
    const passwordHased = SHA256(
      req.body.password + dataUserFromDB.salt
    ).toString(encBase64);

    console.log(passwordHased);

    if (passwordHased === dataUserFromDB.hash) {
      res.status(201).json('Passoword is good');
    } else {
      res.status(403).json('Password is not good');
    }

    /**   end */

    console.log(dataUserResponse);
    res.json(dataUserResponse);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
