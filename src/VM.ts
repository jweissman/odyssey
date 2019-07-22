import { Node } from './types/node';

export class OdysseyContext {
  contexts: Array<{ [key: string]: any }> = [{
    // print: new OdysseyFunction(),
  }]

  get current() {
    return this.contexts[this.contexts.length-1];
  }

  put = (key: string, val: any) => {
    this.current[key] = val;
    return val;
  }

  retrieve = (key: string) => {
    let value = this.current[key];
    if (!value) {
      throw new Error(`No such variable "${key}"`);
    }
    return value;
  }

  push = (ctx: { [key: string]: any }) => {
    let nextContext = Object.assign({}, ctx);
    this.contexts.push(nextContext)
  }

  pop = () => {
    this.contexts.pop();
  }

  copy = () => Object.assign({}, this.current)
}

// class OdysseyValue {}

export class OdysseyBool {
  static yes = () => new OdysseyBool(true);
  static no = () => new OdysseyBool(false);
  constructor(public flag: boolean) {}
  pretty = () => this.flag ? 'True' : 'False';
}

export class OdysseyInteger {
  constructor(public value: number) {}
  pretty = () => this.value.toString();
  plus(other: OdysseyInteger)  { return new OdysseyInteger(this.value + other.value); }
  minus(other: OdysseyInteger) { return new OdysseyInteger(this.value - other.value); }
  times(other: OdysseyInteger) { return new OdysseyInteger(this.value * other.value); }
  div(other: OdysseyInteger)   { return new OdysseyInteger(this.value / other.value); }
  pow(other: OdysseyInteger)   { return new OdysseyInteger(this.value ** other.value); }
  negate() { return new OdysseyInteger(-this.value); }

  isGreaterThan(other: OdysseyInteger) {
    return this.cmp(other) == 1
      ? OdysseyBool.yes()
      : OdysseyBool.no();
  }

  isLessThan(other: OdysseyInteger) {
    return this.cmp(other) == -1
      ? OdysseyBool.yes()
      : OdysseyBool.no();
  }

  isEqualTo(other: OdysseyInteger) {
    return this.cmp(other) == 0
      ? OdysseyBool.yes()
      : OdysseyBool.no();
  }

  private cmp(other: OdysseyInteger) {
    if (this.value > other.value) {
      return 1;
    } else if (this.value < other.value) {
      return -1;
    } else {
      return 0;
    }
  }
}

export class OdysseyFunction {
  constructor(
    public paramList: Array<String>,
    public methodBody: Node,
    public context: { [key: string]: any }
  ) {}
  pretty = () => {
    return [
      "(",
      this.paramList.join(', '),
      ")",
      "=>",
      "{",
      this.methodBody.pretty(),
      "}",
    ].join('')
  }
}

class OdysseyNull {
  public static instance = new OdysseyNull();
  constructor() {}
  pretty() { return '(null)' }
}

export class OdysseyCollection {
  constructor(
    public elements: Array<OdysseyInteger>
  ) {}

  at(index: number) {
    return this.elements[index] || OdysseyNull.instance;
  }

  put(value: OdysseyInteger, index: number) {
    this.elements[index] = value;
    return value;
  }

  pretty = () => {
    return "[" + this.elements.map(e => e.pretty()).join(',') + "]";
  }
}
