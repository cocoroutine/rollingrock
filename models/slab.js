var mongoose = require('mongoose');

var slabSchema = new mongoose.Schema({
    description: { type: String, default: "add a description", required: false },
    hidden: { type: Boolean, default: false },
    name: { type: String, required: true },
    master: { type: Boolean, default: false },
    tables: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Table' }],
    updated: { type: Date, default: Date.now }
});


module.exports = mongoose.model('Slab', slabSchema);
