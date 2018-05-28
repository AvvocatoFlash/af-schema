require('./caseModel');
require('./lawyerModel');
require('./adminModel');

const pick = require('lodash.pick');

module.exports = (mongoose) => {

    mongoose.plugin(schema => { schema.options.usePushEach = true });

    const msgSchema = mongoose.Schema({
        ref_lawyer:    { type: mongoose.Schema.Types.ObjectId, field: "_id", ref: 'lawyer' },
        ref_admin:     { type: mongoose.Schema.Types.ObjectId, field: "_id", ref: 'admin' },
        messages:      { type: String },
        created_at:    { type: Date, default: Date.now }
    });

    let refundSchema = mongoose.Schema({
        ref_case:      { type: mongoose.Schema.Types.ObjectId, field: "_id", ref: 'case' },
        ref_lawyer:    { type: mongoose.Schema.Types.ObjectId, field: "_id", ref: 'lawyer' },
        open:          { type: Boolean, default: false },
        messages:      [msgSchema],
        created_at:    { type: Date, default: Date.now }
    });

    refundSchema.pre('save', function(next) {
        if (!this.isNew) return next();
        if(!this.created_at) this.created_at = Date.now();
        next();
    });

    return mongoose.model('refund', refundSchema);

};
