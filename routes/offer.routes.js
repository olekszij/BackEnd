const express = require('express');
const router = express.Router();
const fileupload = require('./../middleware/fileupload');
const isAuthenticated = require('./../middleware/isAuthenticated');
const mongoose = require('mongoose');
const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: 'durwcz0tr',
  api_key: '353686678355958',
  api_secret: 'nfiHZZXsZLQFeOVYeLlU6B5ygug',
});

const Offer = require('./../models/Offer');

router.post(
  '/offer/publish',
  isAuthenticated,
  fileupload(),
  async (req, res) => {
    try {
      /**
       *  const convertToBase64 = (file) => {
        return `data:${file.mimetype};base64,${file.data.toString('base64')}`;
      };

      convertToBase64(req.files.pictures[0]); //data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEsAAACKCAYAAADi+rbsE2RQU

      console.log(convertToBase64(req.files.picture));
       *
       *
       *
       */
      console.log(req.body);
      console.log(req.file);

      const newOffer = new Offer({
        product_name: req.body.title,
        product_description: req.body.description,
        product_price: req.body.price,
        //product_details: req.body.product_details,
        /** array of :  condition: 'ok',
        city: 'Bagdad',
        brand: 'Nike',
        size: '67',
        color: */
        product_image: req.body.product_image,
        owner: req.user,
      });

      //save in DB
      const savedOffer = await newOffer.save();

      await res.status(201).json(savedOffer);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }
);
module.exports = router;
