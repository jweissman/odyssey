export type Node = {
  sourceString: string
  derive: () => string
  tree: () => any
  eval: () => any
  children: Node[]
}
