import { SchemaDefinition } from './interfaces';
import * as JSONSchema from 'jsonschema';
export declare type DirtyProps<T> = {
    [P in keyof T]?: unknown;
};
export declare type Dirty<T extends SchemaDefinition<any>> = DirtyProps<ReturnType<T['getType']>>;
export declare type Pure<T extends SchemaDefinition<any>> = ReturnType<T['getType']>;
declare type Flatten<T> = {
    [K in keyof T]: T[K];
};
export declare function defineSchema(): SchemaDefinition<{}>;
export declare function validate<T>(input: DirtyProps<T>, schema: SchemaDefinition<T>, options?: JSONSchema.Options): input is Flatten<T>;
export declare function assertValid<T>(input: DirtyProps<T>, schema: SchemaDefinition<T>, options?: JSONSchema.Options): asserts input is Flatten<T>;
export {};
