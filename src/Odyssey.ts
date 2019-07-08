import grammar from './Grammar';
import semantics from './Semantics';

export default class Odyssey {
  constructor() {
  }

  evaluate(str: string) {
    return this.interpret(str)[2];
  }

  interpret(str: string) {
    let m = grammar.match(str);
    let result = null;
    if (m.succeeded()) {
      let s = semantics(m)
      let pretty = s.pretty();
      let tree = s.tree();
      let val = s.eval();
      if (val) {
        result = [ pretty, tree, val.pretty() ];
      }
    } else {
      console.error(m.message);
      throw new Error("Parse failure");
    }
    return result || [,,];
  }
}
