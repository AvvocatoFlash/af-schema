const fs = require("fs");

module.exports = function(mongoose) {

    let Schemas = {};

    fs.readdirSync(__dirname + '/schema/').forEach( (filename) => {

        if(~filename.indexOf('.js')) {

            const name = filename.split('.')[0];

            Schemas[name] = require(__dirname + '/schema/' + filename)(mongoose);
        }

    });

    return Schemas;

};
