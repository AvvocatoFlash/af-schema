var mongoose  = require('mongoose');
mongoose.plugin(schema => { schema.options.usePushEach = true });
var bcrypt    = require('bcrypt-nodejs');
var lawyerModel = require('./lawyerModel');
const pick = require('lodash.pick');

var billingSchema = mongoose.Schema({
    ref_lawyer:  { type: mongoose.Schema.Types.ObjectId, field: "_id", ref: 'lawyer' },
    name:        { type: String },
    surname:     { type: String },
    company:     { type: String },
    pi:          { type: String },
    cf:          { type: String },
    address:     { type: String },
    postcode:    { type: String },
    city:        { type: String },
    country:     { type: String },
    type:        { type: String, enum: ['company', 'private'] },
    updated_at:  { type: Date, default: Date.now },
    created_at:  { type: Date, default: Date.now }
});

billingSchema.pre('save', function(next) {
    if (!this.isNew) return next();
    if(!this.created_at) this.created_at = Date.now();
    if(!this.updated_at) this.updated_at = Date.now();
    next();
});

billingSchema.pre('update', function(next) {
    if(this.updated_at) this.updated_at = Date.now();
    next();
});

module.exports = mongoose.model('billing', billingSchema);
