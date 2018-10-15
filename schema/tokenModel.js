require('./lawyerModel');

module.exports = (mongoose) => {

    mongoose.plugin(schema => { schema.options.usePushEach = true });

    let tokenSchema = mongoose.Schema({
        token:   { type: Number, default: 0 },
        lawyer:  { type: mongoose.Schema.Types.ObjectId, field: "_id", ref: 'lawyer' },
        type:    { type: String },
        expired_at: { type: Date },
        updated_at: { type: Date, default: Date.now },
        created_at: { type: Date, default: Date.now }
    });

    tokenSchema.pre('save', (next) => {

        if (!this.isNew) return next();

        if (!this.created_at) {
            this.created_at = Date.now();
        }

        next();
    });

    tokenSchema.methods = {

        searchFilterKeys: () => {

            const obj = this.toObject();
            const filtered = pick(obj, '_id', 'declined', 'sold', 'alert', 'posted_at', 'patrocinio', 'urgent', 'title', 'content', 'comune', 'specialisations', 'credit');

            return filtered;
        }
    };

    return mongoose.model('token', tokenSchema);

};

