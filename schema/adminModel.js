const bcrypt = require('bcrypt-nodejs');

module.exports = mongoose => {

  mongoose.plugin(schema => {
    schema.options.usePushEach = true
  });

  let adminSchema = mongoose.Schema({
    avatar: {type: String},
    image: {type: Object, default: {}},
    name: {type: String},
    surname: {type: String},
    email: {type: String, require: true, unique: true},
    password: {type: String, require: true},
    token: {type: String, require: true, unique: true},
    isActive: {type: Boolean, default: false},
    type: {type: String, enum: ['super_root', 'root', 'admin', 'moderator']},
    latest_login: {type: Date, default: Date.now},
    session_at: {type: Date, default: Date.now},
    updated_at: {type: Date, default: Date.now},
    created_at: {type: Date, default: Date.now}
  });

  adminSchema.pre('save', (next) => {

    if (!this.isNew) return next();

    const generateUUID = () => {
      let d = new Date().getTime();
      const uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
        const r = (d + Math.random() * 16) % 16 | 0;
        d = Math.floor(d / 16);
        return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
      });
      return uuid;
    };

    if (!this.token) this.token = generateUUID() + '-&&-' + this._id;
    if (!this.created_at) this.created_at = Date.now();
    if (!this.updated_at) this.updated_at = Date.now();

    next();
  });

  adminSchema.pre('update', (next) => {
    if (!this.updated_at) this.updated_at = Date.now();
    next();
  });

  adminSchema.methods.generateHash = (password) => {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8));
  };

  adminSchema.methods.validPassword = (password) => {
    return bcrypt.compareSync(password, this.password);
  };

  return mongoose.model('admin', adminSchema);
};
