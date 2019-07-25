import grammar from './Grammar';

import tree from './Tree';
import pretty from './Pretty';
import interpret from './Interpret';

const semantics = grammar.createSemantics()
semantics.addOperation('pretty', pretty);
semantics.addOperation('tree', tree);
semantics.addOperation('eval', interpret);
//semantics.addValue('freeVariables', interpret);

export default semantics;
