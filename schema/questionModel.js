var userModel = require('./userModel');
const pick = require('lodash.pick');
var mongoose  = require('mongoose');
mongoose.plugin(schema => { schema.options.usePushEach = true });

var questionSchema = mongoose.Schema({
    user:          { type: mongoose.Schema.Types.ObjectId, field: "_id", ref: 'user' },
    publish:       { type: String, enum: [1, 2] },
    description:   { type: String },
    approved:      { type: Boolean, default: false },
    declined:      { type: Boolean, default: false },
    created_at:    { type: Date, default: Date.now }
});

questionSchema.pre('save', function(next) {
    if (!this.isNew) return next()
    if(!this.created_at) this.created_at = Date.now();
    if(!this.updated_at) this.updated_at = Date.now();
    next();
});

questionSchema.pre('update', function(next) {
    if(!this.updated_at) this.updated_at = Date.now();
    next();
});

module.exports = mongoose.model('question', questionSchema);
