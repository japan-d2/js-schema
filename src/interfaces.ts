/* eslint-disable no-use-before-define */

import { JSONSchema7 } from 'json-schema'
import { Pure } from './index'

type Format = 'date-time' | 'date' | 'time' |
  'email' | 'idn-email' |
  'hostname' | 'idn-hostname' |
  'ipv4' | 'ipv6' |
  'uri' | 'uri-reference' | 'iri' | 'iri-reference' |
  'uri-template' |
  'json-pointer' | 'relative-json-pointer' |
  'regex'

export type TypeMap = {
  string: string;
  number: number;
  boolean: boolean;
  object: unknown;
  integer: number;
  null: null;
  array: Array<any>;
  const: string | number | boolean | unknown | null | Array<any>;
}

export interface Metadata {
  title?: string;
  description?: string;
}

export interface Generic <T> extends Metadata {
  default?: T;
  examples?: T[];
}

export interface TypeBrand <K extends string> {
  type: K;
}

export interface StringType extends Generic<string> {
  enum?: never;
  minLength?: number;
  maxLength?: number;
  pattern?: string;
  format?: Format;
}
export interface StringTypeWithBrand extends StringType, TypeBrand<'string'> {}

export interface NumberType extends Generic<number> {
  multipleOf?: number;
  minimum?: number;
  exclusiveMinimum?: number;
  maximum?: number;
  exclusiveMaximum?: number;
}
export interface NumberTypeWithBrand extends NumberType, TypeBrand<'number'> {}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface BooleanType extends Generic<boolean> {}
export interface BooleanTypeWithBrand extends BooleanType, TypeBrand<'boolean'> {}
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface NullType extends Generic<null> {}
export interface NullTypeWithBrand extends NullType, TypeBrand<'null'> {}
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface EnumerableTypeMap extends Omit<TypeMap, 'const'> {}
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface EnumType<T extends keyof EnumerableTypeMap> extends Generic<EnumerableTypeMap[T]> {}
export interface EnumTypeWithBrand<T extends keyof EnumerableTypeMap> extends EnumType<T>, TypeBrand<T> {}

export interface ObjectType <T> extends Generic<T> {
  minProperties?: number;
  maxProperties?: number;
  propertyNames?: { pattern: string };
  additionalProperties?: boolean | NumberTypeWithBrand | StringTypeWithBrand | BooleanTypeWithBrand | NullTypeWithBrand | EnumTypeWithBrand<any> | ArrayTypeWithBrand<any>;
}
export interface ObjectTypeWithBrand<T> extends ObjectType<T>, TypeBrand<'object'> {}

export interface ArrayType <T> extends Generic<T[]> {
  minItems?: number;
  maxItems?: number;
  uniqueItems?: boolean;
  items?: Array<NumberTypeWithBrand | StringTypeWithBrand | BooleanTypeWithBrand | NullTypeWithBrand | EnumTypeWithBrand<any> | ArrayTypeWithBrand<any>>;
}
export interface ArrayTypeWithBrand<T> extends ArrayType<T>, TypeBrand<'array'> {}

export type TypeOptionsMap = {
  string: StringType;
  number: NumberType;
  boolean: BooleanType;
  integer: NumberType;
  null: NullType;
}

type PropertyRequired<T> = T & { optional?: false }
type PropertyOptional<T> = T & { optional: true }
type PropertyNonNullable<T> = T & { nullable?: false }
type PropertyNullable<T> = T & { nullable: true }

export interface SchemaIdentity <C = unknown> {
  identical (): SchemaIdentity<C>;
  toJSONSchema (): JSONSchema7;
}

export type SchemaDefinition <C = unknown> = SchemaIdentity<C> & SchemaBuilder<C>

export interface SchemaBuilder <C = unknown> {
  string <K extends string> (name: K, options?: PropertyNonNullable<PropertyRequired<StringType>>): SchemaDefinition<C & { [P in K]: string }>;
  string <K extends string> (name: K, options?: PropertyNonNullable<PropertyOptional<StringType>>): SchemaDefinition<C & { [P in K]?: string }>;
  string <K extends string> (name: K, options?: PropertyNullable<PropertyRequired<StringType>>): SchemaDefinition<C & { [P in K]: string | null }>;
  string <K extends string> (name: K, options?: PropertyNullable<PropertyOptional<StringType>>): SchemaDefinition<C & { [P in K]?: string | null }>;

