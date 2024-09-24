const express = require('express');
const DB_Handler = require('../../models/db_handler');
const router = express.Router();

router.get('/', (req, res) => {
   const db_handler = new DB_Handler();

   db_handler.getAllProducts()
   .then(products => {
      res.render('home', { books: products, success: true, errorMessage: null });
   })
   .catch(error => {
      console.error(error);
      res.render('home', { books: [], success: false, errorMessage: "There was problem with loading books! Please try again later!" });
   });
})

module.exports = router;