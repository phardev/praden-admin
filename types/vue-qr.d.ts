declare module 'vue-qr/src/packages/vue-qr.vue' {
  import { DefineComponent } from 'vue'
  const component: DefineComponent<
    {
      text?: string
      size?: number
      margin?: number
      colorDark?: string
      colorLight?: string
      bgSrc?: string
      gifBgSrc?: string
      logoSrc?: string
      logoScale?: number
      logoMargin?: number
      logoCornerRadius?: number
      whiteMargin?: boolean
      dotScale?: number
      autoColor?: boolean
      binarize?: boolean
      binarizeThreshold?: number
      callback?: (dataUrl: string, id?: string) => void
      bindElement?: boolean
    },
    object,
    unknown
  >
  export default component
}
