import { validate, assertValid, defineSchema, Pure } from '../src/index'

it('validate', () => {
  const schema = defineSchema().string('name')

  expect(validate({ name: 'test' }, schema)).toBe(true)
  expect(validate({ name: 1 }, schema)).toBe(false)
})

it('assertValid', () => {
  const schema = defineSchema().string('name')

  expect(() => assertValid({ name: 'test' }, schema)).not.toThrow()
  expect(() => assertValid({ name: 1 }, schema)).toThrow(/string/)
})

describe('defineSchema', () => {
  it('toJSONSchema', () => {
    const schema = defineSchema()
      .string('stringRequired')
      .string('stringOptional', { optional: true })
      .number('numberRequired')
      .number('numberOptional', { optional: true })
      .integer('integerRequired')
      .integer('integerOptional', { optional: true })
      .boolean('booleanRequired')
      .boolean('booleanOptional', { optional: true })
      .null('nullRequired')
      .null('nullOptional', { optional: true })
      .enum('enumStringRequired', 'string', ['a', 'b', 'c'])
      .enum('enumStringOptional', 'string', ['a', 'b', 'c'], { optional: true })
      .enum('enumNumberRequired', 'number', [1, 2, 3])
      .enum('enumNumberOptional', 'number', [1, 2, 3], { optional: true })
      .enum('enumIntegerRequired', 'number', [1, 2, 3])
      .enum('enumIntegerOptional', 'number', [1, 2, 3], { optional: true })
      .array('arrayStringRequired', 'string')
      .array('arrayStringOptional', 'string', {}, { optional: true })
      .array('arrayNumberRequired', 'number')
      .array('arrayNumberOptional', 'number', {}, { optional: true })
      .array('arrayIntegerRequired', 'integer')
      .array('arrayIntegerOptional', 'integer', {}, { optional: true })
      .array('arrayBooleanRequired', 'boolean')
      .array('arrayBooleanOptional', 'boolean', {}, { optional: true })
      .array('arrayNullRequired', 'null')
      .array('arrayNullOptional', 'null', {}, { optional: true })
      .array('arrayObjectRequired', 'object', defineSchema().string('a'))
      .array('arrayObjectOptional', 'object', defineSchema().string('a'), { optional: true })
      .object('objectRequired', defineSchema().string('a'))
      .object('objectOptional', defineSchema().string('a'), { optional: true })

    expect(schema.toJSONSchema()).toStrictEqual({
      type: 'object',
      properties: {
        stringOptional: {
          type: 'string'
        },
        stringRequired: {
          type: 'string'
        },
        numberOptional: {
          type: 'number'
        },
        numberRequired: {
          type: 'number'
        },
        integerOptional: {
          type: 'integer'
        },
        integerRequired: {
          type: 'integer'
        },
        booleanOptional: {
          type: 'boolean'
        },
        booleanRequired: {
          type: 'boolean'
        },
        nullOptional: {
          type: 'null'
        },
        nullRequired: {
          type: 'null'
        },
        enumStringOptional: {
          type: 'string',
          enum: ['a', 'b', 'c']
        },
        enumStringRequired: {
          type: 'string',
          enum: ['a', 'b', 'c']
        },
        enumNumberOptional: {
          type: 'number',
          enum: [1, 2, 3]
        },
        enumNumberRequired: {
          type: 'number',
          enum: [1, 2, 3]
        },
        enumIntegerOptional: {
          enum: [
            1,
            2,
            3
          ],
          type: 'number'
        },
        enumIntegerRequired: {
          enum: [
            1,
            2,
            3
          ],
          type: 'number'
        },
        arrayStringOptional: {
          type: 'array',
          items: {
            type: 'string'
          }
        },
        arrayStringRequired: {
          type: 'array',
          items: {
            type: 'string'
          }
        },
        arrayBooleanOptional: {
          items: {
            type: 'boolean'
          },
          type: 'array'
        },
        arrayBooleanRequired: {
          items: {
            type: 'boolean'
          },
          type: 'array'
        },
        arrayIntegerOptional: {
          items: {
            type: 'integer'
          },
          type: 'array'
        },
        arrayIntegerRequired: {
          items: {
            type: 'integer'
          },
          type: 'array'
        },
        arrayNullOptional: {
          items: {
            type: 'null'
          },
          type: 'array'
        },
        arrayNullRequired: {
          items: {
            type: 'null'
          },
          type: 'array'
        },
        arrayNumberOptional: {
          items: {
            type: 'number'
          },
          type: 'array'
        },
        arrayNumberRequired: {
          items: {
            type: 'number'
          },
          type: 'array'
        },
        arrayObjectOptional: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              a: {
                type: 'string'
              }
            },
            required: ['a']
          }
        },
        arrayObjectRequired: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              a: {
                type: 'string'
              }
            },
            required: ['a']
          }
        },
        objectOptional: {
          type: 'object',
          properties: {
            a: {
              type: 'string'
            }
          },
          required: ['a']
        },
        objectRequired: {
          type: 'object',
          properties: {
            a: {
              type: 'string'
            }
          },
          required: ['a']
        }
      },
      required: [
        'stringRequired',
        'numberRequired',
        'integerRequired',
        'booleanRequired',
        'nullRequired',
        'enumStringRequired',
        'enumNumberRequired',
        'enumIntegerRequired',
        'arrayStringRequired',
        'arrayNumberRequired',
        'arrayIntegerRequired',
        'arrayBooleanRequired',
        'arrayNullRequired',
        'arrayObjectRequired',
        'objectRequired'
      ]
    })

    type SchemaType = Pure<typeof schema>
    const testSchema: SchemaType = {
      stringRequired: 'a',
      numberRequired: 1,
      integerRequired: 1,
      booleanRequired: true,
      nullRequired: null,
      enumStringRequired: 'a',
      enumNumberRequired: 1,
      enumIntegerRequired: 1,
      arrayStringRequired: ['a'],
      arrayNumberRequired: [1],
      arrayIntegerRequired: [1],
      arrayBooleanRequired: [true],
      arrayNullRequired: [null],
      arrayObjectRequired: [{ a: 'a' }],
      objectRequired: { a: 'a' }
    }

    // only type tesing
    expect(testSchema).toStrictEqual(testSchema)
  })

  it('extend', () => {
    const partSchemaA = defineSchema().string('name')
    const partSchemaB = defineSchema().string('email', { format: 'email' })
    const extendedSchema = partSchemaB.extend(partSchemaA)

    expect(extendedSchema.toJSONSchema()).toStrictEqual({
      type: 'object',
      properties: {
        email: {
          type: 'string',
          format: 'email'
        },
        name: {
          type: 'string'
        }
      },
      required: ['name', 'email']
    })
  })
})
