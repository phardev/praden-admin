export class AssistanceRequestDoesNotExistsError extends Error {
  constructor(id: string) {
    super(`Assistance request does not exists error: ${id}`)
  }
}
