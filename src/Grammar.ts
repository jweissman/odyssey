var fs = require('fs');
var ohm = require('ohm-js');
var contents = fs.readFileSync('./src/Odyssey.ohm');
var grammar = ohm.grammar(contents);

export default grammar;