  number <K extends string> (name: K, options?: PropertyNonNullable<PropertyRequired<NumberType>>): SchemaDefinition<C & { [P in K]: number }>;
  number <K extends string> (name: K, options?: PropertyNonNullable<PropertyOptional<NumberType>>): SchemaDefinition<C & { [P in K]?: number }>;
  number <K extends string> (name: K, options?: PropertyNullable<PropertyRequired<NumberType>>): SchemaDefinition<C & { [P in K]: number | null }>;
  number <K extends string> (name: K, options?: PropertyNullable<PropertyOptional<NumberType>>): SchemaDefinition<C & { [P in K]?: number | null }>;

  integer <K extends string> (name: K, options?: PropertyNonNullable<PropertyRequired<NumberType>>): SchemaDefinition<C & { [P in K]: number }>;
  integer <K extends string> (name: K, options?: PropertyNonNullable<PropertyOptional<NumberType>>): SchemaDefinition<C & { [P in K]?: number }>;
  integer <K extends string> (name: K, options?: PropertyNullable<PropertyRequired<NumberType>>): SchemaDefinition<C & { [P in K]: number | null }>;
  integer <K extends string> (name: K, options?: PropertyNullable<PropertyOptional<NumberType>>): SchemaDefinition<C & { [P in K]?: number | null }>;

  boolean <K extends string> (name: K, options?: PropertyNonNullable<PropertyRequired<BooleanType>>): SchemaDefinition<C & { [P in K]: boolean }>;
  boolean <K extends string> (name: K, options?: PropertyNonNullable<PropertyOptional<BooleanType>>): SchemaDefinition<C & { [P in K]?: boolean }>;
  boolean <K extends string> (name: K, options?: PropertyNullable<PropertyRequired<BooleanType>>): SchemaDefinition<C & { [P in K]: boolean | null }>;
  boolean <K extends string> (name: K, options?: PropertyNullable<PropertyOptional<BooleanType>>): SchemaDefinition<C & { [P in K]?: boolean | null }>;

  null <K extends string> (name: K, options?: PropertyNonNullable<PropertyRequired<NullType>>): SchemaDefinition<C & { [P in K]: null }>;
  null <K extends string> (name: K, options?: PropertyNonNullable<PropertyOptional<NullType>>): SchemaDefinition<C & { [P in K]?: null }>;

  const <K extends string, T extends string | number | boolean> (name: K, value: T, options?: PropertyNonNullable<PropertyRequired<Metadata>>): SchemaDefinition<C & { [P in K]: T }>;
  const <K extends string, T extends string | number | boolean> (name: K, value: T, options?: PropertyNonNullable<PropertyOptional<Metadata>>): SchemaDefinition<C & { [P in K]?: T }>;
  const <K extends string, T extends string | number | boolean> (name: K, value: T, options?: PropertyNullable<PropertyRequired<Metadata>>): SchemaDefinition<C & { [P in K]: T | null }>;
  const <K extends string, T extends string | number | boolean> (name: K, value: T, options?: PropertyNullable<PropertyOptional<Metadata>>): SchemaDefinition<C & { [P in K]?: T | null }>;

  enum <K extends string, T extends keyof EnumerableTypeMap, X extends Array<EnumerableTypeMap[T]>> (name: K, type: T, values: X, options?: PropertyNonNullable<PropertyRequired<EnumType<T>>>): SchemaDefinition<C & { [P in K]: X[0] }>;
  enum <K extends string, T extends keyof EnumerableTypeMap, X extends Array<EnumerableTypeMap[T]>> (name: K, type: T, values: X, options?: PropertyNonNullable<PropertyOptional<EnumType<T>>>): SchemaDefinition<C & { [P in K]?: X[0] }>;
  enum <K extends string, T extends keyof EnumerableTypeMap, X extends Array<EnumerableTypeMap[T]>> (name: K, type: T, values: X, options?: PropertyNullable<PropertyRequired<EnumType<T>>>): SchemaDefinition<C & { [P in K]: X[0] | null }>;
  enum <K extends string, T extends keyof EnumerableTypeMap, X extends Array<EnumerableTypeMap[T]>> (name: K, type: T, values: X, options?: PropertyNullable<PropertyOptional<EnumType<T>>>): SchemaDefinition<C & { [P in K]?: X[0] | null }>;

