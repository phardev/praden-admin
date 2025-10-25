// biome-ignore-all lint/style/noNamespace: Ignore

declare global {
  namespace NodeJS {
    interface Global {
      crypto: Crypto
    }
  }
}

export {}
