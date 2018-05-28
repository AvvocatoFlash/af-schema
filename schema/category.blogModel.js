var mongoose  = require('mongoose');
mongoose.plugin(schema => { schema.options.usePushEach = true });
const pick = require('lodash.pick');

var categoryBlogSchema = mongoose.Schema({
    title:            { type: String },
    permalink:        { type: String, unique: true },
    content:          { type: String },
    position:         { type: Number },
    status:           { type: Boolean, default: false },
    updated_at:    { type: Date, default: Date.now },
    created_at:    { type: Date, default: Date.now }
});

categoryBlogSchema.pre('save', function(next) {
    if (!this.isNew) return next()
    if(!this.created_at) this.created_at = Date.now();
    if(!this.updated_at) this.updated_at = Date.now();
    next();
});

categoryBlogSchema.pre('update', function(next) {
    if(!this.updated_at) this.updated_at = Date.now();
    next();
});

module.exports = mongoose.model('categoryBlog', categoryBlogSchema);