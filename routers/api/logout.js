const express = require('express');
const router = express.Router();

router.post('/', (req, res) => {
   try
   {
      req.session.destroy(err => {
         if(err)
         {
            console.error(err);
            res.status(500).send({ success: false, error: "Failed to log out!" });
         }
      })
      res.json({ success: true, message: 'User logged out successfully' });

      // res.clearCookie('user');
      // res.status(200).send({ success: true });
   }
   catch(error)
   {
      console.error(error);
      res.status(500).send({ success: false, error: error });
   }
});

module.exports = router;