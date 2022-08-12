import r, { CheckFailure, CheckSuccess } from '@recoiljs/refine';
import { z } from 'zod';
import { getRefineCheckerForZodSchema } from '../src';

function pick<T>(obj: T, keys: (keyof T)[]): Partial<T> {
  return Object.fromEntries(
    Object.entries(obj).filter(([key]) => keys.includes(key as keyof T))
  ) as Partial<T>;
}

describe('getRefineCheckerForZodSchema', () => {
  test('should return a function that can check basic types', () => {
    const checker = getRefineCheckerForZodSchema(z.string());

    expect(checker('')).toMatchObject({ type: 'success' });
    expect(checker(0)).toMatchObject({ type: 'failure' });
  });

  const zodChecker = getRefineCheckerForZodSchema(z.string());
  const refineChecker = r.string();

  test("should return a function that matches refine's success behavior", () => {
    expect(zodChecker('')).toMatchObject(refineChecker(''));
  });

  test("should return a function that matches refine's failure behavior", () => {
    // "message" differs between refine and zod so it's not tested here
    expect(zodChecker(0)).toMatchObject(
      pick(refineChecker(0) as CheckFailure, ['type', 'path'])
    );
  });

  test('should return a function that can check simple objects', () => {
    const zodObjectChecker = getRefineCheckerForZodSchema(
      z.object({
        stringKey: z.string(),
        numberKey: z.number(),
      })
    );
    const refineObjectChecker = r.object({
      stringKey: r.string(),
      numberKey: r.number(),
    });

    expect(zodObjectChecker({ stringKey: '', numberKey: 0 })).toMatchObject(
      refineObjectChecker({ stringKey: '', numberKey: 0 })
    );

    expect(zodObjectChecker({})).toMatchObject(
      pick(refineObjectChecker({}) as CheckFailure, ['type'])
    );
  });

  test('should return a function that can check complex objects', () => {
    const zodObjectChecker = getRefineCheckerForZodSchema(
      z.object({
        objectKey: z.object({
          stringKey: z.string(),
          numberKey: z.number(),
        }),
      })
    );
    const refineObjectChecker = r.object({
      objectKey: r.object({
        stringKey: r.string(),
        numberKey: r.number(),
      }),
    });

    expect(
      zodObjectChecker({ objectKey: { stringKey: '', numberKey: 0 } })
    ).toMatchObject(
      pick(
        refineObjectChecker({
          objectKey: { stringKey: '', numberKey: 0 },
        }) as CheckSuccess<unknown>,
        ['type', 'value']
      )
    );

    expect(zodObjectChecker({ objectKey: {} })).toMatchObject(
      pick(refineObjectChecker({ objectKey: {} }) as CheckFailure, ['type'])
    );
  });

  test('should support upgrading types', () => {
    const zodUpgradeChecker = getRefineCheckerForZodSchema(
      z.union([
        z.number(),
        z.string().transform(x => parseInt(x)),
        z.object({ value: z.number() }).transform(x => x.value),
      ])
    );

    const refineUpgradeChecker = r.match(
      r.number(),
      r.asType(r.string(), x => parseInt(x)),
      r.asType(r.object({ value: r.number() }), x => x.value)
    );

    expect(zodUpgradeChecker(123)).toMatchObject(refineUpgradeChecker(123));
    expect(zodUpgradeChecker('123')).toMatchObject(refineUpgradeChecker('123'));
    expect(zodUpgradeChecker({ value: 123 })).toMatchObject(
      refineUpgradeChecker({ value: 123 })
    );
  });
});

export {};
