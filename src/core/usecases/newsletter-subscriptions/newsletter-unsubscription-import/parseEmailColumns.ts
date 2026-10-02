import type { EmailColumn } from '@core/entities/newsletterUnsubscriptionImport'

const SEPARATORS = [',', ';', '\t', '|']
const EMAIL_PATTERN = /[^\s<>"'(),;:|]+@[^\s<>"'(),;:|@]+\.[^\s<>"'(),;:|@.]+/

const splitLines = (content: string): Array<string> =>
  content
    .replace(/^﻿/, '')
    .split(/\r\n|\n|\r/)
    .filter((line) => line.trim() !== '')

const countOccurrences = (line: string, separator: string): number =>
  line.split(separator).length - 1

const detectSeparator = (headerLine: string): string =>
  SEPARATORS.reduce((best, separator) =>
    countOccurrences(headerLine, separator) > countOccurrences(headerLine, best)
      ? separator
      : best
  )

const splitRow = (line: string, separator: string): Array<string> => {
  const cells: Array<string> = []
  let cell = ''
  let isQuoted = false
  for (const char of line) {
    if (char === '"') {
      isQuoted = !isQuoted
    } else if (char === separator && !isQuoted) {
      cells.push(cell)
      cell = ''
    } else {
      cell += char
    }
  }
  return [...cells, cell].map((value) => value.trim())
}

const extractEmail = (cell: string | undefined): string | undefined =>
  cell?.match(EMAIL_PATTERN)?.[0].toLowerCase()

const toEmailColumn = (
  rows: Array<Array<string>>,
  index: number
): EmailColumn => {
  const header = rows[0][index]
  const emails = rows
    .map((row) => extractEmail(row[index]))
    .filter((email): email is string => email !== undefined)
  const column: EmailColumn = {
    position: index + 1,
    emails: [...new Set(emails)]
  }
  if (header && !extractEmail(header)) {
    column.name = header
  }
  return column
}

export const parseEmailColumns = (content: string): Array<EmailColumn> => {
  const lines = splitLines(content)
  if (lines.length === 0) return []
  const separator = detectSeparator(lines[0])
  const rows = lines.map((line) => splitRow(line, separator))
  const columnsCount = Math.max(...rows.map((row) => row.length))
  return Array.from({ length: columnsCount }, (_, index) =>
    toEmailColumn(rows, index)
  ).filter((column) => column.emails.length > 0)
}

export const pickMainEmailColumn = (
  columns: Array<EmailColumn>
): EmailColumn | undefined =>
  columns.reduce<EmailColumn | undefined>(
    (main, column) =>
      !main || column.emails.length > main.emails.length ? column : main,
    undefined
  )
