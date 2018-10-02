var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Slab = require('../models/slab.js');

//list all
router.get('/', async function(req, res, next) {
  try {
    const slabs = await Slab.find({ hidden: false }).exec()
    res.json(slabs)
  } catch (err) {
    next(err)
  }
});

//create
router.post('/', async function(req, res, next) {
  try {
    const slab = await Slab.create(req.body)
    res.json(slab)
  } catch (err) {
    next(err)
  }
});

//master
router.get('/master', async function(req, res, next) {
  try {
  let master = await Slab.findOne({ master: true })
      .populate({
        path: 'tables',
        populate: {
          path: 'columns',
          model: 'Column',
          select: '-_id -_tableId -__v -aka -description -friendly -updated'},
        select: '_id friendly name columns'}).exec()

    if (!master) {
      master = new Slab({
        name: "*master",
        master: true,
        description: "This is the master slab database where all other databases should be referenced from" })
      master = await Slab.create(master)
    }

    res.json(master)
  } catch (err) {
    next(err)
  }
});

//read
router.get('/:id', async function(req, res, next) {
  try {
    const slab = await Slab.findById(req.params.id)
      .populate({
        path: 'tables',
        select: 'tables friendly',
        options: { sort: 'friendly' }}).exec()
    res.json(slab)
  } catch (err) {
    next(err)
  }
});

//update
router.put('/:id', async function(req, res, next) {
  try {
    const slab = await Slab.findByIdAndUpdate(req.params.id, req.body).exec()
    res.json(slab)
  } catch (err) {
    next(err)
  }
});


// fake delete
router.delete('/:id', async function(req, res, next) {
  try {
    const slab = await Slab.findByIdAndUpdate(
      req.params.id,
      { $set: { "hidden": true }}).exec()
    res.json(slab)
  } catch (err) {
    next(err)
  }
});

module.exports = router;
