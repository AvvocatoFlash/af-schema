require('./faqLawyerCategoriesModel');

module.exports = mongoose => {

  mongoose.plugin(schema => {
    schema.options.usePushEach = true
  });

  let faqLawyerSchema = mongoose.Schema({
    question: {type: String},
    answer: {type: String},
    position: {type: Number},
    category: {type: mongoose.Schema.Types.ObjectId, field: "_id", ref: 'faqLawyerCategories'},
    updated_at: {type: Date, default: Date.now},
    created_at: {type: Date, default: Date.now}
  });

  faqLawyerSchema.pre('save', function (next) {
    if (!this.isNew) return next();
    if (!this.created_at) this.created_at = Date.now();
    next();
  });

  return mongoose.model('faqLawyer', faqLawyerSchema);

};
