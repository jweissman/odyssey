import { Node } from './types/node';

const pretty = {
  Program: (stmts: Node) => stmts.children.map(
    (stmt: Node) => stmt.pretty()
  ).join(';'),

  ident: (leadingChar: Node, rest: Node) =>
    [leadingChar.sourceString, rest.sourceString].join(''),

  num: (val: Node) => val.sourceString,

  StringLit: (_lq: Node, content: Node, _rq: Node) =>
    [ "'", content.sourceString, "'" ],

  ArrayLit: (_lbrack: Node, elems: Node, _rbrack: Node) =>
    [ "[", elems.pretty(), "]" ].join(''),

  ArrayIndex: (arrayName: Node, _lb: Node, index: Node, _rb: Node) =>
    [ arrayName.pretty(), "[", index.pretty(), "]" ],

  Ternary: (cond: Node, _q: Node, left: Node, _col: Node, right: Node) =>
    [ cond.pretty(), "?", left.pretty(), ":", right.pretty() ].join(''),

  CmpExp_lt: (left: Node, _lt: Node, right: Node) =>
    [ left.pretty(), '<', right.pretty() ].join(''),

  CmpExp_eq: (left: Node, _lt: Node, right: Node) =>
    [ left.pretty(), '==', right.pretty() ].join(''),

  CmpExp_gt: (left: Node, _lt: Node, right: Node) =>
    [ left.pretty(), '>', right.pretty() ].join(''),

  AddExp_plus: (left: Node, _pl: Node, right: Node) =>
    [ left.pretty(), '+', right.pretty() ].join(''),

  AddExp_minus: (left: Node, _sub: Node, right: Node) =>
    [ left.pretty(), '-', right.pretty() ].join(''),

  MulExp_times: (left: Node, _mul: any, right: Node) =>
    [ left.pretty(), '*', right.pretty() ].join(''),

  MulExp_div: (left: Node, _mul: any, right: Node) =>
    [ left.pretty(), '/', right.pretty() ].join(''),

  ExpExp_pow: (left: Node, _pow: any, right: Node) =>
    [ left.pretty(), '^', right.pretty() ].join(''),

  PriExp_parens: (_lp: any, body: Node, _rp: any) =>
    [ "(", body.pretty(), ")" ].join(''),

  PriExp_neg: (_sgn: any, val: Node) =>
    [ "-", val.pretty() ],

  Assignment: (id: Node, _eq: any, e: Node) =>
    [ id.pretty(), '=', e.pretty() ].join(''),

  Defun: (params: Node, _fa: any, e: Node) =>
    [
      params.pretty(), "=>", "{", e.pretty(), "}"
    ].join(''),

  FormalParameterList: (_lp: any, params: Node, _rp: any) =>
    [
      "(",
      params.children.length &&
        params.children.map((param: Node) => param.pretty()),
      ")",
    ].join(''),

  EmptyListOf: () => '',
  emptyListOf: () => '',

  NonemptyListOf: (eFirst: Node, _sep: any, eRest: Node) =>
    [eFirst.pretty(), ...eRest.pretty()],

  nonemptyListOf: (eFirst: Node, _sep: any, eRest: Node) =>
    [eFirst.pretty(), ...eRest.pretty()],

  Funcall: (id: Node, args: Node) =>
    [
      id.pretty(),
      args.pretty(),
    ].join(''),

  ArgList: (_lp: any, args: Node, _rp: any) =>
    [
      "(",
      args.children.length &&
        args.children.map((arg: Node) => arg.pretty()),
      ")",
    ].join('')
};

export default pretty;
