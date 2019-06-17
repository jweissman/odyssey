import { Node } from './types/node';

export class OdysseyContext {
  contexts: Array<{ [key: string]: any }> = [{}]

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



export class OdysseyInteger {
  constructor(public value: number) {}
  pretty = () => this.value.toString();
  plus(other: OdysseyInteger)  { return new OdysseyInteger(this.value + other.value); }
  minus(other: OdysseyInteger) { return new OdysseyInteger(this.value - other.value); }
  times(other: OdysseyInteger) { return new OdysseyInteger(this.value * other.value); }
  div(other: OdysseyInteger)   { return new OdysseyInteger(this.value / other.value); }
  pow(other: OdysseyInteger)   { return new OdysseyInteger(this.value ** other.value); }
  negate() {
    return new OdysseyInteger(-this.value);
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
      this.methodBody.derive(),
      "}",
    ].join('')

  }
}

