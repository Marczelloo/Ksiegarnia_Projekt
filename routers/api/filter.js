const express = require('express');
const router = express.Router();
const DB_Handler = require('../../models/db_handler.js');

router.get('/search', (req, res) => {
   const db_handler = new DB_Handler();

   const searchPhrase = req.query.search;

   console.log(searchPhrase);
})

router.get('/filterAndSort', async (req, res) => {
   const db_handler = new DB_Handler();
   
   const sort = req.query.sort;
   const category = req.query.category;
   const subcategory = req.query.subcategory;
   const order = req.query.order;

   let categories;
   let subcategories;

   try
   {
      categories = await db_handler.getCategories();
   }
   catch(error)
   {
      console.error(error);
      res.render('home', { books: [], success: false, errorMessage: "There was problem with loading books! Please try again later!", sort, order, category, subcategory, categoriesOptions: [],  subcategoriesOptions: [] });
   }

   try
   {
      subcategories = await db_handler.getSubcategories();
   }
   catch(error)
   {
      console.error(error);
      res.render('home', { books: [], success: false, errorMessage: "There was problem with loading books! Please try again later!", sort, order, category, subcategory, categoriesOptions: [],  subcategoriesOptions: [] });
   }

   let products = await db_handler.getAllProducts()
   .then(products => products)
   .catch(error => {
      console.error(error);
      res.render('home', { books: [], success: false, errorMessage: "There was problem with loading books! Please try again later!", sort, order, category, subcategory, categoriesOptions: [],  subcategoriesOptions: [] });
   })

   if(category)
   {
      products = filterProducts(products, category, 'category');
   }

   if(subcategory)
   {
      products = filterProducts(products, subcategory, 'subcategory');
   }

   if(sort)
   {
      products = sortProducts(products, sort);
   }

   if(order)
   {
      products = changeOrderOfProducts(products, order);
   }

   if(products.length === 0)
   {
      res.render('home', { books: [], success: true, errorMessage: null, sort, order, category, subcategory, categoriesOptions: categories, subcategoriesOptions: subcategories });
   }
   else
   {
      res.render('home', { books: products, success: true, errorMessage: null, sort, order, category, subcategory, categoriesOptions: categories, subcategoriesOptions: subcategories });
   }

});

module.exports = router;

function sortProducts(products, sortOption) 
{
   return products.sort((a, b) => {
      switch (sortOption) {
          case 'author':
              return a.author.localeCompare(b.author);
          case 'title':
              return a.title.localeCompare(b.title);
          case 'price':
              return a.price - b.price;
          case 'pages':
              return a.pages - b.pages;
          default:
              return 0;
      }
  });
}

function filterProducts(products, filterOption, filteredVarName)
{
   return products.filter(product => product[filteredVarName] === filterOption);
}

function changeOrderOfProducts(products, orderOption) {
   if (orderOption === 'desc') {
       return products.reverse();
   }

   return products;
}