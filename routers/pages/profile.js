const express = require('express');
const DB_Handler = require('../../models/db_handler');
const router = express.Router();

router.get('/', async (req, res) => {
   const logged = req.session.user ? true : false;

   if(!logged)
   {
      res.redirect('/login');
      return;
   }

   const db_handler = new DB_Handler();

   const user = req.session.user;

   db_handler.getOrderByUser(user.email)
   .then(orders => {
      res.render('profile', { logged, user, orders, success: true, errorMessage: null });
   })
   .catch(error => {
      console.error(error);
      res.render('profile', { logged, user, orders: null, success: false, errorMessage: "There was problem with loading orders! Please try again later!" });
      return;
   })
})

module.exports = router;