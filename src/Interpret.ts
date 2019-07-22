import { Node } from './types/node';
import { Identifier } from './ASTNode';

const util = {
  zip: (arr: Array<any>, other: Array<any>) => arr.map((e,i) => [e,other[i]]),
}

import {
  OdysseyContext,
  OdysseyInteger,
  OdysseyBool,
  OdysseyFunction,
  OdysseyCollection,
} from './VM';

import {
  //Identifier,
  //IntegerLiteral,
  //AssignmentExpression,
  //DefunExpression,
  //FuncallExpression,
  //BinaryExpression,
  //ParenthesizedExpression,
  //NegatedExpression,
  //ConditionalExpression,
  //ArrayLiteralExpression,
  ArrayLookupExpression,
} from './ASTNode';



const environment = new OdysseyContext()

/**
 * evaluation
 */
const interpret = {
  Program: (stmts: Node) => {
    let results = stmts.eval();
    let lastResult = results[results.length-1];
    return lastResult; // || new OdysseyInteger(0);
  },

  ArrayLit: (_lbrack: Node, elems: Node, _rbrack: Node) =>
    new OdysseyCollection(elems.eval()),

  ArrayIndex: (arr: Node, _lb: Node, idx: Node, _rb: Node) => {
    let theArray = arr.eval();
    if (theArray instanceof OdysseyCollection) {
      let theIndex = idx.eval();
      if (theIndex instanceof OdysseyInteger) {
        return theArray.at(theIndex.value);
      } else {
        throw new Error("Array indices should be integral, got: " + theIndex.pretty());
      }
    } else {
      throw new Error("Can't index into non-array: " + theArray.pretty());
    }
  },

  num: (val: Node) =>
    new OdysseyInteger(Number(val.sourceString)),

  Ternary: (cond: Node, _q: Node, left: Node, _col: Node, right: Node) =>
    cond.eval().flag ? left.eval() : right.eval(),

  CmpExp_lt: (left: Node, _lt: Node, right: Node) =>
    left.eval().isLessThan(right.eval()),

  CmpExp_eq: (left: Node, _lt: Node, right: Node) =>
    left.eval().isEqualTo(right.eval()),

  CmpExp_gt: (left: Node, _lt: Node, right: Node) =>
    left.eval().isGreaterThan(right.eval()),

  AddExp_plus: (left: Node, _plus: any, right: Node) =>
    left.eval().plus(right.eval()),

  AddExp_minus: (left: Node, _sub: any, right: Node) =>
    left.eval().minus(right.eval()),

  MulExp_times: (left: Node, _mul: any, right: Node) =>
    left.eval().times(right.eval()),

  MulExp_div: (left: Node, _div: any, right: Node) =>
    left.eval().div(right.eval()),

  ExpExp_pow: (left: Node, _pow: any, right: Node) =>
    left.eval().pow(right.eval()),

  PriExp_parens: (_lp: any, body: Node, _rp: any) =>
    body.eval(),

  PriExp_neg: (_sgn: any, val: Node) =>
    val.eval().negate(),

  ident: (first: Node, rest: Node) => {
    let key = [first.sourceString, rest.sourceString].join('')
    return environment.retrieve(key);
  },

  Assignment: (id: Node, _eq: any, e: Node) => {
    let ident = id.tree();
    let val = e.eval();
    if (ident instanceof ArrayLookupExpression) {
      let theArray = environment.retrieve(ident.array.value);
      let idx = ident.index;
      return theArray.put(val, idx)
    } else {
      return environment.put(id.sourceString, val);
    }
  },

  Defun: (params: Node, _fa: any, e: Node) => {
    let paramNames = params.tree().map((id: Identifier) => id.value)
    return new OdysseyFunction(paramNames, e, environment.copy());
  },

  Funcall: (id: Node, args: Node) => {
    let funName = id.sourceString;
    if (funName === 'print') {
      console.log(args.eval().map((arg: Node) => arg.pretty()));
      return OdysseyBool.yes();
    } else {
      let fn = id.eval();
      let theArgs = args.eval();
      let argumentValues = util.zip(fn.paramList, theArgs);
      let ctx = Object.assign({}, fn.context);
      Object.assign(ctx, environment.current);
      environment.push(ctx);
      argumentValues.forEach(([key, val]: [string, any]) => {
        environment.put(key, val);
      });
      let retVal = fn.methodBody.eval();
      environment.pop();
      return retVal;
    }
  },

  ArgList: (_lp: any, args: Node, _rp: any) => args.eval(),

  EmptyListOf: (): Node[] => [],
  emptyListOf: (): Node[] => [],

  NonemptyListOf: (eFirst: Node, _sep: any, eRest: Node) => {
    let result = [eFirst.eval(), ...eRest.eval()];
    return result;
  },

  nonemptyListOf: (eFirst: Node, _sep: any, eRest: Node) => {
    let result = [eFirst.eval(), ...eRest.eval()];
    return result;
  },
};

export default interpret;
