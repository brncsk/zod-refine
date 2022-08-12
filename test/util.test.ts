import { Path } from '../src/recoil-path';
import { recoilPathToZodPath, zodPathToRecoilPath } from '../src/util';

test('zodPathToRecoilPath', () => {
  expect(zodPathToRecoilPath([])).toEqual(new Path());

  expect(zodPathToRecoilPath(['a', 'b', 'c'])).toEqual(
    new Path().extend('a').extend('b').extend('c')
  );

  expect(zodPathToRecoilPath([1, 2, 3])).toEqual(
    new Path().extend('1').extend('2').extend('3')
  );
});

test('recoilPathToZodPath', () => {
  expect(recoilPathToZodPath(new Path())).toEqual(['<root>']);

  expect(
    recoilPathToZodPath(new Path().extend('a').extend('b').extend('c'))
  ).toEqual(['<root>', 'a', 'b', 'c']);
});

export {};
