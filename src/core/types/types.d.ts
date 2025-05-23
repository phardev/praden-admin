export type UUID = string
export type Timestamp = number
export interface HashTable<T> {
  [key: string]: T
}
export type Mail = string

declare global {
  interface String {
    includesWithoutCase(str: string): boolean
    ftNormalize(): string
  }
}
