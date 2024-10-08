const express = require('express');
const DB_Handler = require('../../models/db_handler');
const router = express.Router();

router.get('/', async (req, res) => {
   const logged = req.session.user ? true : false;

   const sort = req.query.sort || "";
   const order = req.query.order || "";
   const category = req.query.category || '';
   const subcategory = req.query.subcategory || '';

   const db_handler = new DB_Handler();
   
   let categories;
   let subcategories;

   try
   {
      categories = await db_handler.getCategories();
   }
   catch(error)
   {
      console.error(error);
      res.render('home', { books: [], success: false, errorMessage: "There was problem with loading books! Please try again later!", sort, order, category, subcategory, categoriesOptions: [],  subcategoriesOptions: [], logged});
   }

   try
   {
      subcategories = await db_handler.getSubcategories();
   }
   catch(error)
   {
      console.error(error);
      res.render('home', { books: [], success: false, errorMessage: "There was problem with loading books! Please try again later!", sort, order, category, subcategory, categoriesOptions: [],  subcategoriesOptions: [], logged });
   }

   db_handler.getAllProducts()
   .then(products => {
      res.render('home', { books: products, success: true, errorMessage: null, sort, order, category, subcategory, categoriesOptions: categories, subcategoriesOptions: subcategories, logged });
   })
   .catch(error => {
      console.error(error);
      res.render('home', { books: [], success: false, errorMessage: "There was problem with loading books! Please try again later!", sort, order, category, subcategory, categoriesOptions: [],  subcategoriesOptions: [], logged });
   });
})

module.exports = router;