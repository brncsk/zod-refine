/**
 * A port of Refine's internal `Path` class.
 * The original is taken from:
 * https://github.com/facebookexperimental/Recoil/blob/8852c1a422ccb1dcca9653b55f0e8b454a4216ea/packages/refine/Refine_Checkers.js
 */
export class Path {
  constructor(public parent?: Path, public field: string = '<root>') {
    if (!this.parent) {
      // @ts-expect-error Set null to match original behavior
      this.parent = null;
    }
  }

  // Method to extend path by a field while traversing a container
  extend(field: string): Path {
    return new Path(this, field);
  }

  toString(): string {
    const pieces = [];
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    let current: Path | undefined = this;

    while (current !== undefined) {
      pieces.push(current.field);
      current = current.parent;
    }

    return pieces.reverse().join('.');
  }
}
