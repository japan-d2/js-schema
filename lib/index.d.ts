import { ValidationContext } from './interfaces';
import * as JSONSchema from 'jsonschema';
export declare function defineSchema(): ValidationContext<{}>;
export declare type DirtyProps<T> = {
    [P in keyof T]?: unknown;
};
export declare type Dirty<T extends ValidationContext<any>> = DirtyProps<ReturnType<T['getType']>>;
export declare function validate<T>(input: DirtyProps<T>, schema: ValidationContext<T>, options?: JSONSchema.Options): input is T;
export declare function assertValid<T>(input: DirtyProps<T>, schema: ValidationContext<T>, options?: JSONSchema.Options): asserts input is T;
