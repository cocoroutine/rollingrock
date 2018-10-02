var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Column = require('../models/column.js');
var Table = require('../models/table.js');
var Slab = require('../models/slab.js');

router.get('/:tblname/:slab', async function (req, res, next) {
  try {
    const masterSlab = await Slab.findOne({ master: true }).exec()

    //find master table and populat cols
    let search = {
      name: req.params.tblname,
      _slabId: masterSlab._id
    }
    let select ='-_id name friendly description columns isPrune isSending'
    const columnArgs =  {
      path: 'columns',
      select: '-_id -aka -_tableId -updated -__v'
    }
    let masterTable = await Table.findOne(search, select)
      .populate(columnArgs)
      .exec()

    //deep copy master table
    let copyTable = JSON.parse(JSON.stringify(masterTable))
    copyTable._slabId = req.params.slab
    copyTable.columns = []

    //generate col id and update copy
    masterTable.columns.map( function (col) {
     col._id = mongoose.Types.ObjectId()
     copyTable.columns.push(col._id)
    })

    //upsert copied table
    search = { name: req.params.tblname, _slabId: req.params.slab }
    let clonedTable = await Table.findOneAndUpdate(
      search,
      copyTable,
      { upsert: true, new: true }
    ).exec()

    //add table id to slab
    const parentSlab = await Slab.findById(clonedTable._slabId).exec()
    parentSlab.tables.addToSet(clonedTable._id);
    await parentSlab.save()

    //add table id to columns
    masterTable.columns.map( function (col) {
     col._tableId = clonedTable._id
    })

    //remove existing columns
    await Column.deleteMany({ _tableId: clonedTable._id })

    //insert columns
    await Column.insertMany(masterTable.columns)

    return res.json(clonedTable)
  } catch (err) {
    next(err)
  }

});

module.exports = router;
