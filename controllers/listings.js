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

// GET /listings/:listingId
router.get('/:listingId', async (req, res) => {
    try {
        const listing = await Listing.findById(req.params.listingId).populate(
            'owner'
        )

        const userHasFavorited = listing.favoritedByUsers.some((user) =>
            user.equals(req.session.user._id)
        )

        res.render('listings/show.ejs', {
            listing,
            userHasFavorited,
        })
    } catch (error) {
        console.log(error)
        res.redirect('/')
    }
})

// DELETE /listings/:listingId
router.delete('/:listingId', async (req, res) => {
    try {
        const listing = await Listing.findById(req.params.listingId)
        if (listing.owner.equals(req.session.user._id)) {
            await listing.deleteOne()
            res.redirect('/listings')
        } else {
            res.send("You don't have permission to do that.")
        }
    } catch (error) {
        console.error(error)
        res.redirect('/')
    }
})

// GET /listings/:listingId/edit
router.get('/:listingId/edit', async (req, res) => {
    try {
        const currentListing = await Listing.findById(req.params.listingId)
        res.render('listings/edit.ejs', {
            listing: currentListing,
        })
    } catch (error) {
        console.log(error)
        res.redirect('/')
    }
})

// PUT /listings/:listingId
router.put('/:listingId', async (req, res) => {
    try {
        const currentListing = await Listing.findById(req.params.listingId)
        if (currentListing.owner.equals(req.session.user._id)) {
            await currentListing.updateOne(req.body)
            res.redirect('/listings')
        } else {
            res.send("You don't have permission to do that.")
        }
    } catch (error) {
        console.log(error)
        res.redirect('/')
    }
})

// POST /listings/:listingId/favorited-by/:userId
router.post('/:listingId/favorited-by/:userId', async (req, res) => {
    try {
        await Listing.findByIdAndUpdate(req.params.listingId, {
            $push: { favoritedByUsers: req.params.userId },
        })
        res.redirect(`/listings/${req.params.listingId}`)
    } catch (error) {
        console.log(error)
        res.redirect('/')
    }
})

// DELETE /listings/:listingId/favorited-by/:userId
router.delete('/:listingId/favorited-by/:userId', async (req, res) => {
    try {
        await Listing.findByIdAndUpdate(req.params.listingId, {
            $pull: { favoritedByUsers: req.params.userId },
        })
        res.redirect(`/listings/${req.params.listingId}`)
    } catch (error) {
        console.log(error)
        res.redirect('/')
    }
})

module.exports = router
