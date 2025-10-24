// biome-ignore-all lint/style/noNamespace: Ignore

declare global {
  namespace NodeJS {
    interface Global {
      crypto: Crypto
    }
  }
}

declare module 'crypto' {
  interface NodeCrypto {
    randomBytes(size: number): Buffer
    randomUUID(): string
    createHash(algorithm: string): any
  }
  const crypto: NodeCrypto & Partial<Crypto>
  export = crypto
}
