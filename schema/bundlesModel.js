const pick = require('lodash.pick');

module.exports = (mongoose) => {

    mongoose.plugin(schema => { schema.options.usePushEach = true });

    let bundleSchema = mongoose.Schema({
        position: {type: Number, default: 0},
        root: { type: Boolean, default: false },
        promotion:  { type: Boolean, default: false },
        status:  { type: Boolean, default: false },
        name: {type: String, require: true},
        description: {type: String, require: true},
        price: { type: String },
        credits: { type: Number },
        expired_at: {type: Date},
        updated_at: {type: Date, default: Date.now},
        created_at: {type: Date, default: Date.now}
    });

    bundleSchema.pre('save', function (next) {
        if (!this.isNew) return next()
        if (!this.created_at) {
            this.created_at = Date.now();
        }
        next();
    });

    return mongoose.model('bundle', bundleSchema);

};

