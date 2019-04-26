import {
  Odyssey,
  Identifier,
  IntegerLiteral,
  AssignmentExpression
} from '.';

describe("Odyssey", () => {
  it('simple values', () => {
    let odyssey = new Odyssey()
    expect(odyssey.interpret("1234")).toEqual(
      [
        "1234", // derive
        [{value: 1234}], // tree
        '1234' // eval
      ]
    )
  });

  it('ids', () => {
    let odyssey = new Odyssey()
    expect(odyssey.interpret("a")).toEqual(
      [
        "a", // derive
        [{value: 'a'}], // tree
        'undefined' // eval
      ]
    )
  });

  it('assignment', () => {
    let odyssey = new Odyssey()
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
    let odyssey = new Odyssey()
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
      let odyssey = new Odyssey()
      expect(odyssey.interpret("12+4")).toEqual(
        [
          "12+4",
          [{left: {value: 12}, op: '+', right: { value: 4 }}],
          '16'
        ]
      )
    });

    it('subtracts', () => {
      let odyssey = new Odyssey()
      expect(odyssey.interpret("12-4")).toEqual(
        [
          "12-4",
          [{left: {value: 12}, op: '-', right: { value: 4 }}],
          '8'
        ]
      )
    });

    it('multiplies', () => {
      let odyssey = new Odyssey()
      expect(odyssey.interpret("12*4")).toEqual(
        [
          "12*4",
          [{left: {value: 12}, op: '*', right: { value: 4 }}],
          '48'
        ]
      )
    });

    it('divides', () => {
      let odyssey = new Odyssey();
      expect(odyssey.interpret("12/4")).toEqual(
        [
          "12/4",
          [{left: {value: 12}, op: '/', right: { value: 4 }}],
          '3'
        ]
      )
    });

    it('orders operations', () => {
      let odyssey = new Odyssey();
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
});
