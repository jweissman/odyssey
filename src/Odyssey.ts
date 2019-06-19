import grammar from './Grammar';
import semantics from './Semantics';

export default class Odyssey {
  evaluate(str: string) {
    return this.interpret(str)[2];
  }

  interpret(str: string) {
    let m = grammar.match(str);
    let result = null;
    if (m.succeeded()) {
      let s = semantics(m)
      let derive = s.derive();
      //console.log("DERIVE: ", derive);
      let tree = s.tree();
      //console.log("TREE: ", tree);
      let val = s.eval();
      //console.log("VAL: ", val);
      result = [
        derive,
        tree,
        val.pretty()
      ];
    } else {
      console.error(m.message);
      throw new Error("Parse failure");
    }
    return result;
  }
}
