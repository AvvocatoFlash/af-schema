var mongoose  = require('mongoose');
mongoose.plugin(schema => { schema.options.usePushEach = true });
const pick = require('lodash.pick');

var faqSchema = mongoose.Schema({
    question:          { type: String },
    answer:          { type: String },
    position:      { type: Number },
    updated_at:    { type: Date, default: Date.now },
    created_at:    { type: Date, default: Date.now }
});

faqSchema.pre('save', function(next) {
    if (!this.isNew) return next()
    if(!this.created_at) this.created_at = Date.now();
    if(!this.updated_at) this.updated_at = Date.now();
    next();
});

faqSchema.pre('update', function(next) {
    if(!this.updated_at) this.updated_at = Date.now();
    next();
});

faqSchema.methods = {

    /**
     * Filter Keys
     * @return {Object} Custom Keys
     */
    filterKeys: function() {

        const obj = this.toObject();
        const filtered = pick(obj, 'question', 'answer', 'position');

        return filtered;
    }
};

module.exports = mongoose.model('faq', faqSchema);
