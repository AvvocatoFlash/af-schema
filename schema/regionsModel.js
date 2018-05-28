var mongoose  = require('mongoose');
mongoose.plugin(schema => { schema.options.usePushEach = true });
const pick = require('lodash.pick');

var regionSchema = mongoose.Schema({
    name:          { type: String, required:true, unique: true, index: true },
    updated_at:    { type: Date },
    created_at:    { type: Date, default: Date.now }
});

regionSchema.pre('save', function(next) {
    if (!this.isNew) return next();
    if(!this.created_at) this.created_at = Date.now();
    if(!this.updated_at) this.updated_at = Date.now();
    next();
});

regionSchema.pre('update', function(next) {
    if(!this.updated_at) this.updated_at = Date.now();
    next();
});

regionSchema.methods = {

    /**
     * Filter Keys
     * @return {Object} Custom Keys
     */
    filterKeys: function() {

        const obj = this.toObject();
        const filtered = pick(obj, 'name');

        return filtered;
    }
};

module.exports = mongoose.model('region', regionSchema);
