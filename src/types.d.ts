declare module '*.svg?raw' {
  const content: string
  export default content
}

interface Window {
  Quill: typeof import('quill').default;
}

// 全局变量声明
declare const __VERSION__: string
