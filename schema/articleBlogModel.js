require('./adminModel');
require('./lawyerModel');
require('./categoryBlogModel');
require('./subCategoryBlogModel');
require('./specialisationBlogModel');
require('./tagBlogModel');

const pick = require('lodash.pick');

module.exports = (mongoose) => {

    mongoose.plugin(schema => { schema.options.usePushEach = true });

    let articleSchema = mongoose.Schema({
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
        permalink:        { type: String, require: true, unique: true },
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


    articleSchema.statics = {

        findWithPagination: async function(currentPage, limit = 30, opts = {}, select = '', selectTags = '', selectSpecialisations = '', selectCategory = '', selectSubCategory = '', selectAuthor = '') {

            currentPage = (currentPage && !isNaN(currentPage)) ? parseInt(currentPage) : 1;

            const optsParams = Object.assign({}, opts);

            let Articles = this.model('article')
              .find(optsParams)
              .select(select)
              .populate('tags', selectTags)
              .populate('specialisations', selectSpecialisations)
              .populate('category', selectCategory)
              .populate('subCategory', selectSubCategory)
              .populate('author_id', selectAuthor)
              .sort({'created_at':-1});

            let Count = this.model('article').countDocuments(optsParams);

            Articles.limit(limit);
            Articles.skip(limit * (currentPage - 1));
            Articles.sort({'created_at':-1});

            Articles = await Articles.lean().exec();
            Count = await Count.exec();

            return {
                Articles,
                currentPage,
                totRecords: Count,
                totPages: Math.ceil(Count / limit)
            };

        }

    };

    return mongoose.model('article', articleSchema);

};

