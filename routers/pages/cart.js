const express = require('express');
const User = require('../../models/user');
const router = express.Router();

router.get('/', (req, res) => {
   if(req.session.user)
   {
      if(req.session.user.cart.length == 0)
      {
         res.render('cart', { items: [], logged: true});
      }
      else
      {  
         console.log(req.session.user)
         const user = User.fromSession(req.session.user);
         const cartPrice = user.cart.calculateTotal();
         const discountPrice = cartPrice - user.cart.appyDiscount();
         const cartTotal = user.cart.appyDiscount();
         console.log(user);
         req.session.user = user;
         res.render('cart', { items: req.session.user.cart.items, cartPrice, discountPrice, cartTotal, logged: true});
      }
   }
   else
   {
      res.render('cart', { items: [], logged: false });
      return
   }
})

module.exports = router;