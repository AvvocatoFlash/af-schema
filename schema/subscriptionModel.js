require('./lawyerModel');
require('./comuniModel');

module.exports = (mongoose) => {

    mongoose.plugin(schema => { schema.options.usePushEach = true });

    let subscriptionSchema = mongoose.Schema({
        status: { type: Boolean },
        amount:  { type: String },
        comuni: [{ type: mongoose.Schema.Types.ObjectId, field: "_id", ref: 'comuni' }],
        case_qty:  { type: String },
        type:    { type: String },
        start:   { type: Date },
        expire:  { type: Date },
        stripe:  { type: Object },
        source:  { type: Object },
        updated_at: { type: Date, default: Date.now },
        created_at: { type: Date, default: Date.now }
    });

    subscriptionSchema.pre('save', (next) => {

        if (!this.isNew) return next();

        if (!this.created_at) {
            this.created_at = Date.now();
        }

        next();
    });

    return mongoose.model('subscription', subscriptionSchema);

};

