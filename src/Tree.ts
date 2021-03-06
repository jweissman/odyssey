import { Node } from './types/node';

import {
  Identifier,
  IntegerLiteral,
  AssignmentExpression,
  DefunExpression,
  FuncallExpression,
  BinaryExpression,
  ParenthesizedExpression,
  NegatedExpression,
  ConditionalExpression,
  ArrayLiteralExpression,
  ArrayLookupExpression,
  StringLiteralExpression,
  HashLiteralExpression,
  KeyValueExpression,
  DotAccessExpression,
  BlockExpression,
} from './ASTNode';

const tree = {
  Block: (_lb: Node, prog: Node, _rb: Node) => new BlockExpression(
    prog.tree()
  ),

  ident: (head: Node, rest: Node) => new Identifier(
    [head.sourceString, rest.sourceString].join('')
  ),

  num: (digits: Node) => new IntegerLiteral(
    Number(digits.sourceString)
  ),

  StringLit: (_lq: Node, content: Node, _rq: Node) =>
    new StringLiteralExpression(content.sourceString),

  ArrayLit: (_lb: Node, elems: Node, _rb: Node) =>
    new ArrayLiteralExpression(elems.tree()),

  ArrayIndex: (arr: Node, _lb: Node, idx: Node, _rb: Node) =>
    new ArrayLookupExpression(arr.tree(), idx.tree().value),

  HashLit: (_lc: Node, kvs: Node, _rc: Node) =>
    new HashLiteralExpression(kvs.tree()),

  KeyValuePair: (key: Node, _col: Node, val: Node) =>
    new KeyValueExpression(key.tree(), val.tree()),

  DotAccess: (obj: Node, _dot: Node, attr: Node) =>
    new DotAccessExpression(obj.tree(), attr.tree()),

  Ternary: (cond: Node, _q: Node, left: Node, _col: Node, right: Node) =>
    new ConditionalExpression(cond, left, right),

  CmpExp_lt: (left: Node, _lt: Node, right: Node): BinaryExpression =>
    new BinaryExpression('<', left.tree(), right.tree()),

  CmpExp_eq: (left: Node, _lt: Node, right: Node): BinaryExpression =>
    new BinaryExpression('=', left.tree(), right.tree()),

  CmpExp_gt: (left: Node, _lt: Node, right: Node): BinaryExpression =>
    new BinaryExpression('>', left.tree(), right.tree()),

  AddExp_plus: (left: Node, _pl: any, right: Node): BinaryExpression =>
    new BinaryExpression('+', left.tree(), right.tree()),

  AddExp_minus: (left: Node, _sub: any, right: Node): BinaryExpression =>
    new BinaryExpression('-', left.tree(), right.tree()),

  MulExp_times: (left: Node, _tm: any, right: Node): BinaryExpression =>
    new BinaryExpression('*', left.tree(), right.tree()),

  MulExp_div: (left: Node, _tm: any, right: Node): BinaryExpression =>
    new BinaryExpression('/', left.tree(), right.tree()),

  ExpExp_pow: (left: Node, _pow: any, right: Node): BinaryExpression =>
    new BinaryExpression('^', left.tree(), right.tree()),

  PriExp_parens: (_lp: any, body: Node, _rp: any): ParenthesizedExpression =>
    new ParenthesizedExpression(body.tree()),

  PriExp_neg: (_sgn: any, val: Node): NegatedExpression =>
    new NegatedExpression(val.tree()),

  Assignment: (id: Node, _eq: any, e: Node): AssignmentExpression =>
    new AssignmentExpression(id.tree(), e.tree()),

  Defun: (params: Node, _fa: any, e: Node) => {
    let paramNames = params.tree().map((id: Identifier) => id.value)
    return new DefunExpression(paramNames, e.tree())
  },

  FormalParameterList: (_lp: any, params: Node, _rp: any) => params.tree(),

  EmptyListOf: (): Node[] => [],
  emptyListOf: (): Node[] => [],

  NonemptyListOf: (eFirst: Node, _sep: any, eRest: Node) =>
    [eFirst.tree(), ...eRest.tree()],

  nonemptyListOf: (eFirst: Node, _sep: any, eRest: Node) =>
    [eFirst.tree(), ...eRest.tree()],

  Funcall: (id: Node, args: Node) =>
    new FuncallExpression(id.tree(), args.tree()),

  FuncallLambda: (id: Node, _spc: Node, args: Node) =>
    new FuncallExpression(id.tree(), args.tree()),

  ArgList: (_lp: any, args: Node, _rp: any) => args.tree(),

}

export default tree;
