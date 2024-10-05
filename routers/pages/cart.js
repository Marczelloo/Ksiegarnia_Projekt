const express = require('express');
const User = require('../../models/user');
const { Cart } = require('../../models/cart');
const router = express.Router();

router.get('/', (req, res) => {
   if (req.session.user) 
   {
      const user = User.fromSession(req.session.user);
   
      if (user.cart.items.length === 0) 
      {
         res.render('cart', { 
            items: [], 
            cartPrice: 0,
            discountPrice: 0,
            cartTotal: 0,
            logged: true 
         });
      } 
      else 
      {
         const cartPrice = parseFloat(user.calculate_cart_total()).toFixed(2);
         const discountPrice = parseFloat(cartPrice - user.apply_discount()).toFixed(2);
         const cartTotal = parseFloat(user.apply_discount()).toFixed(2);

         res.render('cart', { 
            items: user.cart.items, 
            cartPrice, discountPrice, 
            cartTotal, 
            logged: true 
         });
      }
   } 
   else 
   {
      res.render('cart', { 
         items: [], 
         cartPrice: 0,
         discountPrice: 0,
         cartTotal: 0,
         logged: false 
      });
   }
});

module.exports = router;