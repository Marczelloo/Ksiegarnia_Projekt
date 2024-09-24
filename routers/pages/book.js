const express = require('express');
const DB_Handler = require('../../models/db_handler');
const router = express.Router();

router.get('/:title', (req, res) => {
   const db_handler = new DB_Handler();
   const bookTitle = req.params.title;

   db_handler.getBookByTitle(bookTitle)
   .then(book => {
      res.render('book', { book: book, success: true, errorMessage: null });
   })
   .catch(error => {
      console.error(error);
      res.render('book', { book: null, success: false, errorMessage: "There was problem with loading book! Please try again later!" });
   })
   
   
});

module.exports = router;