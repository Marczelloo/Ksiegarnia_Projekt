const express = require('express');
const router = express.Router();

const items = [];

router.get('/', (req, res) => {
   res.render('cart', { items: items});
})

module.exports = router;