var lawyerModel = require('./lawyerModel');
var caseModel = require('./caseModel');
var adminModel = require('./adminModel');
var mongoose  = require('mongoose');
mongoose.plugin(schema => { schema.options.usePushEach = true });
const pick = require('lodash.pick');

var creditSchema = mongoose.Schema({
    lawyer:        { type: mongoose.Schema.Types.ObjectId, field: "_id", ref: 'lawyer' },
    case:          { type: mongoose.Schema.Types.ObjectId, field: "_id", ref: 'case' },
    credit:        { type: String, default: 0 },
    type:          { type: String },
    admin_id:      { type: mongoose.Schema.Types.ObjectId, field: "_id", ref: 'admin' },
    refund:        {
        status:    { type: Boolean },
        admin_id:  { type: mongoose.Schema.Types.ObjectId, field: "_id", ref: 'admin' },
        date:      { type: Date }
    },
    updated_at:    { type: Date, default: Date.now },
    created_at:    { type: Date, default: Date.now }
});

creditSchema.pre('save', function(next) {
    if (!this.isNew) return next()
    if(!this.created_at) this.created_at = Date.now();
    if(!this.updated_at) this.updated_at = Date.now();
    next();
});

creditSchema.pre('update', function(next) {
    if(!this.updated_at) this.updated_at = Date.now();
    next();
});

module.exports = mongoose.model('credit', creditSchema);