// https://github.com/matteocontrini/comuni-json

const pick = require('lodash.pick');

module.exports = mongoose => {

  mongoose.plugin(schema => {
    schema.options.usePushEach = true
  });

  const zonaSchema = mongoose.Schema({
    nome: {type: String, enum: ["Nord-est", "Nord-ovest", "Centro", "Sud", "Isole"]},
    codice: {type: String}
  });

  const regioneSchema = mongoose.Schema({
    nome: {type: String},
    codice: {type: String}
  });

  const provinciaSchema = mongoose.Schema({
    nome: {type: String},
    codice: {type: String},
  });

  let comuniSchema = mongoose.Schema({
    nome: {type: String},
    codice: {type: String},
    zona: zonaSchema,
    regione: regioneSchema,
    provincia: provinciaSchema,
    sigla: {type: String},
    codiceCatastale: {type: String},
    cap: {type: String},
    created_at: {type: Date, default: Date.now}
  });

  comuniSchema.methods = {

    /**
     * Filter Keys
     * @return {Object} Custom Keys
     */
    filterKeys: () => {

      const obj = this.toObject();
      const filtered = pick(obj, 'nome', 'codice', 'regione', 'provincia', 'sigla', 'cap');

      return filtered;
    }
  };

  return mongoose.model('comuni', comuniSchema);
};
