export class Path {
  constructor(public parent?: Path, public field: string = '<root>') {}

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
