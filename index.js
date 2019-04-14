const fs = require("fs");

process.env.TZ = 'Europe/Greenwich';

module.exports = (mongoose) => {

    let Schemas = {};

    fs.readdirSync(__dirname + '/schema/').forEach( (filename) => {

        if(filename && ~filename.indexOf('.js')) {

            const name = filename.split('.')[0];
            const model = require(__dirname + '/schema/' + filename)(mongoose);

            Schemas[name] = model;
        }

    });

    return Schemas;

};
