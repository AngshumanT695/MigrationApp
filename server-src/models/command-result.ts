export interface CommandResult {
  pid?: number,
  status?: number | null,
  signal?: number | null,
  stdout?: string,
  stderr?: string,
  error?: Error
}
