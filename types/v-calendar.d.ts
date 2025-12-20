declare module 'v-calendar/dist/types/src/use/datePicker' {
  export type DatePickerDate = Date | string | number | null
  export type DatePickerRangeObject = {
    start: DatePickerDate
    end: DatePickerDate
  }
}
