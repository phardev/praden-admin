declare module 'v-calendar/dist/types/src/use/datePicker' {
  export type DatePickerDate = Date | string | number | null

  export interface DatePickerRangeObject {
    start: DatePickerDate
    end: DatePickerDate
  }
}
