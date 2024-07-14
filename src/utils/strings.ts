// eslint-disable-next-line @typescript-eslint/no-unused-vars
interface String {
  includesWithoutCase(str: string): boolean
  ftNormalize(): string
}

String.prototype.includesWithoutCase = function (str: string) {
  return this.toLowerCase().includes(str.toLowerCase())
}

String.prototype.ftNormalize = function () {
  return this.normalize('NFD').replace(/[\u0300-\u036f]/g, '')
}