  array <K extends string> (name: K, type: 'string', options?: StringType, arrayOptions?: PropertyNonNullable<PropertyRequired<ArrayType<string>>>): SchemaDefinition<C & { [P in K]: string[] }>;
  array <K extends string> (name: K, type: 'string', options?: StringType, arrayOptions?: PropertyNonNullable<PropertyOptional<ArrayType<string>>>): SchemaDefinition<C & { [P in K]?: string[] }>;
  array <K extends string> (name: K, type: 'string', options?: StringType, arrayOptions?: PropertyNullable<PropertyRequired<ArrayType<string>>>): SchemaDefinition<C & { [P in K]: string[] | null }>;
  array <K extends string> (name: K, type: 'string', options?: StringType, arrayOptions?: PropertyNullable<PropertyOptional<ArrayType<string>>>): SchemaDefinition<C & { [P in K]?: string[] | null }>;

  array <K extends string> (name: K, type: 'number' | 'integer', options?: NumberType, arrayOptions?: PropertyNonNullable<PropertyRequired<ArrayType<number>>>): SchemaDefinition<C & { [P in K]: number[] }>;
  array <K extends string> (name: K, type: 'number' | 'integer', options?: NumberType, arrayOptions?: PropertyNonNullable<PropertyOptional<ArrayType<number>>>): SchemaDefinition<C & { [P in K]?: number[] }>;
  array <K extends string> (name: K, type: 'number' | 'integer', options?: NumberType, arrayOptions?: PropertyNullable<PropertyRequired<ArrayType<number>>>): SchemaDefinition<C & { [P in K]: number[] | null }>;
  array <K extends string> (name: K, type: 'number' | 'integer', options?: NumberType, arrayOptions?: PropertyNullable<PropertyOptional<ArrayType<number>>>): SchemaDefinition<C & { [P in K]?: number[] | null }>;

  array <K extends string> (name: K, type: 'boolean', options?: BooleanType, arrayOptions?: PropertyNonNullable<PropertyRequired<ArrayType<boolean>>>): SchemaDefinition<C & { [P in K]: boolean[] }>;
  array <K extends string> (name: K, type: 'boolean', options?: BooleanType, arrayOptions?: PropertyNonNullable<PropertyOptional<ArrayType<boolean>>>): SchemaDefinition<C & { [P in K]?: boolean[] }>;
  array <K extends string> (name: K, type: 'boolean', options?: BooleanType, arrayOptions?: PropertyNullable<PropertyRequired<ArrayType<boolean>>>): SchemaDefinition<C & { [P in K]: boolean[] | null }>;
  array <K extends string> (name: K, type: 'boolean', options?: BooleanType, arrayOptions?: PropertyNullable<PropertyOptional<ArrayType<boolean>>>): SchemaDefinition<C & { [P in K]?: boolean[] | null }>;

  array <K extends string> (name: K, type: 'null', options?: NullType, arrayOptions?: PropertyNonNullable<PropertyRequired<ArrayType<null>>>): SchemaDefinition<C & { [P in K]: null[] }>;
  array <K extends string> (name: K, type: 'null', options?: NullType, arrayOptions?: PropertyNonNullable<PropertyOptional<ArrayType<null>>>): SchemaDefinition<C & { [P in K]?: null[] }>;
  array <K extends string> (name: K, type: 'null', options?: NullType, arrayOptions?: PropertyNullable<PropertyRequired<ArrayType<null>>>): SchemaDefinition<C & { [P in K]: null[] | null }>;
  array <K extends string> (name: K, type: 'null', options?: NullType, arrayOptions?: PropertyNullable<PropertyOptional<ArrayType<null>>>): SchemaDefinition<C & { [P in K]?: null[] | null }>;

  array <K extends string, T extends unknown> (name: K, type: 'object', itemDefinition: SchemaIdentity<T>, arrayOptions?: PropertyNonNullable<PropertyRequired<ArrayType<T>>>): SchemaDefinition<C & { [P in K]: Array<Pure<SchemaIdentity<T>>> }>;
  array <K extends string, T extends unknown> (name: K, type: 'object', itemDefinition: SchemaIdentity<T>, arrayOptions?: PropertyNonNullable<PropertyOptional<ArrayType<T>>>): SchemaDefinition<C & { [P in K]?: Array<Pure<SchemaIdentity<T>>> }>;
  array <K extends string, T extends unknown> (name: K, type: 'object', itemDefinition: SchemaIdentity<T>, arrayOptions?: PropertyNullable<PropertyRequired<ArrayType<T>>>): SchemaDefinition<C & { [P in K]: Array<Pure<SchemaIdentity<T>>> | null }>;
  array <K extends string, T extends unknown> (name: K, type: 'object', itemDefinition: SchemaIdentity<T>, arrayOptions?: PropertyNullable<PropertyOptional<ArrayType<T>>>): SchemaDefinition<C & { [P in K]?: Array<Pure<SchemaIdentity<T>>> | null }>;

