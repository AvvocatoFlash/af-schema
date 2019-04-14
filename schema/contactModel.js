
module.exports = mongoose => {

  mongoose.plugin(schema => {
    schema.options.usePushEach = true
  });

  let contactSchema = mongoose.Schema({
    name: {type: String},
    phone: {type: String},
    time: {type: String, enum: [1, 2, 3, 4]},
    called: {type: Boolean, default: false},
    note: {type: String},
    updated_at: {type: Date, default: Date.now},
    created_at: {type: Date, default: Date.now}
  });

  contactSchema.pre('save', (next) => {
    if (!this.created_at) this.created_at = Date.now();
    if (!this.updated_at) this.updated_at = Date.now();
    next();
  });

  contactSchema.pre('update', (next) => {
    if (!this.updated_at) this.updated_at = Date.now();
    next();
  });

  return mongoose.model('contact', contactSchema);

};
