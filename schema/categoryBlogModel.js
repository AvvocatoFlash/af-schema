module.exports = mongoose => {

  mongoose.plugin(schema => {
    schema.options.usePushEach = true
  });

  let categoryBlogSchema = mongoose.Schema({
    title: {type: String},
    permalink: {type: String, unique: true},
    content: {type: String},
    position: {type: Number},
    status: {type: Boolean, default: false},
    updated_at: {type: Date, default: Date.now},
    created_at: {type: Date, default: Date.now}
  });

  categoryBlogSchema.pre('save', (next) => {
    if (!this.isNew) return next();
    if (!this.created_at) this.created_at = Date.now();
    if (!this.updated_at) this.updated_at = Date.now();
    next();
  });

  categoryBlogSchema.pre('update', (next) => {
    if (!this.updated_at) this.updated_at = Date.now();
    next();
  });

  return mongoose.model('categoryBlog', categoryBlogSchema);

};
