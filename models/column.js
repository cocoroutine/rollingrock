var mongoose = require('mongoose');

var columnSchema = new mongoose.Schema({
    datatype: { type: String, required: true, default: "string" },
    description: String,
    isFK: { type: Boolean, default: false },
    isMI: { type: Boolean, default: false },
    isPII: { type: Boolean, default: false },
    isPK: { type: Boolean, default: false },
    isSegment: { type: Boolean, default: false },
    name: { type: String, required: true },
    friendly: { type: String, required: true },
    _tableId: { type: mongoose.Schema.Types.ObjectId, required: true },
    updated: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Column', columnSchema);
