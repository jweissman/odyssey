import Odyssey from '.';

describe("Odyssey", () => {
  it('derives simple values', () => {
    let odyssey = new Odyssey()
    expect(odyssey.interpret("1234")).toEqual(
      [
        "1234", // derive
        [{value: 1234}], // tree
        '1234' // eval
      ]
    )
  });

  it('derives binary expressions', () => {
    let odyssey = new Odyssey()
    expect(odyssey.interpret("12+4")).toEqual(
      [
        "12+4",
        [{left: {value: 12}, op: '+', right: { value: 4 }}],
        '16'
      ]
    )

    expect(odyssey.interpret("12-4")).toEqual(
      [
        "12-4",
        [{left: {value: 12}, op: '-', right: { value: 4 }}],
        '8'
      ]
    )
  });

  it('derives binary expressions with multiplication', () => {
    let odyssey = new Odyssey()
    expect(odyssey.interpret("12*4")).toEqual(
      [
        "12*4",
        [{left: {value: 12}, op: '*', right: { value: 4 }}],
        '48'
      ]
    )
  });
});
