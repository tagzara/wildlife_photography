const router = require('express').Router();

router.get('/', (req, res) => {
    res.render('home/home', {title: 'Home'});
});

module.exports = router;