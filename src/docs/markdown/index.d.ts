declare module '*.md' {
  const content: string
  export default content
}

declare module 'src/docs/markdown/*.md' {
  const content: string
  export default content
}
