import { Path } from '@recoiljs/refine';

export function zodPathToRecoilPath(elements: (string | number)[]): Path {
  return elements.reduce(
    (parent, element) => parent.extend(element.toString()),
    new Path()
  );
}

export function recoilPathToZodPath(path: Path): string[] {
  return path.parent
    ? recoilPathToZodPath(path.parent).concat(path.field)
    : [path.field];
}
