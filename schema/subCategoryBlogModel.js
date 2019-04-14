require('./categoryBlogModel');

module.exports = mongoose => {

  mongoose.plugin(schema => {
    schema.options.usePushEach = true
  });

  let subCategoryBlogSchema = mongoose.Schema({
    category_id: {type: mongoose.Schema.Types.ObjectId, field: "_id", ref: 'categoryBlog'},
    title: {type: String},
    permalink: {type: String, unique: true},
    content: {type: String},
    position: {type: Number},
    status: {type: Boolean, default: false},
    updated_at: {type: Date, default: Date.now},
    created_at: {type: Date, default: Date.now}
  });

  subCategoryBlogSchema.pre('save', (next) => {
    if (!this.isNew) return next();
    if (!this.created_at) this.created_at = Date.now();
    if (!this.updated_at) this.updated_at = Date.now();
    next();
  });

  subCategoryBlogSchema.pre('update', (next) => {
    if (!this.updated_at) this.updated_at = Date.now();
    next();
  });

  return mongoose.model('subCategoryBlog', subCategoryBlogSchema);

};

