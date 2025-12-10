const express = require('express')
const router = express.Router()

const Listing = require('../models/listing')

// GET /listings
router.get('/', async (req, res) => {
    try {
        const listings = await Listing.find().populate('owner')
        res.render('listings/index.ejs', { listings })
    } catch (e) {
        console.log(e)
        res.redirect('/')
    }
})

// GET /listings/new
router.get('/new', (req, res) => {
    try {
        res.render('listings/new.ejs')
    } catch (e) {
        console.log(e)
        res.redirect('/')
    }
})

// POST /listings
router.post('/', async (req, res) => {
    try {
        req.body.owner = req.session.user._id
        await Listing.create(req.body)
        res.redirect('/listings')
    } catch (e) {
        console.log(e)
        res.redirect('/')
    }
})

module.exports = router
