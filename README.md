# schema

A library designed to implement both TypeScript Interface and json-schema.

# install

```bash
npm install @japan-d2/schema
```

or

```bash
yarn add @japan-d2/schema
```

# usage

## schema definition

```typescript
import { defineSchema } from '@japan-d2/schema'

const exampleUserSchema = defineSchema()
  .string('name', {
    maxLength: 32,
    minLength: 1
  })
  .integer('age', {
    minimum: 0
  })
```

## runtime conversion to JSON Schema

call instance method `toJSONSchema()` of schema.

```typescript
const jsonSchema = exampleUserSchema.toJSONSchema()
console.log(jsonSchema)
```

The return value is a standard JSON Schema object (supports Draft 7).
```typescript
{
  type: 'object',
  properties: {
    name: { type: 'string', maxLength: 32, minLength: 1 },
    age: { type: 'integer', minimum: 0 }
  },
  required: [ 'name', 'age' ]
}
```

## validation

Assume the following "dirty" data for validation.

```typescript
const dirtyUser = {
  name: 'roa',
  age: Math.random() < 0.5 ? 24 : '24'
}

dirtyUser.age // number | string
```

### validation with [User-Defined Type Guard](https://www.typescriptlang.org/docs/handbook/advanced-types.html#user-defined-type-guards)

Returns true / false using [jsonschema](https://www.npmjs.com/package/jsonschema)'s `validate` function with `{ throwError: false }`.
When used inside an if conditional expression, type guard is enabled.

```typescript
import { validate } from '@japan-d2/schema'

if (validate(dirtyUser, exampleUserSchema)) {
  dirtyUser.age // number
}
dirtyUser.age // number | string
```

### validation with [Assertion Function](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-3-7.html#assertion-functions)

```typescript
import { validate } from '@japan-d2/schema'

// throw validation error if age is not a number
assertValid(dirtyUser, exampleUserSchema)

dirtyUser.age // number
```

# example

TODO

# license

MIT
