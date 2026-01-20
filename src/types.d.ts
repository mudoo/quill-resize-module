declare module '*.svg?raw' {
  const content: string
  export default content
}

interface Window {
  Quill: typeof import('quill').default;
}
