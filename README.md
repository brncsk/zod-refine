# `zod-refine` ![Github CI](https://github.com/brncsk/zod-refine/actions/workflows/release.yml/badge.svg) [![NPM version](https://badge.fury.io/js/zod-refine.svg)](https://badge.fury.io/js/zod-refine)

`zod-refine` is an adapter library that lets you use
[Zod](https://github.com/colinhacks/zod) schemas for validating atom values in
[Recoil Sync](https://recoiljs.org/docs/recoil-sync/introduction/) effects.

Recoil Sync is an add-on library for [Recoil](https://recoiljs.org), Meta's
fairly new-ish state management library for React.

# Why?

Recoil Sync provides its own type-refinement/validator library, called
[Refine](https://recoiljs.org/docs/refine/Introduction), however Zod provides
better TypeScript integration and more features, so there's that.

> ⚠️ **Caveat emptor:** Both Recoil Sync and Refine are released as alpha
> versions, so their API and types are subject to change.

# Installation

```sh
npm i zod-refine
yarn add zod-refine
```

# Usage

`zod-refine`'s sole export is a function named `getRefineCheckerForZodSchema()`.
It takes a single `Zod.Schema`
(a.k.a. [`ZodType`](https://zod.dev/?id=constraining-allowable-inputs))
and returns the associated
[Refine Checker](https://recoiljs.org/docs/refine/api/Checkers).

The following is an introductory example on checking a Recoil
[atom's](https://recoiljs.org/docs/basic-tutorial/atoms) value in a Recoil Sync
[`syncEffect`](https://recoiljs.org/docs/recoil-sync/sync-effect).

**Using Refine:**

```ts
import { atom } from "recoil";
import { syncEffect, refine } from "recoil-sync";

const testAtom = atom<number>({
  key: "test",
  default: 0,
  key: "test",
  effects: [
    syncEffect({
      refine: refine.number(),
    }),
  ],
});
```

**Using `zod-refine`:**

```ts
import { atom } from "recoil";
import { syncEffect } from "recoil-sync";

import { z } from "zod";
import { getRefineCheckerForZodSchema } from "zod-refine";

const testAtom = atom<number>({
  key: "test",
  default: 0,
  effects: [
    syncEffect({
      refine: getRefineCheckerForZodSchema(z.number()),
    }),
  ],
});
```

# Advanced Usage

## Upgrading an atom's type

One can
[upgrade an atom's type](https://recoiljs.org/docs/recoil-sync/sync-effect#upgrade-atom-type)
using Refine's `match()` and `asType()` checkers:

```ts
const myAtom = atom<number>({
  key: "MyAtom",
  default: 0,
  effects: [
    syncEffect({
      refine: match(
        number(),
        asType(string(), (x) => parseInt(x)),
        asType(object({ value: number() }), (x) => x.value)
      ),
    }),
  ],
});
```

This idiom can be adapted to Zod using `z.union()` / `transform()`:

```ts
const myAtom = atom<number>({
  key: "MyAtom",
  default: 0,
  effects: [
    syncEffect({
      refine: getRefineCheckerForZodSchema(
        z.union([
          z.number(),
          z.string().transform((x) => parseInt(x)),
          z.object({ value: z.number() }).transform((x) => x.value),
        ])
      ),
    }),
  ],
});
```

# API Reference

## `getRefineCheckerForZodSchema()`

```ts
export function getRefineCheckerForZodSchema<S extends Schema>(
  schema: S
): Checker<z.infer<S>>;
```

# Known problems

## Error handling

Refine can only handle a single error when reporting validation problems.
When Zod reports multiple issues, `zod-refine` only passes the first one to
Refine.

# License

MIT
