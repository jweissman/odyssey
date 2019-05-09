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

type Op = '+' | '-' | '*' | '/'
export class BinaryExpression extends ASTNode {
  constructor(
    public op: Op,
    public left: ASTNode,
    public right: ASTNode
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
