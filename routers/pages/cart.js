const express = require('express');
const User = require('../../models/user');
const { Cart } = require('../../models/cart');
const router = express.Router();

router.get('/', (req, res) => {
   if (req.session.user) 
   {
      console.log(req.session.user);

      console.log(Cart.fromSession(req.session.user.cart));

      const user = User.fromSession(req.session.user);
   
      console.log("user", user);

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

         console.log("cartPrice", cartPrice);
         console.log("discountPrice", discountPrice);
         console.log("cartTotal", cartTotal);

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