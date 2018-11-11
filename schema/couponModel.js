require('./lawyerModel');

const pick = require('lodash.pick');

module.exports = (mongoose) => {

    mongoose.plugin(schema => { schema.options.usePushEach = true });

    let couponSchema = mongoose.Schema({
        status:        { type: Boolean, default: false },
        title:         { type: String, require: true },
        description:   { type: String },
        code:          { type: String, require: true, unique: true, trim: true },
        always:        { type: Boolean, default: false },
        sessions:      { type: Number, default: 0 },
        count:         { type: Number, default: 0 },
        lawyers:       [{ type: mongoose.Schema.Types.ObjectId, field: "_id", ref: 'lawyer' }],
        only:          [{ type: mongoose.Schema.Types.ObjectId, field: "_id", ref: 'lawyer' }],
        type:          { type: String, enum: ['percentage', 'sum', 'credits'], default: 'sum'},
        amount:        { type: String },
        updated_at:    { type: Date, default: Date.now },
        created_at:    { type: Date, default: Date.now }
    });

    couponSchema.pre('save', function (next) {
        if (!this.isNew) return next()
        if (!this.created_at) {
            this.created_at = Date.now();
        }
        next();
    });

    couponSchema.methods = {

        /**
         * Filter Keys
         * @return {Object} Custom Keys
         */
        minFilterKeys: function() {

            const obj = this.toObject();
            const filtered = pick(obj, '_id', 'title', 'description', 'code', 'amount', 'type');

            return filtered;
        },
    };

    return mongoose.model('coupon', couponSchema);

};


