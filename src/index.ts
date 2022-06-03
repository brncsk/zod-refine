import { ZodError } from 'zod';
import type { infer as Infer, Schema } from 'zod';
import type { CheckResult, Checker } from 'refine';

import { Path } from './recoil-path';
import { recoilPathToZodPath, zodPathToRecoilPath } from './util';

/**
 * Returns a Refine checker for a given Zod schema.
 * @param schema Zod schema to use for validation.
 * @returns Refine checker for the given schema.
 */
export function getRefineCheckerForZodSchema<S extends Schema>(
  schema: S
): Checker<Infer<S>> {
  return function ZodRefineChecker(
    value: unknown,
    path
  ): CheckResult<Infer<S>> {
    try {
      return {
        type: 'success',
        value: schema.parse(value, { path: path && recoilPathToZodPath(path) }),
        warnings: [],
      };
    } catch (e) {
      if (e instanceof ZodError) {
        // Recoil can only handle a single error
        const [error] = e.errors;
        return {
          type: 'failure',
          message: error.message,
          path: zodPathToRecoilPath(error.path),
        };
      }

      return {
        type: 'failure',
        message: String(e),
        path: path ?? new Path(),
      };
    }
  };
}
