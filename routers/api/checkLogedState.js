const express = require('express');
const User = require('../../models/user');
const router = express.Router();

router.get('/', (req, res) => {
   if(req.session.user) 
   {
      const user = req.session.user;

      if(typeof user === 'object')
      {
         res.status(200).send({ loggedIn: true });
      }
      else
      {
         res.status(401).send({ loggedIn: false });
      }
   }
   else
   {
      res.status(401).send({ loggedIn: false });
   }


   // const cookies = req.cookies;

   // if(cookies && cookies.user)
   // {
   //    const user = JSON.parse(cookies.user);

   //    if(typeof user === 'object' && user.username && user.email && user.password)
   //    {
   //       res.status(200).send({ loggedIn: true });
   //    }
   // }
   // else
   // {
   //    res.status(401).send({ loggedIn: false});
   // }
})

module.exports = router;