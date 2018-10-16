require('./lawyerModel');

module.exports = (mongoose) => {

    mongoose.plugin(schema => { schema.options.usePushEach = true });

    let tokenSchema = mongoose.Schema({
        value:   { type: String, require: true },
        lawyer:  { type: mongoose.Schema.Types.ObjectId, field: "_id", ref: 'lawyer' },
        type:    { type: String },
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

    return mongoose.model('token', tokenSchema);

};

