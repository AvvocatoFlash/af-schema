var adminModel = require('./adminModel');
var userModel = require('./userModel');
var categoryFormModel = require('./category.forumModel');
var subCategoryFormModel = require('./subCategory.forumModel');
var mongoose  = require('mongoose');
mongoose.plugin(schema => { schema.options.usePushEach = true });
const pick = require('lodash.pick');

var msgArticleForumSchema = mongoose.Schema({
    from:    { type: mongoose.Schema.Types.ObjectId, field: "_id", ref: 'user' },
    sent:    { type: Date, default: Date.now },
    message: { type: String }
});

var articleForumSchema = mongoose.Schema({
    admin_id:         { type: mongoose.Schema.Types.ObjectId, field: "_id", ref: 'admin' },
    author_id:        { type: mongoose.Schema.Types.ObjectId, field: "_id", ref: 'user' },
    category:         [{ type: mongoose.Schema.Types.ObjectId, field: "_id", ref: 'categoryForum'}],
    subCategory:      [{ type: mongoose.Schema.Types.ObjectId, field: "_id", ref: 'subCategoryForum' }],
    metaTitle:        { type: String },
    metaDescription:  { type: String },
    content:          { type: String },
    status:           { type: Boolean, default: false },
    publish:          { type: Boolean, default: false },
    msg:              [msgArticleForumSchema],
    updated_at:    { type: Date, default: Date.now },
    created_at:    { type: Date, default: Date.now }
});

articleForumSchema.pre('save', function(next) {
    if (!this.isNew) return next()
    if(!this.created_at) this.created_at = Date.now();
    if(!this.updated_at) this.updated_at = Date.now();
    next();
});

articleForumSchema.pre('update', function(next) {
    if(!this.updated_at) this.updated_at = Date.now();
    next();
});

module.exports = mongoose.model('articleForum', articleForumSchema);
