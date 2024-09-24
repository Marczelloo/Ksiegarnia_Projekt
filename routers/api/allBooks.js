const express = require('express');
const DB_Handler = require('../../models/db_handler');
const router = express.Router();

router.get('/', (req, res) => {
   try {
      const db_handler = new DB_Handler();
      db_handler.getBooks()
      .then(books => {
         res.json(books);
      })
      .catch(error => {
         res.json({ error: error.message });
      })
   }
   catch(error) {
      res.json({ error: error.message });
   }
})

module.exports = router;