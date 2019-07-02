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
} from './ASTNode';

const tree = {
  ident: (head: Node, rest: Node) => new Identifier(
    [head.sourceString, rest.sourceString].join('')
  ),

  num: (digits: Node) => new IntegerLiteral(
    Number(digits.sourceString)
  ),

  //Ternary: (cond: Node, 
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

  NonemptyListOf: (eFirst: Node, _sep: any, eRest: Node) =>
    [eFirst.tree(), ...eRest.tree()],

  nonemptyListOf: (eFirst: Node, _sep: any, eRest: Node) =>
    [eFirst.tree(), ...eRest.tree()],

  Funcall: (id: Node, args: Node) =>
    new FuncallExpression(id.tree(), args.tree()),

  ArgList: (_lp: any, args: Node, _rp: any) => args.tree(),

}

export default tree;
