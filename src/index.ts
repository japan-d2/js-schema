import { SchemaDefinition } from './interfaces'
import { JSONSchema7, JSONSchema7Definition } from 'json-schema'
import * as JSONSchema from 'jsonschema'

interface GenericOptions {
  optional?: boolean;
}

export type DirtyProps<T> = { [P in keyof T]?: unknown }
export type Dirty<T extends SchemaDefinition<any>> = DirtyProps<ReturnType<T['getType']>>
export type Pure<T extends SchemaDefinition<any>> = ReturnType<T['getType']>

type Flatten<T> = { [K in keyof T]: T[K] }

function createContext <C> (properties: JSONSchema7['properties'] = {}, required: string[] = []): SchemaDefinition<C> {
  const schema: JSONSchema7 = {
    type: 'object',
    properties,
    required
  }

  function extractOptional <T extends GenericOptions> (options: T): Exclude<T, 'optional'> {
    const opts = { ...options }
    if ('optional' in opts) {
      delete opts.optional
    }
    return opts as any
  }

  function _string (name: string, options?: GenericOptions): any {
    return createContext({
      ...properties,
      [name]: {
        type: 'string',
        ...extractOptional(options || {})
      }
    }, [...required, ...(options?.optional ? [] : [name])])
  }

  function _number (name: string, options?: GenericOptions): any {
    return createContext({
      ...properties,
      [name]: {
        type: 'number',
        ...extractOptional(options || {})
      }
    }, [...required, ...(options?.optional ? [] : [name])])
  }

  function _integer (name: string, options?: GenericOptions): any {
    return createContext({
      ...properties,
      [name]: {
        type: 'integer',
        ...extractOptional(options || {})
      }
    }, [...required, ...(options?.optional ? [] : [name])])
  }

  function _boolean (name: string, options: GenericOptions): any {
    return createContext({
      ...properties,
      [name]: {
        type: 'boolean',
        ...extractOptional(options || {})
      }
    }, [...required, ...(options?.optional ? [] : [name])])
  }

  function _null (name: string, options: GenericOptions): any {
    return createContext({
      ...properties,
      [name]: {
        type: 'null',
        ...extractOptional(options || {})
      }
    }, [...required, ...(options?.optional ? [] : [name])])
  }

  function _const (name: string, value: any, options?: GenericOptions): any {
    return createContext({
      ...properties,
      [name]: {
        const: value,
        ...extractOptional(options || {})
      }
    }, [...required, ...(options?.optional ? [] : [name])])
  }

  function _enum (name: string, type: string, values: any[], options: GenericOptions): any {
    return createContext({
      ...properties,
      [name]: ({
        type,
        enum: values,
        ...extractOptional(options || {})
      }) as JSONSchema7Definition
    }, [...required, ...(options?.optional ? [] : [name])])
  }

  function _array (name: string, type: string, options: any = {}, arrayOptions: GenericOptions = {}): any {
    return createContext({
      ...properties,
      [name]: {
        type: 'array',
        items: {
          type,
          ...(options.toJSONSchema ? options.toJSONSchema() : options)
        },
        ...extractOptional(arrayOptions)
      }
    }, [...required, ...(arrayOptions?.optional ? [] : [name])])
  }

  function _object (name: string, options: any, objectOptions: GenericOptions): any {
    return createContext({
      ...properties,
      [name]: {
        type: 'object',
        ...(options.toJSONSchema ? options.toJSONSchema() : options),
        ...extractOptional(objectOptions)
      }
    }, [...required, ...(objectOptions?.optional ? [] : [name])])
  }

  function _omit (name: string): any {
    const p = { ...properties }
    delete p[name]
    return createContext(properties)
  }

  function _extend (context: SchemaDefinition<any>): any {
    const schema = context.toJSONSchema()
    return createContext({
      ...properties,
      ...schema.properties
    }, [...(schema.required || []), ...required])
  }

  return {
    string: _string as any,
    number: _number as any,
    integer: _integer as any,
    boolean: _boolean as any,
    null: _null as any,
    const: _const as any,
    enum: _enum as any,
    array: _array as any,
    object: _object as any,
    omit: _omit as any,
    extend: _extend as any,
    getType: undefined as any,
    toJSONSchema (): JSONSchema7 {
      return { ...schema }
    }
  }
}

export function defineSchema (): SchemaDefinition<{}> {
  return createContext()
}

export function validate <T> (input: DirtyProps<T>, schema: SchemaDefinition<T>, options?: JSONSchema.Options): input is Flatten<T> {
  const result = JSONSchema.validate(input, schema.toJSONSchema(), {
    ...options,
    throwError: false
  })
  return result.valid
}

export function assertValid <T> (input: DirtyProps<T>, schema: SchemaDefinition<T>, options?: JSONSchema.Options): asserts input is Flatten<T> {
  JSONSchema.validate(input, schema.toJSONSchema(), {
    ...options,
    throwError: true
  })
}
