declare module 'gif.js' {
  interface GIFOptions {
    workers?: number
    quality?: number
    width?: number
    height?: number
    repeat?: number
  }

  interface FrameOptions {
    delay?: number
  }

  class GIF {
    constructor(options?: GIFOptions)
    addFrame(canvas: HTMLCanvasElement, options?: FrameOptions): void
    on(event: 'finished', callback: (blob: Blob) => void): void
    on(event: 'progress', callback: (progress: number) => void): void
    render(): void
  }

  export default GIF
}

declare module 'omggif' {
  interface FrameInfo {
    x: number
    y: number
    width: number
    height: number
    delay: number
    disposal: number
  }

  export class GifReader {
    constructor(data: Uint8Array)
    width: number
    height: number
    numFrames(): number
    frameInfo(frameIndex: number): FrameInfo
    decodeAndBlitFrameRGBA(frameIndex: number, pixels: Uint8ClampedArray): void
  }
}