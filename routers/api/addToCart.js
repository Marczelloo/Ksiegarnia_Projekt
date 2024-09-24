const express = require('express');
const router = express.Router();
const DB_Handler = require('../../models/db_handler');

router.post('/', (req, res) => {
   const db_handler = new DB_Handler();
   const bookTitle = req.body.title;

   console.log("Book title: " + bookTitle);

   db_handler.getBookByTitle(bookTitle)
   .then(book => {
      console.log(book);
   })
   .catch(error => {
      if(error.message == "Book not found")
      {
         db_handler.getMultiVolumeBookByTitle(bookTitle)
         .then(book => {
            console.log(book);
         })
         .catch(error => {
            console.error(error);
            res.json({ success: false, errorMessage: "There was problem with loading book! Please try again later!" });
         });
      }
      else
      {
         console.error(error);
         res.json({ success: false, errorMessage: "There was problem with loading book! Please try again later!" });
      }
   })

})

module.exports = router;