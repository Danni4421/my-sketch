declare const __brand: unique symbol

export type Brand<T, B extends string> = T & { readonly [__brand]: B }

export type SceneKey = Brand<string, 'SceneKey'>
export type ApiUrl = Brand<string, 'ApiUrl'>
export type JsonString = Brand<string, 'JsonString'>
export type Timestamp = Brand<string, 'Timestamp'>

export const createSceneKey = (value: string): SceneKey => value as SceneKey
export const createApiUrl = (value: string): ApiUrl => value as ApiUrl
export const createJsonString = (value: string): JsonString => value as JsonString
export const createTimestamp = (value: string): Timestamp => value as Timestamp
