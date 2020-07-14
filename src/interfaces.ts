import { Pure } from './index'
import { JSONSchema7 as JSONSchema } from 'json-schema'

type AnyObject = Record<string, unknown>

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
  object: AnyObject;
  integer: number;
  null: null;
  array: Array<any>;
  const: string | number | boolean | AnyObject | null | Array<any>;
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

type Required<T> = T & { optional?: false }
type Optional<T> = T & { optional: true }
type NonNullable<T> = T & { nullable?: false }
type Nullable<T> = T & { nullable: true }

export interface SchemaDefinition <C = AnyObject> {
  string <K extends string> (name: K, options?: NonNullable<Required<StringType>>): SchemaDefinition<C & { [P in K]: string }>;
  string <K extends string> (name: K, options?: NonNullable<Optional<StringType>>): SchemaDefinition<C & { [P in K]?: string }>;
  string <K extends string> (name: K, options?: Nullable<Required<StringType>>): SchemaDefinition<C & { [P in K]: string | null }>;
  string <K extends string> (name: K, options?: Nullable<Optional<StringType>>): SchemaDefinition<C & { [P in K]?: string | null }>;

  number <K extends string> (name: K, options?: NonNullable<Required<NumberType>>): SchemaDefinition<C & { [P in K]: number }>;
  number <K extends string> (name: K, options?: NonNullable<Optional<NumberType>>): SchemaDefinition<C & { [P in K]?: number }>;
  number <K extends string> (name: K, options?: Nullable<Required<NumberType>>): SchemaDefinition<C & { [P in K]: number | null }>;
  number <K extends string> (name: K, options?: Nullable<Optional<NumberType>>): SchemaDefinition<C & { [P in K]?: number | null }>;

  integer <K extends string> (name: K, options?: NonNullable<Required<NumberType>>): SchemaDefinition<C & { [P in K]: number }>;
  integer <K extends string> (name: K, options?: NonNullable<Optional<NumberType>>): SchemaDefinition<C & { [P in K]?: number }>;
  integer <K extends string> (name: K, options?: Nullable<Required<NumberType>>): SchemaDefinition<C & { [P in K]: number | null }>;
  integer <K extends string> (name: K, options?: Nullable<Optional<NumberType>>): SchemaDefinition<C & { [P in K]?: number | null }>;

  boolean <K extends string> (name: K, options?: NonNullable<Required<BooleanType>>): SchemaDefinition<C & { [P in K]: boolean }>;
  boolean <K extends string> (name: K, options?: NonNullable<Optional<BooleanType>>): SchemaDefinition<C & { [P in K]?: boolean }>;
  boolean <K extends string> (name: K, options?: Nullable<Required<BooleanType>>): SchemaDefinition<C & { [P in K]: boolean | null }>;
  boolean <K extends string> (name: K, options?: Nullable<Optional<BooleanType>>): SchemaDefinition<C & { [P in K]?: boolean | null }>;

  null <K extends string> (name: K, options?: NonNullable<Required<NullType>>): SchemaDefinition<C & { [P in K]: null }>;
  null <K extends string> (name: K, options?: NonNullable<Optional<NullType>>): SchemaDefinition<C & { [P in K]?: null }>;

  const <K extends string, T extends string | number | boolean> (name: K, value: T, options?: NonNullable<Required<Metadata>>): SchemaDefinition<C & { [P in K]: T }>;
  const <K extends string, T extends string | number | boolean> (name: K, value: T, options?: NonNullable<Optional<Metadata>>): SchemaDefinition<C & { [P in K]?: T }>;
  const <K extends string, T extends string | number | boolean> (name: K, value: T, options?: Nullable<Required<Metadata>>): SchemaDefinition<C & { [P in K]: T | null }>;
  const <K extends string, T extends string | number | boolean> (name: K, value: T, options?: Nullable<Optional<Metadata>>): SchemaDefinition<C & { [P in K]?: T | null }>;

  enum <K extends string, T extends keyof EnumerableTypeMap, X extends Array<EnumerableTypeMap[T]>> (name: K, type: T, values: X, options?: NonNullable<Required<EnumType<T>>>): SchemaDefinition<C & { [P in K]: X[0] }>;
  enum <K extends string, T extends keyof EnumerableTypeMap, X extends Array<EnumerableTypeMap[T]>> (name: K, type: T, values: X, options?: NonNullable<Optional<EnumType<T>>>): SchemaDefinition<C & { [P in K]?: X[0] }>;
  enum <K extends string, T extends keyof EnumerableTypeMap, X extends Array<EnumerableTypeMap[T]>> (name: K, type: T, values: X, options?: Nullable<Required<EnumType<T>>>): SchemaDefinition<C & { [P in K]: X[0] | null }>;
  enum <K extends string, T extends keyof EnumerableTypeMap, X extends Array<EnumerableTypeMap[T]>> (name: K, type: T, values: X, options?: Nullable<Optional<EnumType<T>>>): SchemaDefinition<C & { [P in K]?: X[0] | null }>;

  array <K extends string> (name: K, type: 'string', options?: StringType, arrayOptions?: NonNullable<Required<ArrayType<string>>>): SchemaDefinition<C & { [P in K]: string[] }>;
  array <K extends string> (name: K, type: 'string', options?: StringType, arrayOptions?: NonNullable<Optional<ArrayType<string>>>): SchemaDefinition<C & { [P in K]?: string[] }>;
  array <K extends string> (name: K, type: 'string', options?: StringType, arrayOptions?: Nullable<Required<ArrayType<string>>>): SchemaDefinition<C & { [P in K]: string[] | null }>;
  array <K extends string> (name: K, type: 'string', options?: StringType, arrayOptions?: Nullable<Optional<ArrayType<string>>>): SchemaDefinition<C & { [P in K]?: string[] | null }>;

