export type Node = {
  sourceString: string
  pretty: () => string
  tree: () => any
  eval: () => any
  children: Node[]
}
