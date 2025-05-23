String.prototype.includesWithoutCase = function (str: string) {
  return this.toLowerCase().includes(str.toLowerCase())
}

String.prototype.ftNormalize = function () {
  return this.normalize('NFD').replace(/[\u0300-\u036f]/g, '')
}
