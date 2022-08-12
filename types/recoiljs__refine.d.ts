// eslint-disable-next-line @typescript-eslint/no-unused-vars
import * as refine from '@recoiljs/refine';

declare module '@recoiljs/refine' {
  export interface Path {
    parent?: Path;
    field: string;

    extend(field: string): Path;
    toString(): string;
  }
}
