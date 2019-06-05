import grammar from './Grammar';
import tree from './Tree';
import derive from './Derive';
import interpret from './Interpret';

const semantics = grammar.createSemantics()
semantics.addOperation('tree', tree);
semantics.addOperation('derive', derive);
semantics.addOperation('eval', interpret);

export default semantics;
