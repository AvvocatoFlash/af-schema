require('bcrypt-nodejs');
require('./lawyerModel');
require('./caseModel');

const shortid = require('shortid');
const pick = require('lodash.pick');

module.exports = (mongoose) => {

    mongoose.plugin(schema => { schema.options.usePushEach = true });

    let invoiceSchema = mongoose.Schema({
        subscription: {type: Boolean},
        subscriptionFrom: { type: Date },
        subscriptionTo: { type: Date },
        paid: {type: Boolean},
        chargeAttempt: {type: Number, default: 0},
        shortId:     {type: String, unique: true, require: true},
        ref_lawyer:  { type: mongoose.Schema.Types.ObjectId, field: "_id", ref: 'lawyer' },
        ref_case:    [{ type: mongoose.Schema.Types.ObjectId, field: "_id", ref: 'case' }],
        billing:     { type: Object },
        credits:     { type: Number, default: 0 },
        cancel:      { type: Boolean },
        total:       { type: String },
        stripe:      { type: Object },
        log:         { type: Object },
        az_old:      { type: Boolean, default: false },
        lastCharge:  { type: Date },
        updated_at:  { type: Date, default: Date.now },
        created_at:  { type: Date, default: Date.now }
    });

    invoiceSchema.pre('save', function(next) {
        if (!this.isNew) return next();
        this.created_at = Date.now();
        this.updated_at = Date.now();
        next();
    });

    invoiceSchema.pre('update', function(next) {
        this.updated_at = Date.now();
        next();
    });

    invoiceSchema.statics = {

        subscriptionHistory: async function(lawyerId) {

            if(!lawyerId) {
                return;
            }

            return await this.model('invoice').find({
                    subscription: true,
                    ref_lawyer: lawyerId,
                }).sort('-subscriptionFrom').exec();
        }

    };

    invoiceSchema.methods = {

        /**
         * Filter Keys
         * @return {Object} Custom Keys
         */
        filterKeys: function() {

            const obj = this.toObject();
            let filtered = pick(obj, '_id', 'shortId', 'ref_lawyer', 'billing', 'cancel', 'credits', 'total', 'stripe', 'log', 'az_old', 'lastCharge', 'created_at');

            if(filtered && filtered.stripe){
                delete filtered.stripe.paymentObj;
                delete filtered.stripe.card;
                delete filtered.stripe.object;
                delete filtered.stripe.id;
                delete filtered.stripe.client_ip;
                delete filtered.log;
            }

            return filtered;
        },

        filterSubscriptionKeys: function() {

            const obj = this.toObject();
            let filtered = pick(obj, '_id', 'shortId', 'subscriptionFrom', 'subscriptionTo', 'paid', 'chargeAttempt', 'ref_case', 'total', 'lastCharge');

            return filtered;
        }
    };

    return mongoose.model('invoice', invoiceSchema);

};


