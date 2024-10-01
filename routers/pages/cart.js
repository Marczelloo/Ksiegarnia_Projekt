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
         const cartPrice = user.calculate_cart_total();
         const discountPrice = cartPrice - user.apply_discount();
         const cartTotal = user.apply_discount();

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