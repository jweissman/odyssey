import {
  Identifier,
  IntegerLiteral,
  AssignmentExpression,
  DefunExpression,
  FuncallExpression,
  BinaryExpression,
} from './ASTNode';

import Odyssey from './Odyssey';

describe("Odyssey", () => {
  let odyssey: Odyssey;
  beforeEach(() => odyssey = new Odyssey());

  describe('elements', () => {
    it('values', () => {
      expect(odyssey.interpret("1234")).toEqual(
        [
          "1234", // derive
          [new IntegerLiteral(1234)], // tree
          '1234' // eval
        ]
      )
    });

    it('ids', () => {
      expect(() => odyssey.interpret("a")).toThrow()
    });

    it('assignment', () => {
      expect(odyssey.interpret("a=3")).toEqual(
        [
          "a=3",
          [new AssignmentExpression(
            new Identifier('a'),
            new IntegerLiteral(3)
          )],
          '3'
        ]
      )
    });

    it('retrieves assigned values', () => {
      expect(odyssey.interpret("a")).toEqual(
        [
          "a",
          [ new Identifier('a') ],
          '3'
        ]
      )
    });
  });


  describe('binary expressions', () => {
    it('adds', () => {
      expect(odyssey.interpret("12+4")).toEqual(
        [
          "12+4",
          [{left: {value: 12}, op: '+', right: { value: 4 }}],
          '16'
        ]
      )
    });

    it('subtracts', () => {
      expect(odyssey.interpret("12-4")).toEqual(
        [
          "12-4",
          [{left: {value: 12}, op: '-', right: { value: 4 }}],
          '8'
        ]
      )
    });

    it('multiplies', () => {
      expect(odyssey.interpret("12*4")).toEqual(
        [
          "12*4",
          [{left: {value: 12}, op: '*', right: { value: 4 }}],
          '48'
        ]
      )
    });

    it('divides', () => {
      expect(odyssey.interpret("12/4")).toEqual(
        [
          "12/4",
          [new BinaryExpression(
            '/',
            new IntegerLiteral(12),
            new IntegerLiteral(4)
          )],
          '3'
        ]
      )
    });

    it('orders operations', () => {
      expect(odyssey.interpret("12/4+2")).toEqual(
        [
          "12/4+2",
          [
            {
              left: {
                left: {value: 12},
                op: '/',
                right: { value: 4 }
              },
              op: '+',
              right: { value: 2 },
            }
          ],
          '5'
        ]
      )
    });

    it('exponentiation', () => {
      expect(odyssey.evaluate("2*3^4")).toEqual('162')
    });

    it('parentheses', () => {
      expect(odyssey.evaluate("(2*3)^4")).toEqual('1296')
    });

    it('negates', () => {
      expect(odyssey.evaluate("-2+1")).toEqual('-1')
    });

  });

  // fib = (n) => n > 1 ? fib(n-1)+fib(n-2) : 1
  describe('functions', () => {
    it('defines functions', () => {
      expect(odyssey.interpret("f=()=>3")).toEqual([
        "f=()=>{3}",
        [new AssignmentExpression(
          new Identifier('f'),
          new DefunExpression([], new IntegerLiteral(3))
        )],
        "()=>{3}"
      ])
    });

    it('defines functions with params', () => {
      let tree = new AssignmentExpression(
        new Identifier('double'),
        new DefunExpression(
          ['x'],
          new BinaryExpression(
            '*',
            new Identifier('x'),
            new IntegerLiteral(2)
          )
        )
      );

      expect(odyssey.interpret("double=(x)=>x*2")).toEqual([
        "double=(x)=>{x*2}",
        [tree],
        "(x)=>{x*2}",
      ]);
    });

    it('applies functions', () => {
      odyssey.interpret("f=()=>3")
      expect(odyssey.interpret("f()")).toEqual([
        "f()",
        [new FuncallExpression(new Identifier('f'))],
        "3"
      ]);
    });

    it('treats function calls as values', () => {
      odyssey.interpret("f=()=>3")
      expect(odyssey.interpret("f() + 4")).toEqual([
        "f()+4",
        [new BinaryExpression('+',
          new FuncallExpression(new Identifier('f')),
          new IntegerLiteral(4)
        )],
        "7"
      ]);
    });

    it('applies functions with a single argument', () => {
      odyssey.evaluate("double=(x)=>x*2");
      expect(odyssey.interpret("double(3)")).toEqual([
        "double(3)",
        [new FuncallExpression(
          new Identifier('double'),
          [new IntegerLiteral(3)]
        )],
        '6'
      ]);
    });

    it('applies functions with more than one argument', () => {
      odyssey.evaluate("times=(x,y)=>x*y");
      expect(odyssey.interpret("times(3, 5)")).toEqual([
        "times(3,5)",
        [new FuncallExpression(
          new Identifier('times'),
          [new IntegerLiteral(3), new IntegerLiteral(5)]
        )],
        '15'
      ]);
    });


    it('can define higher-order functions', () => {
      odyssey.evaluate("square=(x)=>x*x");
      odyssey.evaluate("twice=(f,x)=>f(f(x))")
      expect(odyssey.evaluate('square(2)')).toEqual('4')
      expect(odyssey.evaluate('twice(square, 2)')).toEqual('16')
    });

    it('curries', () => {
      odyssey.evaluate("plus=(x)=>(y)=>x+y")
      odyssey.evaluate("inc=plus(1)")
      expect(odyssey.evaluate("inc(3)")).toEqual('4')
      expect(odyssey.evaluate("inc(30)")).toEqual('31')
    });

    test.todo('multi-line fns');
    test.todo('omit parens around funcall args');
    test.todo('omit parens around defun params');
  });

  describe('syntax', () => {
    it('multiple stmts', () => {
      expect(odyssey.evaluate('a=3; a+2')).toEqual('5')
      expect(odyssey.evaluate(
        `
          b = 10
          a + b
        `
      )).toEqual('13')
    });

    xit('comparisons', () => {
      expect(odyssey.evaluate('1<2')).toEqual('True')
      expect(odyssey.evaluate('1==2')).toEqual('False')
      // expect(odyssey.evaluate('1>2')).toEqual('False')
    });
  });


  test.todo('modules');
  test.todo('classes');
});
