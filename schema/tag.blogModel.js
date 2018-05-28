var mongoose  = require('mongoose');
mongoose.plugin(schema => { schema.options.usePushEach = true });
const pick = require('lodash.pick');

var tagBlogSchema = mongoose.Schema({
    name:          { type: String },
    isActive:      { type: Boolean, default: true },
    updated_at:    { type: Date, default: Date.now },
    created_at:    { type: Date, default: Date.now }
});

tagBlogSchema.pre('save', function(next) {
    if (!this.isNew) return next()
    if(!this.created_at) this.created_at = Date.now();
    if(!this.updated_at) this.updated_at = Date.now();
    next();
});

tagBlogSchema.pre('update', function(next) {
    if(!this.updated_at) this.updated_at = Date.now();
    next();
});

module.exports = mongoose.model('tagBlog', tagBlogSchema);
