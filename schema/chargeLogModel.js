var lawyerModel = require('./lawyerModel');
var mongoose  = require('mongoose');
mongoose.plugin(schema => { schema.options.usePushEach = true });
require('mongoose-double')(mongoose);
const pick = require('lodash.pick');

var chargeLogSchema = mongoose.Schema({
    lawyer:        { type: mongoose.Schema.Types.ObjectId, field: "_id", ref: 'lawyer' },
    amount:        { type: String },
    stripe:        { type: Object },
    log:           { type: Object },
    credit:        { type: Number, default: 0 },
    updated_at:    { type: Date, default: Date.now },
    created_at:    { type: Date, default: Date.now }
});

chargeLogSchema.pre('save', function(next) {
    if (!this.isNew) return next()
    if(!this.created_at) this.created_at = Date.now();
    if(!this.updated_at) this.updated_at = Date.now();
    next();
});

chargeLogSchema.pre('update', function(next) {
    if(!this.updated_at) this.updated_at = Date.now();
    next();
});

module.exports = mongoose.model('chargeLog', chargeLogSchema);