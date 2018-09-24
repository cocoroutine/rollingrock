var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Column = require('../models/column.js');
var Table = require('../models/table.js');
var Slab = require('../models/slab.js');
var myauth = require('../middleware/basic.js');

//list all
router.get('/', async function(req, res, next) {
  try {
    const tables = await Table.find().exec()
    res.json(tables);
  } catch (err) {
    next(err)
  }
});

//create
router.post('/', myauth, async function(req, res, next) {
  try {
    const table = await Table.create(req.body)
    let slab = await Slab.findById(table._slabId).exec()
    slab.tables.addToSet(table._id)
    await slab.save()
    res.json(table)
  } catch (err) {
    next(err)
  }
});

//read
router.get('/:id', async function(req, res, next) {
  try {
    const table = await Table.findById(
      req.params.id,
      '_id _slabId columns description friendly isPrune isSending joins name')
    .populate({
      path: 'joins',
      populate: { path: 'columns', model: 'Column' },
      select: '_id friendly columns',
      options: { sort: 'friendly' }})
    .populate({ path:'columns' })
    .exec()
    res.json(table)
  } catch (err) {
    next(err)
  }
});

//update
router.put('/:id', myauth, async function(req, res, next) {
  try {
    const table = await Table.findByIdAndUpdate(req.params.id, req.body).exec()
    res.json(table)
  } catch (err) {
    next(err)
  }
});

//delete
router.delete('/:id', myauth, async function(req, res, next) {
  try {
    const table = await Table.findByIdAndRemove(req.params.id).exec()
    res.json(table)
  } catch (err) {
    next(err)
  }
});

module.exports = router;
