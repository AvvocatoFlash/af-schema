require('./adminModel');
require('./lawyerModel');
require('./categoryBlogModel');
require('./subCategoryBlogModel');
require('./specialisationBlogModel');
require('./tagBlogModel');

const pick = require('lodash.pick');

module.exports = (mongoose) => {

    mongoose.plugin(schema => { schema.options.usePushEach = true });

    let article2Schema = mongoose.Schema({
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

    article2Schema.pre('save', function(next) {
        if (!this.isNew) return next()
        if(!this.created_at) this.created_at = Date.now();
        if(!this.updated_at) this.updated_at = Date.now();
        next();
    });

    article2Schema.pre('update', function(next) {
        if(!this.updated_at) this.updated_at = Date.now();
        next();
    });

    return mongoose.model('article2', article2Schema);

};

