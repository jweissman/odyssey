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

export class DefunExpression extends ASTNode {
  constructor(
    public args: Array<String>,
    public e: ASTNode,
  ) {
    super()
  }
}

type Node = {
  sourceString: string
  derive: () => string
  tree: () => any
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

  Defun: (params: Node, _fa: any, e: Node) =>
    new DefunExpression(params.tree(), e.tree()),

  FormalParameterList: (_lp: any, params: Node, _rp: any) => {
    return params.tree();
    //debugger;
    //return params.children.map((param: Node) => param.tree());
  },

  EmptyListOf: (): Node[] => [],
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

  Defun: (params: Node, _fa: any, e: Node) =>
    [
      params.derive(), "=>", "{", e.derive(), "}"
    ].join(''),

  // todo...
  FormalParameterList: (_lp: any, params: Node, _rp: any) =>
    [
      "(",
      params.children.length &&
        params.children.map((param: Node) => param.derive()),
      ")",
    ].join(''),

  EmptyListOf: () => '',

});

const db: { [key: string]: any } = {};

class OdysseyInteger {
  constructor(public value: number) {}
  pretty = () => this.value.toString();
  plus(other: OdysseyInteger)  { return new OdysseyInteger(this.value + other.value); }
  minus(other: OdysseyInteger) { return new OdysseyInteger(this.value - other.value); }
  times(other: OdysseyInteger) { return new OdysseyInteger(this.value * other.value); }
  div(other: OdysseyInteger)   { return new OdysseyInteger(this.value / other.value); }
}

class OdysseyFunction {
  constructor(public argList: Array<Node>, public methodBody: Node) {}
  pretty = () => {
    console.log({ fn: this });
    return [ 
      "(",
      this.argList.length > 0 ? this.argList.map(arg => arg.derive()).join(',') : '',
      ")",
      "=>",
      // "{",
      this.methodBody.derive()
      // "}",
    ].join('')

  }
}

semantics.addOperation('eval', {
  Program: (stmts: Node) => {
    let res;
    stmts.children.forEach((stmt: Node) => res = stmt.eval());
    return res;
  },

  num: (val: Node) =>
    new OdysseyInteger(Number(val.sourceString)),

  AddExp_plus: (left: Node, _plus: any, right: Node) =>
    left.eval().plus(right.eval()),

  AddExp_minus: (left: Node, _sub: any, right: Node) =>
    left.eval().minus(right.eval()),

  MulExp_times: (left: Node, _mul: any, right: Node) =>
    left.eval().times(right.eval()),

  MulExp_div: (left: Node, _div: any, right: Node) =>
    left.eval().div(right.eval()),

  ident: (first: Node, rest: Node) => {
    let key = [first.sourceString, rest.sourceString].join('')
    if (!db[key]) {
      throw new Error(`No such variable ${key}`);
    }
    return db[key]
  },

  Assignment: (id: Node, _eq: any, e: Node) =>
    db[id.sourceString] = e.eval(),

  Defun: (params: Node, _fa: any, e: Node) => {
    // console.log("PARAMS", params.tree());
    console.log("BODY", e.tree());
    // trace!?
    return new OdysseyFunction(params.tree(), e); //.tree())
  }
});

export class Odyssey {
  interpret(str: string) {
    let m = grammar.match(str);
    let result = null;
    if (m.succeeded()) {
      let s = semantics(m)
      let derive = s.derive();
      let tree = s.tree();
      let val = s.eval();
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
