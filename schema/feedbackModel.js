var userModel = require('./userModel');
var lawyerModel = require('./lawyerModel');
var caseModel = require('./caseModel');
const pick = require('lodash.pick');

var mongoose  = require('mongoose');
mongoose.plugin(schema => { schema.options.usePushEach = true });

var feedbackSchema = mongoose.Schema({
    lawyer:        { type: mongoose.Schema.Types.ObjectId, field: "_id", ref: 'lawyer' },
    comment:       { type: String },
    vote:          { type: String },
    extra:         { type: Object },
    user:          { type: mongoose.Schema.Types.ObjectId, field: "_id", ref: 'user' },
    case:          { type: mongoose.Schema.Types.ObjectId, field: "_id", ref: 'case' },
    approved:      { type: Boolean, default: false },
    created_at:    { type: Date, default: Date.now }
});

feedbackSchema.pre('save', function(next) {
    if (!this.isNew) return next()
    if(!this.created_at) this.created_at = Date.now();
    next();
});

module.exports = mongoose.model('feedback', feedbackSchema);
