require('./caseModel');
require('./lawyerModel');
require('./comuniModel');

module.exports = (mongoose) => {

    mongoose.plugin(schema => {
        schema.options.usePushEach = true
    });

    let subscriptionSchema = mongoose.Schema({
        lawyer: {type: mongoose.Schema.Types.ObjectId, field: "_id", ref: 'lawyer', require: true, unique: true},
        customer: {type: Object},
        source: {type: Object},
        amount: {type: String},
        begin_at: {type: Date},
        end_at: {type: Date},
        unsubscribe_at: {type: Date},
        decline_reason: {type: String},
        updated_at: {type: Date, default: Date.now},
        created_at: {type: Date, default: Date.now}
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

