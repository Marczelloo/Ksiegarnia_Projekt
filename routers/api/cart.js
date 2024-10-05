const express = require('express');
const router = express.Router();
const User = require('../../models/user');

router.post('/update', (req, res) => {
   if(req.session.user)
   {
      const user = User.fromSession(req.session.user);
      const { title, quantity } = req.body;

      const cartItem = user.cart.items.find(item => item.book.title == title);
      if(cartItem)
      {
         cartItem.quantity = quantity;

         const cartPrice = user.calculate_cart_total();
         const discountPrice = cartPrice - user.apply_discount();
         const cartTotal = user.apply_discount();

         req.session.user = user.toJSON();
         res.json({ success: true, message: "Cart updated successfully!", cartPrice, discountPrice, cartTotal });
      }
      else
      {
         res.json({ success: false, errorMessage: "Book not found in cart!" });
      }
   }
   else
   {
      res.status(401).json({ success: false, errorMessage: "User not logged in!" });
   }
})

router.post('/remove', (req, res) => {
   if(req.session.user)
   {
      const user = User.fromSession(req.session.user);
      const { title } = req.body;

      const cartItemIndex = user.cart.items.findIndex(item => item.book.title === title);
      if(cartItemIndex !== -1)
      {
         user.cart.items.splice(cartItemIndex, 1);

         const cartPrice = user.calculate_cart_total();
         const discountPrice = cartPrice - user.apply_discount();
         const cartTotal = user.apply_discount();

         req.session.user = user.toJSON();
         res.json({ success: true, message: "Book removed from cart successfully!", cartPrice, discountPrice, cartTotal });
      }
      else
      {
         res.json({ success: false, errorMessage: "Book not found in cart!" });
      }
   }
   else
   {
      res.status(401).json({ success: false, errorMessage: "User not logged in!" });
   }
})

module.exports = router;