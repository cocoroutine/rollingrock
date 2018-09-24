var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Column = require('../models/column.js');
var Table = require('../models/table.js');
var myauth = require('../middleware/basic.js');

//list all
router.get('/', async function(req, res, next) {
  try {
    const columns = await Column.find().exec()
    res.json(columns);
  } catch (err) {
    next(err)
  }
});

//create
router.post('/', myauth, async function(req, res, next) {
  try {
    const column = await Column.create(req.body)
    let table = await Table.findById(column._tableId).exec()
    table.columns.addToSet(column._id)
    await table.save()
    res.json(column);
  } catch (err) {
    next(err)
  }
});

//read
router.get('/:id', async function(req, res, next) {
  try {
    const column = await Column.findById(req.params.id).exec()
    res.json(column)
  } catch (err) {
    next(err)
  }
});

//update
router.put('/:id', myauth, async function(req, res, next) {
  try {
    const column = await Column.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }).exec()
    res.json(column)
  } catch (err) {
    next(err)
  }
});


//delete
router.delete('/:id', myauth, async function(req, res, next) {
  try {
    const column = await Column.findByIdAndRemove(req.params.id).exec()
    let table = await Table.findById(column._tableId)
    table.columns.remove(column._id)
    await table.save()
    res.json(column)
  } catch (err) {
    next(err)
  }
});

module.exports = router;
