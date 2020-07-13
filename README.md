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

# Usage

## Schema definition

Construct JSON Schema and TypeScript types simultaneously in the method chain for `defineSchema()`.
The following methods are provided for schema definition:

- `string (name, options?)`
- `number (name, options?)`
- `integer (name, options?)`
- `boolean (name, options?)`
- `null (name, options?):`
- `const (name, value, options?)`
- `enum (name, type, values, options?)`
- `array (name, type, itemOptions?, arrayOptions?)`
- `object (name, options, objectOptions?)`

For example:

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

## Extend other schema

`schema.extend (otherSchema) -> schema`

```typescript
import { defineSchema } from '@japan-d2/schema'

const withAdmin = defineSchema()
  .const('admin', true)

const exampleUserSchemaWithAdmin = exampleUserSchema
  .extend(withAdmin)
```

## Omit specific key

`schema.omit (key) -> schema`

```typescript
import { defineSchema } from '@japan-d2/schema'

const exampleUserSchemaWithoutAge = exampleUserSchema
  .omit('age')
```

## Pick specific key

`schema.pick (key) -> schema`

```typescript
import { defineSchema } from '@japan-d2/schema'

const exampleUserSchemaWithoutAge = defineSchema()
  .extend(exampleUserSchema.pick('name'))
  .extend(exampleUserSchema.pick('role'))
```

## Runtime conversion to JSON Schema

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

## Validation

Assume the following "dirty" data for validation.

```typescript
const dirtyUser = {
  name: 'roa',
  age: Math.random() < 0.5 ? 13 : '13'
}

dirtyUser.age // number | string
```

### Validation with [User-Defined Type Guard](https://www.typescriptlang.org/docs/handbook/advanced-types.html#user-defined-type-guards)

`validate (instance, schema) -> boolean`

Returns `true` or `false` using `validate` function in [jsonschema](https://www.npmjs.com/package/jsonschema) package with options `{ throwError: false }`.
When used inside an if conditional expression, type guard is enabled.

```typescript
import { validate } from '@japan-d2/schema'

if (validate(dirtyUser, exampleUserSchema)) {
  dirtyUser.age // number
}
dirtyUser.age // number | string
```

### Validation with [Assertion Function](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-3-7.html#assertion-functions)

`assertValid (instance, schema) -> void`

Throws `ValidationError` if instance are invalid, and does nothing if valid. Internally it uses `validate` function in [jsonschema](https://www.npmjs.com/package/jsonschema) package with options `{ throwError: true }`.
This function is an Assertion Function that uses the new features of TS3.7 and this fixes the type in a scope where no error occurred.

```typescript
import { validate } from '@japan-d2/schema'

// throw validation error if age is not a number
assertValid(dirtyUser, exampleUserSchema)

dirtyUser.age // number
```

## Type utilities

### Pure

Provides a purified schema type. Same as guarded by `validate` or` assertValid`.

```typescript
import { Pure } from '@japan-d2/schema'
type UserType = Pure<typeof exampleUserSchema>

const user: UserType = {
  name: 'roa',
  age: 13,
}
```

### Dirty

Provides an explicitly tainted schema type. It can be used to indicate an external value as input value for `validate` or` assertValid`.

```typescript
import { Dirty, assertValid } from '@japan-d2/schema'
type DirtyUserType = Dirty<typeof exampleUserSchema>

app.post('/users', (req) => {
  const user: DirtyUserType = req.body

  user.name // unknown
  user.age // unknown

  assertValid(user)

  user.name // string
  user.age // number
})
```

# License

MIT
