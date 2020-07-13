import { SchemaDefinition } from './interfaces'
import { JSONSchema7, JSONSchema7Definition } from 'json-schema'
import * as JSONSchema from 'jsonschema'
export { ValidationError } from 'jsonschema'

interface GenericOptions {
  optional?: boolean;
  nullable?: boolean;
}

export type DirtyProps<T> = { [P in keyof T]?: unknown }
export type Pure<T> = T extends SchemaDefinition<infer T> ? T : never
export type Dirty<T extends SchemaDefinition<any>> = DirtyProps<Pure<T>>

type Flatten<T> = { [K in keyof T]: T[K] }

function createContext <C> (properties: JSONSchema7['properties'] = {}, required: string[] = []): SchemaDefinition<C> {
  const schema: JSONSchema7 = {
    type: 'object',
    properties,
    required
  }

  function orNull (schema: JSONSchema7Definition, nullable: boolean): JSONSchema7Definition {
    if (!nullable) {
      return schema
    }
    return {
      oneOf: [schema, {
        type: 'null'
      }]
    }
  }

  function extractOptional <T extends GenericOptions> (options: T): Exclude<T, 'optional' | 'nullable'> {
    const opts = { ...options }
    if ('optional' in opts) {
      delete opts.optional
    }
    if ('nullable' in opts) {
      delete opts.nullable
    }
    return opts as any
  }

  function _string (name: string, options?: GenericOptions): any {
    return createContext({
      ...properties,
      [name]: orNull({
        type: 'string',
        ...extractOptional(options || {})
      }, options?.nullable ?? false)
    }, [...required, ...(options?.optional ? [] : [name])])
  }

  function _number (name: string, options?: GenericOptions): any {
    return createContext({
      ...properties,
      [name]: orNull({
        type: 'number',
        ...extractOptional(options || {})
      }, options?.nullable ?? false)
    }, [...required, ...(options?.optional ? [] : [name])])
  }

  function _integer (name: string, options?: GenericOptions): any {
    return createContext({
      ...properties,
      [name]: orNull({
        type: 'integer',
        ...extractOptional(options || {})
      }, options?.nullable ?? false)
    }, [...required, ...(options?.optional ? [] : [name])])
  }

  function _boolean (name: string, options: GenericOptions): any {
    return createContext({
      ...properties,
      [name]: orNull({
        type: 'boolean',
        ...extractOptional(options || {})
      }, options?.nullable ?? false)
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
      [name]: orNull({
        const: value,
        ...extractOptional(options || {})
      }, options?.nullable ?? false)
    }, [...required, ...(options?.optional ? [] : [name])])
  }

  function _enum (name: string, type: string, values: any[], options: GenericOptions): any {
    return createContext({
      ...properties,
      [name]: orNull({
        type,
        enum: values,
        ...extractOptional(options || {})
      } as JSONSchema7Definition, options?.nullable ?? false)
    }, [...required, ...(options?.optional ? [] : [name])])
  }

  function _array (name: string, type: string, options: any = {}, arrayOptions: GenericOptions = {}): any {
    return createContext({
      ...properties,
      [name]: orNull({
        type: 'array',
        items: {
          type,
          ...(options.toJSONSchema ? options.toJSONSchema() : options)
        },
        ...extractOptional(arrayOptions)
      }, arrayOptions?.nullable ?? false)
    }, [...required, ...(arrayOptions?.optional ? [] : [name])])
  }

  function _object (name: string, options: any, objectOptions: GenericOptions): any {
    return createContext({
      ...properties,
      [name]: orNull({
        type: 'object',
        ...(options.toJSONSchema ? options.toJSONSchema() : options),
        ...extractOptional(objectOptions)
      }, options?.nullable ?? false)
    }, [...required, ...(objectOptions?.optional ? [] : [name])])
  }

  function _omit (name: string): any {
    const p = { ...properties }
    delete p[name]
    return createContext(p, required.filter((r) => r !== name))
  }

  function _pick (name: string): any {
    return createContext({ [name]: properties[name] }, required.filter((r) => r === name))
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
    pick: _pick as any,
    extend: _extend as any,
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
