export type Prettify<T> = { [K in keyof T]: T[K] } & {}

export type StrictOmit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>

export type RequireAtLeastOne<T, Keys extends keyof T = keyof T> =
  Pick<T, Exclude<keyof T, Keys>> &
  { [K in Keys]-?: Required<Pick<T, K>> & Partial<Pick<T, Exclude<Keys, K>>> }[Keys]

export type DeepReadonly<T> = {
  readonly [P in keyof T]: T[P] extends object ? DeepReadonly<T[P]> : T[P]
}

export type AsyncResult<T, E = Error> =
  | { readonly tag: 'success'; readonly data: T }
  | { readonly tag: 'failure'; readonly error: E }

export type SceneStatus = 'idle' | 'saving' | 'saved' | 'error'

export type ExportFormat = 'png' | 'svg'

export interface Timestamped {
  readonly createdAt: Timestamp
  readonly updatedAt: Timestamp
}

type Timestamp = string
