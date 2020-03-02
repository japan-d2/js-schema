import { ValidationContext } from './interfaces';
import * as JSONSchema from 'jsonschema';
export declare function defineSchema(): ValidationContext<{}>;
export declare type Dirty<T> = {
    [P in keyof T]?: unknown;
};
export declare function validate<T>(input: Dirty<T>, schema: ValidationContext<T>, options?: JSONSchema.Options): input is T;
export declare function assertValid<T>(input: Dirty<T>, schema: ValidationContext<T>, options?: JSONSchema.Options): asserts input is T;
