var adminModel = require('./adminModel');
var lawyerModel = require('./lawyerModel');
var categoryBlogModel = require('./category.blogModel');
var subCategoryBlogModel = require('./subCategory.blogModel');
// var specialisationBlogModel = require('./specialisation.BlogModel');
var tagBlogModel = require('./tag.blogModel');
var mongoose  = require('mongoose');
mongoose.plugin(schema => { schema.options.usePushEach = true });
const pick = require('lodash.pick');

var articleSchema = mongoose.Schema({
    image:            { type: Object, default: {} },
    admin_id:         { type: mongoose.Schema.Types.ObjectId, field: "_id", ref: 'admin' },
    author_id:        { type: mongoose.Schema.Types.ObjectId, field: "_id", ref: 'lawyer' },
    category:         [{ type: mongoose.Schema.Types.ObjectId, field: "_id", ref: 'categoryBlog'}],
    subCategory:      [{ type: mongoose.Schema.Types.ObjectId, field: "_id", ref: 'subCategoryBlog' }],
    specialisations:  [{ type: mongoose.Schema.Types.ObjectId, field: "_id", ref: 'spiecializzazioneBlog' }],
    tags:             [{ type: mongoose.Schema.Types.ObjectId, field: "_id", ref: 'tagBlog' }],
    metaTitle:        { type: String },
    isLawyerSignup:   { type: Boolean, default: false },
    metaDescription:  { type: String },
    title:            { type: String, required:true },
    subtitle:         { type: String },
    permalink:        { type: String, required:true },
    avatar:           { type: Object },
    content:          { type: String },
    embed:            { type: String },
    status:           { type: Boolean, default: false },
    updated_at:    { type: Date, default: Date.now },
    created_at:    { type: Date, default: Date.now }
});

articleSchema.pre('save', function(next) {
    if (!this.isNew) return next()
    if(!this.created_at) this.created_at = Date.now();
    if(!this.updated_at) this.updated_at = Date.now();
    next();
});

articleSchema.pre('update', function(next) {
    if(!this.updated_at) this.updated_at = Date.now();
    next();
});

module.exports = mongoose.model('article', articleSchema);
