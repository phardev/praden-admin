// eslint-disable-next-line @typescript-eslint/no-unused-vars
interface String {
  includesWithoutCase(str: string): boolean
}

String.prototype.includesWithoutCase = function (str: string) {
  return this.toLowerCase().includes(str.toLowerCase())
}
