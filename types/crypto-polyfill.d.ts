declare global {
  namespace NodeJS {
    interface Global {
      crypto: Crypto
    }
  }
}

export {}
