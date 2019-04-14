
module.exports = mongoose => {

  mongoose.plugin(schema => {
    schema.options.usePushEach = true
  });

  let spiecializzazioneBlogSchema = mongoose.Schema({
    name: {type: String},
    position: {type: Number},
    isActive: {type: Boolean, default: true},
    updated_at: {type: Date, default: Date.now},
    created_at: {type: Date, default: Date.now}
  });

  spiecializzazioneBlogSchema.pre('save', function (next) {
    if (!this.isNew) return next();
    if (!this.created_at) this.created_at = Date.now();
    if (!this.updated_at) this.updated_at = Date.now();
    next();
  });
  spiecializzazioneBlogSchema.pre('update', function (next) {
    if (!this.updated_at) this.updated_at = Date.now();
    next();
  });

  return mongoose.model('spiecializzazioneBlog', spiecializzazioneBlogSchema);

};


