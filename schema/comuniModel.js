const mongoose  = require('mongoose');
const bcrypt    = require('bcrypt-nodejs');
const pick = require('lodash.pick');

const zonaSchema = mongoose.Schema({
    nome:    { type: String, enum: ["Nord-est", "Nord-ovest", "Centro", "Sud", "Isole"] },
    codice:  { type: String }
});

const regioneSchema = mongoose.Schema({
    nome:    { type: String },
    codice:  { type: String }
});

const provinciaSchema = mongoose.Schema({
    nome:    { type: String },
    codice:  { type: String }
});

let comuniSchema = mongoose.Schema({
    nome:            { type: String },
    codice:          { type: String },
    zona:            zonaSchema,
    regione:         regioneSchema,
    provincia:       provinciaSchema,
    sigla:           { type: String },
    codiceCatastale: { type: String },
    cap:             { type: String },
    created_at:      { type: Date, default: Date.now }
});

comuniSchema.methods = {

    /**
     * Filter Keys
     * @return {Object} Custom Keys
     */
    filterKeys: function() {

        const obj = this.toObject();
        const filtered = pick(obj, 'nome', 'codice', 'regione', 'provincia', 'sigla', 'cap');

        return filtered;
    }
};

module.exports = mongoose.model('comuni', comuniSchema);

// https://github.com/matteocontrini/comuni-json