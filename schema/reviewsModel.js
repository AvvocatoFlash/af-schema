require('./userModel');

module.exports = mongoose => {

    mongoose.plugin(schema => { schema.options.usePushEach = true });

    let reviewSchema = mongoose.Schema({
        user:          { type: mongoose.Schema.Types.ObjectId, field: "_id", ref: 'user' },
        avvocato:      { type: mongoose.Schema.Types.ObjectId, field: "_id", ref: 'avvocato' },
        vote:          { type: Number, min:0, max:5, default: 0 },
        note:          { type: String },
        created_at:    { type: Date, default: Date.now }
    });

    reviewSchema.pre('save', function (next) {
        if (!this.isNew) return next();
        if(!this.created_at) this.created_at = Date.now();
        if(!this.updated_at) this.updated_at = Date.now();
        next();
    });

    reviewSchema.pre('update', function (next) {
        if(!this.updated_at) this.updated_at = Date.now();
        next();
    });

    return mongoose.model('richieste', reviewSchema);

};


