import grammar from './Grammar';

import {
  Identifier,
  IntegerLiteral,
  AssignmentExpression,
  DefunExpression,
  FuncallExpression,
  BinaryExpression,
} from './ASTNode';

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

  Defun: (params: Node, _fa: any, e: Node) => {
    let paramNames = params.tree().map((id: Identifier) => id.value)
    return new DefunExpression(paramNames, e.tree())
  },

  FormalParameterList: (_lp: any, params: Node, _rp: any) => params.tree(),

  EmptyListOf: (): Node[] => [],

  NonemptyListOf: (eFirst: Node, _sep: any, eRest: Node) =>
    [eFirst.tree(), ...eRest.tree()],

  Funcall: (id: Node, args: Node) =>
    new FuncallExpression(id.tree(), args.tree()),

  ArgList: (_lp: any, args: Node, _rp: any) => args.tree(),

});

/**
 * derive
 */

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

  NonemptyListOf: (eFirst: Node, _sep: any, eRest: Node) =>
    [eFirst.derive(), ...eRest.derive()],

  Funcall: (id: Node, args: Node) =>
    [
      id.derive(),
      args.derive(),
    ].join(''),

  ArgList: (_lp: any, args: Node, _rp: any) =>
    [
      "(",
      args.children.length &&
        args.children.map((arg: Node) => arg.derive()),
      ")",
    ].join('')
});

/**
 * evaluation
 */

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
  constructor(public paramList: Array<String>, public methodBody: Node) {}
  pretty = () => {
    debugger;
    // console.log({ fn: this });
    return [
      "(",
      this.paramList.join(', '),
      //length > 0 ? this.argList.map(arg => arg.derive()).join(',') : '',
      ")",
      "=>",
      "{",
      this.methodBody.derive(),
      "}",
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
    let paramNames = params.tree().map((id: Identifier) => id.value)
    return new OdysseyFunction(paramNames, e);
  },

  Funcall: (id: Node, args: Node) => {
    let fn = id.eval();
    return fn.methodBody.eval();
  }
});


export default semantics;
