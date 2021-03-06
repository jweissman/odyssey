class ASTNode {
}

export class Identifier extends ASTNode {
  constructor(public value: string) {
    super()
  }
}

export class IntegerLiteral extends ASTNode {
  constructor(public value: number) {
    super()
  }
}

export class ParenthesizedExpression extends ASTNode {
  constructor(
    public body: ASTNode
  ) {
    super()
  }
}

export class NegatedExpression extends ASTNode {
  constructor(public val: ASTNode) {
    super()
  }
}

type Op = '+' | '-' | '*' | '/' | '^' | '<' | '=' | '>'
export class BinaryExpression extends ASTNode {
  constructor(
    public op: Op,
    public left: ASTNode,
    public right: ASTNode
  ) {
    super()
  }
}

export class ConditionalExpression extends ASTNode {
  constructor(
    public condition: ASTNode,
    public left: ASTNode,
    public right: ASTNode,
  ) {
    super()
  }
}

export class AssignmentExpression extends ASTNode {
  constructor(
    public id: Identifier,
    public e: ASTNode,
  ) {
    super()
  }
}

export class DefunExpression extends ASTNode {
  constructor(
    public params: Array<String>,
    public e: ASTNode,
  ) {
    super()
  }
}

export class FuncallExpression extends ASTNode {
  constructor(
    public fn: Identifier,
    public args: Array<ASTNode> = [],
  ) {
    super()
  }
}

export class ArrayLiteralExpression extends ASTNode {
  constructor(
    public elems: Array<ASTNode> = []
  ) {
    super();
  }
}

export class ArrayLookupExpression extends ASTNode {
  constructor(
    public array: Identifier,
    public index: number,
  ) {
    super();
  }
}

export class StringLiteralExpression extends ASTNode {
  constructor(
    public value: string
  ) {
    super();
  }
}

export class KeyValueExpression extends ASTNode {
  constructor(
    public key: string,
    public value: ASTNode
  ) {
    super();
  }
}

export class HashLiteralExpression extends ASTNode {
  constructor(
    public keyValues: Array<KeyValueExpression>
  ) {
    super();
  }
}

export class DotAccessExpression extends ASTNode {
  constructor(
    public obj: Identifier,
    public attr: Identifier
  ) {
    super();
  }
}

export class BlockExpression extends ASTNode {
  constructor(
    public program: ASTNode,
  ) {
    super();
  }
}
