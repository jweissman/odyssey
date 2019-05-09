import {
  Identifier,
  IntegerLiteral,
  AssignmentExpression,
  DefunExpression,
  FuncallExpression,
} from './ASTNode';

import Odyssey from './Odyssey';

describe("Odyssey", () => {
  let odyssey: Odyssey;
  beforeEach(() => odyssey = new Odyssey());

  it('simple values', () => {
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


  describe('binary expressions', () => {
    it('adds', () => {
      //let odyssey = new Odyssey()
      expect(odyssey.interpret("12+4")).toEqual(
        [
          "12+4",
          [{left: {value: 12}, op: '+', right: { value: 4 }}],
          '16'
        ]
      )
    });

    it('subtracts', () => {
      //let odyssey = new Odyssey()
      expect(odyssey.interpret("12-4")).toEqual(
        [
          "12-4",
          [{left: {value: 12}, op: '-', right: { value: 4 }}],
          '8'
        ]
      )
    });

    it('multiplies', () => {
      //let odyssey = new Odyssey()
      expect(odyssey.interpret("12*4")).toEqual(
        [
          "12*4",
          [{left: {value: 12}, op: '*', right: { value: 4 }}],
          '48'
        ]
      )
    });

    it('divides', () => {
      //let odyssey = new Odyssey();
      expect(odyssey.interpret("12/4")).toEqual(
        [
          "12/4",
          [{left: {value: 12}, op: '/', right: { value: 4 }}],
          '3'
        ]
      )
    });

    test.todo('exponentiates')

    it('orders operations', () => {
      //let odyssey = new Odyssey();
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
        "()=>3"
      ])
    });

    test.todo('defines functions with params');

    it('applies functions', () => {
      odyssey.interpret("f=()=>3")
      expect(odyssey.interpret("f()")).toEqual([
        "f()",
        [new FuncallExpression(
          new Identifier('f'),
        )],
        "3"
      ]);
    });

    test.todo('applies functions with arguments');
  });
});