  object <K extends string, T extends unknown> (name: K, definition: SchemaIdentity<T>, objectOptions?: PropertyNonNullable<PropertyRequired<ObjectType<T>>>): SchemaDefinition<C & { [P in K]: Pure<SchemaIdentity<T>> }>;
  object <K extends string, T extends unknown> (name: K, definition: SchemaIdentity<T>, objectOptions?: PropertyNonNullable<PropertyOptional<ObjectType<T>>>): SchemaDefinition<C & { [P in K]?: Pure<SchemaIdentity<T>> }>;
  object <K extends string, T extends unknown> (name: K, definition: SchemaIdentity<T>, objectOptions?: PropertyNullable<PropertyRequired<ObjectType<T>>>): SchemaDefinition<C & { [P in K]: Pure<SchemaIdentity<T>> | null }>;
  object <K extends string, T extends unknown> (name: K, definition: SchemaIdentity<T>, objectOptions?: PropertyNullable<PropertyOptional<ObjectType<T>>>): SchemaDefinition<C & { [P in K]?: Pure<SchemaIdentity<T>> | null }>;

  omit <K extends keyof C> (...names: K[]): SchemaDefinition<Omit<C, K>>;
  pick <K extends keyof C> (...names: K[]): SchemaDefinition<Pick<C, K>>;

  extend <T extends unknown> (context: SchemaDefinition<T>): SchemaDefinition<C & T>;

  toJSONSchema (): JSONSchema7;
}

export interface Combine {
  oneOf <T extends readonly SchemaDefinition<unknown>[]> (definitions: T): SchemaIdentity<Pure<T[number]>>
}

export type Field<T> = {
  type: string;
  options?: Record<string, unknown>;
  __type?: T & never;
  nullable (): Field<T | null>;
  nonnullable (): Field<PropertyNonNullable<T>>;
}

export type ObjectField<T> = {
  type: string;
  options?: Record<string, unknown>;
  __type?: T & never;
  nullable (): ObjectField<T | null>;
  nonnullable (): ObjectField<PropertyNonNullable<T>>;
  allowAdditionalProperties(): ObjectField<T>;
  denyAdditionalProperties(): ObjectField<T>;
}

export type FieldBuilder = {
  string (options?: StringType): Field<string>;
  number (options?: NumberType): Field<number>;
  integer (options?: NumberType): Field<number>;
  boolean (options?: BooleanType): Field<boolean>;
  null (options?: NullType): Field<null>;
  const <T extends string | number | boolean> (value: T, options?: Metadata): Field<T>;
  enum <T extends keyof EnumerableTypeMap, X extends readonly EnumerableTypeMap[T][]> (type: T, values: X, options?: EnumType<T>): Field<X[number]>;
  array (type: 'string', options?: StringType, arrayOptions?: ArrayType<string>): Field<string[]>;
  array (type: 'number' | 'integer', options?: NumberType, arrayOptions?: ArrayType<number>): Field<number[]>;
  array (type: 'boolean', options?: BooleanType, arrayOptions?: ArrayType<boolean>): Field<boolean[]>;
  array (type: 'null', options?: NullType, arrayOptions?: ArrayType<null>): Field<null[]>;
  array <T, U> (type: 'object', itemDefinition: T, itemDefinitionOptional?: U, arrayOptions?: ArrayType<T>): Field<Array<ObjectSchema<T, U>>>;
  object <T, U> (definition: T, definitionOptional?: U, objectOptions?: ObjectType<T>): ObjectField<ObjectSchema<T, U>>;
}

export type ObjectSchema<T, U> = {
  [P in keyof T]: T[P] extends Field<infer K> ? K : never
} & {
  [P in keyof U]?: U[P] extends Field<infer K> ? K : never
};
