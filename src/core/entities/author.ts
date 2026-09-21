export type Author =
  | { kind: 'staff'; email: string; firstname?: string; lastname?: string }
  | { kind: 'system' }
  | { kind: 'unknown' }
