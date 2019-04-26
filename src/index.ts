console.log("loading grammar!!")
// @ts-ignore
// import grammar from './Odyssey.ohm'
//
var fs = require('fs');
var ohm = require('ohm-js');
var contents = fs.readFileSync('./src/Odyssey.ohm');
var grammar = ohm.grammar(contents);

class ASTNode {
}

export class Identifier extends ASTNode {
  constructor(public value: string) {
    super()
  }
}

export class IntegerLiteral extends ASTNode {
  constructor(public value: number) {
    super()
  }
}

type Op = '+' | '-' | '*' | '/'
class BinaryExpression extends ASTNode {
  constructor(
    public op: Op,
    public left: ASTNode,
    public right: ASTNode
  ) {
    super()
  }
}

export class AssignmentExpression extends ASTNode {
  constructor(
    public id: Identifier,
    public e: ASTNode,
  ) {
    super()
  }
}

type Node = {
  sourceString: string
  derive: () => string
  tree: () => any 
  // (Identifier | IntegerLiteral | BinaryExpression | AssignmentExpression)
  eval: () => any
  children: Node[]
}

const semantics = grammar.createSemantics()

semantics.addOperation('tree', {
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

  MulExp_div: (left: Node, _tm: any, right: Node): BinaryExpression =>
    new BinaryExpression('/', left.tree(), right.tree()),

  Assignment: (id: Node, _eq: any, e: Node): AssignmentExpression =>
    new AssignmentExpression(id.tree(), e.tree()),
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
  MulExp_div: (left: Node, _mul: any, right: Node) =>
    [ left.derive(), '/', right.derive() ].join(''),

  Assignment: (id: Node, _eq: any, e: Node) =>
    [ id.derive(), '=', e.derive() ].join(''),
});

const db: { [key: string]: any } = {
};

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

  MulExp_div: (left: Node, _div: any, right: Node) =>
    left.eval() / right.eval(),

  ident: (first: Node, rest: Node) => {
    let key = [first.sourceString, rest.sourceString].join('')
    // console.log("LOOKUP", { key });
    return db[key] || 'undefined'
  },

  Assignment: (id: Node, _eq: any, e: Node) =>
    db[id.sourceString] = e.eval(),
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
