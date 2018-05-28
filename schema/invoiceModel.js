var mongoose  = require('mongoose');
var bcrypt    = require('bcrypt-nodejs');
var lawyerModel = require('./lawyerModel');
var shortid = require('shortid');
const pick = require('lodash.pick');

require('mongoose-double')(mongoose);

var invoiceSchema = mongoose.Schema({
    shortId:     {type: String, unique: true},
    ref_lawyer:  { type: mongoose.Schema.Types.ObjectId, field: "_id", ref: 'lawyer' },
    billing:     { type: Object },
    credits:     { type: String, default: 0 },
    total:       { type: String },
    stripe:      { type: Object },
    log:         { type: Object },
    az_old:      { type: Boolean, default: false },
    updated_at:  { type: Date, default: Date.now },
    created_at:  { type: Date, default: Date.now }
});

invoiceSchema.pre('save', function(next) {
    if (!this.isNew) return next();
    if(!this.created_at) this.created_at = Date.now();
    if(!this.updated_at) this.updated_at = Date.now();
    next();
});

invoiceSchema.pre('update', function(next) {
    if(!this.updated_at) this.updated_at = Date.now();
    next();
});

invoiceSchema.methods = {

    /**
     * Filter Keys
     * @return {Object} Custom Keys
     */
    filterKeys: function() {

        const obj = this.toObject();
        let filtered = pick(obj, '_id', 'shortId', 'ref_lawyer', 'billing', 'credits', 'total', 'stripe', 'log', 'az_old', 'created_at');

        if(filtered && filtered.stripe){
            delete filtered.stripe.paymentObj;
            delete filtered.stripe.card;
            delete filtered.stripe.object;
            delete filtered.stripe.id;
            delete filtered.stripe.client_ip;
            delete filtered.log;
        }

        return filtered;
    }
};

module.exports = mongoose.model('invoice', invoiceSchema);
