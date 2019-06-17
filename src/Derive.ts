import { Node } from './types/node';

const derive = {
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

  ExpExp_pow: (left: Node, _pow: any, right: Node) =>
    [ left.derive(), '^', right.derive() ].join(''),

  PriExp_parens: (_lp: any, body: Node, _rp: any) =>
    [ "(", body.derive(), ")" ].join(''),

  PriExp_neg: (_sgn: any, val: Node) =>
    [ "-", val.derive() ],

  Assignment: (id: Node, _eq: any, e: Node) =>
    [ id.derive(), '=', e.derive() ].join(''),

  Defun: (params: Node, _fa: any, e: Node) =>
    [
      params.derive(), "=>", "{", e.derive(), "}"
    ].join(''),

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
};

export default derive;
