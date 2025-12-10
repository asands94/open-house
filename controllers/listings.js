const express = require('express')
const router = express.Router()

const Listing = require('../models/listing')

// GET /
router.get('/', async (req, res) => {
    try {
        const listings = await Listing.find()
        res.render('listings/index.ejs', { listings })
    } catch (e) {
        console.log(e)
        res.redirect('/')
    }
})

module.exports = router
