var mongoose = require('mongoose');
mongoose.plugin(schema => { schema.options.usePushEach = true });
require('mongoose-double')(mongoose);
const pick = require('lodash.pick');

var bundleSchema = mongoose.Schema({
    position: {type: Number, default: 0},
    root: { type: Boolean, default: false },
    promotion:  { type: Boolean, default: false },
    status:  { type: Boolean, default: false },
    name: {type: String, require: true},
    description: {type: String, require: true},
    price: { type: String },
    // price: { type: mongoose.Schema.Types.Double },
    // credits: { type: mongoose.Schema.Types.Double },
    credits: { type: String },
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

module.exports = mongoose.model('bundle', bundleSchema);
