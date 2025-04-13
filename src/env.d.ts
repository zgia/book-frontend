/// <reference types="vite/client" />
/// <reference types="unplugin-icons/types/vue" />

declare module '*.vue' {
  import { DefineComponent } from 'vue'
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  const component: DefineComponent<{}, {}, any>
  export default component
}

declare module 'sprintf-js'
declare module 'md5'
declare module 'ua-parser-js'