  array <K extends string> (name: K, type: 'number' | 'integer', options?: NumberType, arrayOptions?: NonNullable<Required<ArrayType<number>>>): SchemaDefinition<C & { [P in K]: number[] }>;
  array <K extends string> (name: K, type: 'number' | 'integer', options?: NumberType, arrayOptions?: NonNullable<Optional<ArrayType<number>>>): SchemaDefinition<C & { [P in K]?: number[] }>;
  array <K extends string> (name: K, type: 'number' | 'integer', options?: NumberType, arrayOptions?: Nullable<Required<ArrayType<number>>>): SchemaDefinition<C & { [P in K]: number[] | null }>;
  array <K extends string> (name: K, type: 'number' | 'integer', options?: NumberType, arrayOptions?: Nullable<Optional<ArrayType<number>>>): SchemaDefinition<C & { [P in K]?: number[] | null }>;

  array <K extends string> (name: K, type: 'boolean', options?: BooleanType, arrayOptions?: NonNullable<Required<ArrayType<boolean>>>): SchemaDefinition<C & { [P in K]: boolean[] }>;
  array <K extends string> (name: K, type: 'boolean', options?: BooleanType, arrayOptions?: NonNullable<Optional<ArrayType<boolean>>>): SchemaDefinition<C & { [P in K]?: boolean[] }>;
  array <K extends string> (name: K, type: 'boolean', options?: BooleanType, arrayOptions?: Nullable<Required<ArrayType<boolean>>>): SchemaDefinition<C & { [P in K]: boolean[] | null }>;
  array <K extends string> (name: K, type: 'boolean', options?: BooleanType, arrayOptions?: Nullable<Optional<ArrayType<boolean>>>): SchemaDefinition<C & { [P in K]?: boolean[] | null }>;

  array <K extends string> (name: K, type: 'null', options?: NullType, arrayOptions?: NonNullable<Required<ArrayType<null>>>): SchemaDefinition<C & { [P in K]: null[] }>;
  array <K extends string> (name: K, type: 'null', options?: NullType, arrayOptions?: NonNullable<Optional<ArrayType<null>>>): SchemaDefinition<C & { [P in K]?: null[] }>;
  array <K extends string> (name: K, type: 'null', options?: NullType, arrayOptions?: Nullable<Required<ArrayType<null>>>): SchemaDefinition<C & { [P in K]: null[] | null }>;
  array <K extends string> (name: K, type: 'null', options?: NullType, arrayOptions?: Nullable<Optional<ArrayType<null>>>): SchemaDefinition<C & { [P in K]?: null[] | null }>;

  array <K extends string, T extends AnyObject> (name: K, type: 'object', itemOptions: SchemaDefinition<T>, arrayOptions?: NonNullable<Required<ArrayType<T>>>): SchemaDefinition<C & { [P in K]: Array<Pure<SchemaDefinition<T>>> }>;
  array <K extends string, T extends AnyObject> (name: K, type: 'object', itemOptions: SchemaDefinition<T>, arrayOptions?: NonNullable<Optional<ArrayType<T>>>): SchemaDefinition<C & { [P in K]?: Array<Pure<SchemaDefinition<T>>> }>;
  array <K extends string, T extends AnyObject> (name: K, type: 'object', itemOptions: SchemaDefinition<T>, arrayOptions?: Nullable<Required<ArrayType<T>>>): SchemaDefinition<C & { [P in K]: Array<Pure<SchemaDefinition<T>>> | null }>;
  array <K extends string, T extends AnyObject> (name: K, type: 'object', itemOptions: SchemaDefinition<T>, arrayOptions?: Nullable<Optional<ArrayType<T>>>): SchemaDefinition<C & { [P in K]?: Array<Pure<SchemaDefinition<T>>> | null }>;

  object <K extends string, T extends AnyObject> (name: K, options: SchemaDefinition<T>, objectOptions?: NonNullable<Required<ObjectType<T>>>): SchemaDefinition<C & { [P in K]: Pure<SchemaDefinition<T>> }>;
  object <K extends string, T extends AnyObject> (name: K, options: SchemaDefinition<T>, objectOptions?: NonNullable<Optional<ObjectType<T>>>): SchemaDefinition<C & { [P in K]?: Pure<SchemaDefinition<T>> }>;
  object <K extends string, T extends AnyObject> (name: K, options: SchemaDefinition<T>, objectOptions?: Nullable<Required<ObjectType<T>>>): SchemaDefinition<C & { [P in K]: Pure<SchemaDefinition<T>> | null }>;
  object <K extends string, T extends AnyObject> (name: K, options: SchemaDefinition<T>, objectOptions?: Nullable<Optional<ObjectType<T>>>): SchemaDefinition<C & { [P in K]?: Pure<SchemaDefinition<T>> | null }>;

  omit <K extends keyof C> (...names: K[]): SchemaDefinition<Omit<C, K>>;
  pick <K extends keyof C> (...names: K[]): SchemaDefinition<Pick<C, K>>;

  extend <T extends AnyObject> (context: SchemaDefinition<T>): SchemaDefinition<C & T>;

  toJSONSchema (): JSONSchema;
}

/**
 * @deprecated use SchemaDefinition instead
 */
export type ValidationContext<C = AnyObject> = SchemaDefinition<C>
