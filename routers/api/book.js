const express = require('express');
const router = express.Router();
const DB_Handler = require('../../models/db_handler');

router.get('/categories', (req, res) => {
   try
   {
      const db_handler = new DB_Handler();
      db_handler.getCategories()
      .then(categories => {
         res.json({ success: true, categories});
      })
      .catch(error => {
         res.json({ success: false, message: error.message });
      })
   }
   catch(error)
   {
      console.error(error);
      res.json({ success: false, message: error.message });
   }
})

router.get('/subcategories', (req, res) => {
   try
   {
      const db_handler = new DB_Handler();
      db_handler.getSubcategories()
      .then(subcategories => {
         res.json({ success: true, subcategories});
      })
      .catch(error => {
         res.json({ success: false, message: error.message });
      })
   }
   catch(error)
   {
      console.error(error);
      res.json({ success: false, message: error.message });
   }
})

router.get('/bookByCategory:category', (req, res) => {
   try
   {
      const db_handler = new DB_Handler();
      db_handler.getBooksByCategory(req.params.category)
      .then(books => {
         res.json({ success: true, books });
      })
      .catch(error => {
         res.json({ success: false, message: error.message });
      })
   }
   catch(error)
   {
      console.error(error);
      res.json({ success: false, message: error.message });
   }
})

router.get('/bookBySubcategory:subcategory', (req, res) => {
   try
   {
      const db_handler = new DB_Handler();
      db_handler.getBooksByCategorySubcategory(req.params.category, req.params.subcategory)
      .then(books => {
         res.json({ success: true, books });
      })
      .catch(error => {
         res.json({ success: false, message: error.message });
      })
   }
   catch(error)
   {
      console.error(error);
      res.json({ success: false, message: error.message });
   }
})

router.get('/all', (req, res) => {
   try 
   {
      const db_handler = new DB_Handler();
      db_handler.getBooks()
      .then(books => {
         res.json(books);
      })
      .catch(error => {
         res.json({ error: error.message });
      })
   }
   catch(error) 
   {
      console.error(error);
      res.json({ error: error.message });
   } 
})

module.exports = router;