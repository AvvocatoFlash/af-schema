
module.exports = mongoose => {

  mongoose.plugin(schema => {
    schema.options.usePushEach = true
  });

  let faqLawyerCategoriesSchema = mongoose.Schema({
    name: {type: String},
    position: {type: Number, default: 0},
    created_at: {type: Date, default: Date.now}
  });

  faqLawyerCategoriesSchema.pre('save', function (next) {
    if (!this.isNew) return next();
    if (!this.created_at) this.created_at = Date.now();
    next();
  });

  return mongoose.model('faqLawyerCategories', faqLawyerCategoriesSchema);
};


