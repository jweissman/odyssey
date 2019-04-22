console.log("loading grammar!!")
// @ts-ignore
// import grammar from './Odyssey.ohm'
//
var fs = require('fs');
var ohm = require('ohm-js');
var contents = fs.readFileSync('./src/Odyssey.ohm');
var grammar = ohm.grammar(contents);

class ASTNode {}
class Identifier extends ASTNode {
  constructor(public value: string) {
    super()
  }
}
class IntegerLiteral extends ASTNode {
  constructor(public value: number) {
    super()
  }
}

type Op = '+' | '-' | '*'
class BinaryExpression extends ASTNode {
  constructor(
    public op: Op,
    public left: ASTNode,
    public right: ASTNode
  ) {
    super()
  }
}

type Node = {
  sourceString: string
  derive: () => string
  tree: () => ASTNode
  eval: () => any
  children: Node[]
}

const semantics = grammar.createSemantics()

semantics.addOperation('tree', {
  // Program: (stmts: Node) => n
  ident: (head: Node, rest: Node) => new Identifier(
    [head.sourceString, rest.sourceString].join('')
  ),
  num: (digits: Node) => new IntegerLiteral(
    Number(digits.sourceString)
  ),
  AddExp_plus: (left: Node, _pl: any, right: Node): BinaryExpression =>
    new BinaryExpression('+', left.tree(), right.tree()),

  AddExp_minus: (left: Node, _sub: any, right: Node): BinaryExpression =>
    new BinaryExpression('-', left.tree(), right.tree()),

  MulExp_times: (left: Node, _tm: any, right: Node): BinaryExpression =>
    new BinaryExpression('*', left.tree(), right.tree()),
});

semantics.addOperation('derive', {
  Program: (stmts: Node) =>
    stmts.children.map((stmt: Node) => stmt.derive()).join(';'),
  ident: (leadingChar: Node, rest: Node) =>
    [leadingChar.sourceString, rest.sourceString].join(''),
  num: (val: Node) => val.sourceString,
  AddExp_plus: (left: Node, _pl: any, right: Node) =>
    [ left.derive(), '+', right.derive() ].join(''),
  AddExp_minus: (left: Node, _sub: any, right: Node) =>
    [ left.derive(), '-', right.derive() ].join(''),
  MulExp_times: (left: Node, _mul: any, right: Node) =>
    [ left.derive(), '*', right.derive() ].join(''),
});

semantics.addOperation('eval', {
  Program: (stmts: Node) => {
    return stmts.children.map((stmt: Node) => stmt.eval()).join(";")
  },
  num: (val: Node) => Number(val.sourceString),
  AddExp_plus: (left: Node, _plus: any, right: Node) =>
    left.eval() + right.eval(),

  AddExp_minus: (left: Node, _sub: any, right: Node) =>
    left.eval() - right.eval(),

  MulExp_times: (left: Node, _mul: any, right: Node) =>
    left.eval() * right.eval(),
});

export default class Odyssey {
  interpret(str: string) {
    let m = grammar.match(str);
    let result = null;
    if (m.succeeded()) {
      let s = semantics(m)
      result = [ s.derive(), s.tree(), s.eval() ];
    } else {
      result = 'parse failure';
    }
    console.log("Odyssey#interpret", { str, result })
    return result;
  }
}
