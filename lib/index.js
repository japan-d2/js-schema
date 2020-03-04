"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const JSONSchema = require("jsonschema");
function createContext(properties = {}, required = []) {
    const schema = {
        type: 'object',
        properties,
        required
    };
    function extractOptional(options) {
        const opts = Object.assign({}, options);
        if ('optional' in opts) {
            delete opts.optional;
        }
        return opts;
    }
    function _string(name, options) {
        var _a;
        return createContext(Object.assign(Object.assign({}, properties), { [name]: Object.assign({ type: 'string' }, extractOptional(options || {})) }), [...required, ...(((_a = options) === null || _a === void 0 ? void 0 : _a.optional) ? [] : [name])]);
    }
    function _number(name, options) {
        var _a;
        return createContext(Object.assign(Object.assign({}, properties), { [name]: Object.assign({ type: 'number' }, extractOptional(options || {})) }), [...required, ...(((_a = options) === null || _a === void 0 ? void 0 : _a.optional) ? [] : [name])]);
    }
    function _integer(name, options) {
        var _a;
        return createContext(Object.assign(Object.assign({}, properties), { [name]: Object.assign({ type: 'integer' }, extractOptional(options || {})) }), [...required, ...(((_a = options) === null || _a === void 0 ? void 0 : _a.optional) ? [] : [name])]);
    }
    function _boolean(name, options) {
        var _a;
        return createContext(Object.assign(Object.assign({}, properties), { [name]: Object.assign({ type: 'boolean' }, extractOptional(options || {})) }), [...required, ...(((_a = options) === null || _a === void 0 ? void 0 : _a.optional) ? [] : [name])]);
    }
    function _null(name, options) {
        var _a;
        return createContext(Object.assign(Object.assign({}, properties), { [name]: Object.assign({ type: 'null' }, extractOptional(options || {})) }), [...required, ...(((_a = options) === null || _a === void 0 ? void 0 : _a.optional) ? [] : [name])]);
    }
    function _const(name, value, options) {
        var _a;
        return createContext(Object.assign(Object.assign({}, properties), { [name]: Object.assign({ const: value }, extractOptional(options || {})) }), [...required, ...(((_a = options) === null || _a === void 0 ? void 0 : _a.optional) ? [] : [name])]);
    }
    function _enum(name, type, values, options) {
        var _a;
        return createContext(Object.assign(Object.assign({}, properties), { [name]: (Object.assign({ type, enum: values }, extractOptional(options || {}))) }), [...required, ...(((_a = options) === null || _a === void 0 ? void 0 : _a.optional) ? [] : [name])]);
    }
    function _array(name, type, options = {}, arrayOptions = {}) {
        var _a;
        return createContext(Object.assign(Object.assign({}, properties), { [name]: Object.assign({ type: 'array', items: Object.assign({ type }, (options.toJSONSchema ? options.toJSONSchema() : options)) }, extractOptional(arrayOptions)) }), [...required, ...(((_a = arrayOptions) === null || _a === void 0 ? void 0 : _a.optional) ? [] : [name])]);
    }
    function _object(name, options, objectOptions) {
        var _a;
        return createContext(Object.assign(Object.assign({}, properties), { [name]: Object.assign(Object.assign({ type: 'object' }, (options.toJSONSchema ? options.toJSONSchema() : options)), extractOptional(objectOptions)) }), [...required, ...(((_a = objectOptions) === null || _a === void 0 ? void 0 : _a.optional) ? [] : [name])]);
    }
    function _omit(name) {
        const p = Object.assign({}, properties);
        delete p[name];
        return createContext(properties);
    }
    function _extend(context) {
        const schema = context.toJSONSchema();
        return createContext(Object.assign(Object.assign({}, properties), schema.properties), [...(schema.required || []), ...required]);
    }
    return {
        string: _string,
        number: _number,
        integer: _integer,
        boolean: _boolean,
        null: _null,
        const: _const,
        enum: _enum,
        array: _array,
        object: _object,
        omit: _omit,
        extend: _extend,
        getType: undefined,
        toJSONSchema() {
            return Object.assign({}, schema);
        }
    };
}
function defineSchema() {
    return createContext();
}
exports.defineSchema = defineSchema;
function validate(input, schema, options) {
    const result = JSONSchema.validate(input, schema.toJSONSchema(), Object.assign(Object.assign({}, options), { throwError: false }));
    return result.valid;
}
exports.validate = validate;
function assertValid(input, schema, options) {
    JSONSchema.validate(input, schema.toJSONSchema(), Object.assign(Object.assign({}, options), { throwError: true }));
}
exports.assertValid = assertValid;
