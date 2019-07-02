import grammar from './Grammar';

import tree from './Tree';
import pretty from './Pretty';
import interpret from './Interpret';

const semantics = grammar.createSemantics()
semantics.addOperation('tree', tree);
semantics.addOperation('pretty', pretty);
semantics.addOperation('eval', interpret);

export default semantics;
