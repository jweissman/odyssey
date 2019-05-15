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
          [new BinaryExpression(
            '/',
            new IntegerLiteral(12),
            new IntegerLiteral(4)
          )], //{left: {value: 12}, op: '/', right: { value: 4 }}],
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

    xit('applies functions with arguments', () => {
      odyssey.interpret("double=(x)=>x*2");
      expect(odyssey.interpret("double(3)")).toEqual([
        "double(3)",
        [new FuncallExpression(
          new Identifier('double'),
          [new IntegerLiteral(3)]
        )],
        '6'
      ]);
    });
  });
});
