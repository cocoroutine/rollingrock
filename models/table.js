var mongoose = require('mongoose');

var tableSchema = new mongoose.Schema({
    columns: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Column' }],
    description: String,
    friendly: { type: String, required: true },
    isPrune: { type: Boolean, default: false},
    isSending: { type: Boolean, default: false},
    joins: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Table' }],
    name: { type: String, required: true },
    _slabId: { type: mongoose.Schema.Types.ObjectId, required: true },
    updated: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Table', tableSchema);
