import {CallsiteInfo} from '../../frontend/globals';
import {mergeCallsites} from './controller';

test('zeroCallsitesMerged', () => {
  const callsites: CallsiteInfo[] = [
    {id: 1, parentId: -1, name: 'A', depth: 0, totalSize: 10},
    {id: 2, parentId: -1, name: 'B', depth: 0, totalSize: 8},
    {id: 3, parentId: 1, name: 'A3', depth: 1, totalSize: 4},
    {id: 4, parentId: 2, name: 'B4', depth: 1, totalSize: 4},
  ];

  const mergedCallsites = mergeCallsites(callsites, 5);

  // Small callsites are not next ot each other, nothing should be changed.
  expect(mergedCallsites).toEqual(callsites);
});

test('zeroCallsitesMerged2', () => {
  const callsites: CallsiteInfo[] = [
    {id: 1, parentId: -1, name: 'A', depth: 0, totalSize: 10},
    {id: 2, parentId: -1, name: 'B', depth: 0, totalSize: 8},
    {id: 3, parentId: 1, name: 'A3', depth: 1, totalSize: 6},
    {id: 4, parentId: 1, name: 'A4', depth: 1, totalSize: 4},
    {id: 5, parentId: 2, name: 'B5', depth: 1, totalSize: 8},
  ];

  const mergedCallsites = mergeCallsites(callsites, 5);

  // Small callsites are not next ot each other, nothing should be changed.
  expect(mergedCallsites).toEqual(callsites);
});

test('twoCallsitesMerged', () => {
  const callsites: CallsiteInfo[] = [
    {id: 1, parentId: -1, name: 'A', depth: 0, totalSize: 10},
    {id: 2, parentId: 1, name: 'A2', depth: 1, totalSize: 5},
    {id: 3, parentId: 1, name: 'A3', depth: 1, totalSize: 5},
  ];

  const mergedCallsites = mergeCallsites(callsites, 6);

  expect(mergedCallsites).toEqual([
    {id: 1, parentId: -1, name: 'A', depth: 0, totalSize: 10},
    {id: 2, parentId: 1, name: 'A2', depth: 1, totalSize: 10},
  ]);
});

test('manyCallsitesMerged', () => {
  const callsites: CallsiteInfo[] = [
    {id: 1, parentId: -1, name: 'A', depth: 0, totalSize: 10},
    {id: 2, parentId: 1, name: 'A2', depth: 1, totalSize: 5},
    {id: 3, parentId: 1, name: 'A3', depth: 1, totalSize: 3},
    {id: 4, parentId: 1, name: 'A4', depth: 1, totalSize: 1},
    {id: 5, parentId: 1, name: 'A5', depth: 1, totalSize: 1},
    {id: 6, parentId: 3, name: 'A36', depth: 2, totalSize: 1},
    {id: 7, parentId: 4, name: 'A47', depth: 2, totalSize: 1},
    {id: 8, parentId: 5, name: 'A58', depth: 2, totalSize: 1},
  ];

  const expectedMergedCallsites: CallsiteInfo[] = [
    {id: 1, parentId: -1, name: 'A', depth: 0, totalSize: 10},
    {id: 2, parentId: 1, name: 'A2', depth: 1, totalSize: 5},
    {id: 3, parentId: 1, name: 'A3', depth: 1, totalSize: 5},
    {id: 6, parentId: 3, name: 'A36', depth: 2, totalSize: 3},
  ];

  const mergedCallsites = mergeCallsites(callsites, 4);

  // In this case, callsites A3, A4 and A5 should be merged since they are
  // smaller then 4 and are on same depth with same parent. Callsites A36, A47
  // and A58 should also be merged since their parents are merged.
  expect(mergedCallsites).toEqual(expectedMergedCallsites);
});

test('manyCallsitesMergedWithoutChildren', () => {
  const callsites: CallsiteInfo[] = [
    {id: 1, parentId: -1, name: 'A', depth: 0, totalSize: 5},
    {id: 2, parentId: -1, name: 'B', depth: 0, totalSize: 5},
    {id: 3, parentId: 1, name: 'A3', depth: 1, totalSize: 3},
    {id: 4, parentId: 1, name: 'A4', depth: 1, totalSize: 1},
    {id: 5, parentId: 1, name: 'A5', depth: 1, totalSize: 1},
    {id: 6, parentId: 2, name: 'B6', depth: 1, totalSize: 5},
    {id: 7, parentId: 4, name: 'A47', depth: 2, totalSize: 1},
    {id: 8, parentId: 6, name: 'B68', depth: 2, totalSize: 1},
  ];

  const expectedMergedCallsites: CallsiteInfo[] = [
    {id: 1, parentId: -1, name: 'A', depth: 0, totalSize: 5},
    {id: 2, parentId: -1, name: 'B', depth: 0, totalSize: 5},
    {id: 3, parentId: 1, name: 'A3', depth: 1, totalSize: 5},
    {id: 6, parentId: 2, name: 'B6', depth: 1, totalSize: 5},
    {id: 7, parentId: 3, name: 'A47', depth: 2, totalSize: 1},
    {id: 8, parentId: 6, name: 'B68', depth: 2, totalSize: 1},
  ];

  const mergedCallsites = mergeCallsites(callsites, 4);

  // In this case, callsites A3, A4 and A5 should be merged since they are
  // smaller then 4 and are on same depth with same parent. Callsite A47
  // should not be merged with B68 althought they are small because they don't
  // have sam parent. A47 should now have parent A3 because A4 is merged.
  expect(mergedCallsites).toEqual(expectedMergedCallsites);
});

test('smallCallsitesNotNextToEachOtherInArray', () => {
  const callsites: CallsiteInfo[] = [
    {id: 1, parentId: -1, name: 'A', depth: 0, totalSize: 20},
    {id: 2, parentId: 1, name: 'A2', depth: 1, totalSize: 8},
    {id: 3, parentId: 1, name: 'A3', depth: 1, totalSize: 1},
    {id: 4, parentId: 1, name: 'A4', depth: 1, totalSize: 8},
    {id: 5, parentId: 1, name: 'A5', depth: 1, totalSize: 3},
  ];

  const expectedMergedCallsites: CallsiteInfo[] = [
    {id: 1, parentId: -1, name: 'A', depth: 0, totalSize: 20},
    {id: 2, parentId: 1, name: 'A2', depth: 1, totalSize: 8},
    {id: 3, parentId: 1, name: 'A3', depth: 1, totalSize: 4},
    {id: 4, parentId: 1, name: 'A4', depth: 1, totalSize: 8},
  ];

  const mergedCallsites = mergeCallsites(callsites, 4);

  // In this case, callsites A3, A4 and A5 should be merged since they are
  // smaller then 4 and are on same depth with same parent. Callsite A47
  // should not be merged with B68 althought they are small because they don't
  // have sam parent. A47 should now have parent A3 because A4 is merged.
  expect(mergedCallsites).toEqual(expectedMergedCallsites);
});

test('smallCallsitesNotMerged', () => {
  const callsites: CallsiteInfo[] = [
    {id: 1, parentId: -1, name: 'A', depth: 0, totalSize: 10},
    {id: 2, parentId: 1, name: 'A2', depth: 1, totalSize: 2},
    {id: 3, parentId: 1, name: 'A3', depth: 1, totalSize: 2},
  ];

  const mergedCallsites = mergeCallsites(callsites, 1);

  expect(mergedCallsites).toEqual(callsites);
});

test('mergingRootCallsites', () => {
  const callsites: CallsiteInfo[] = [
    {id: 1, parentId: -1, name: 'A', depth: 0, totalSize: 10},
    {id: 2, parentId: -1, name: 'B', depth: 0, totalSize: 2},
  ];

  const mergedCallsites = mergeCallsites(callsites, 20);

  expect(mergedCallsites).toEqual([
    {id: 1, parentId: -1, name: 'A', depth: 0, totalSize: 12},
  ]);
});

test('largerFlamegraph', () => {
  const data: CallsiteInfo[] = [
    {id: 1, parentId: -1, name: 'A', depth: 0, totalSize: 60},
    {id: 2, parentId: -1, name: 'B', depth: 0, totalSize: 40},
    {id: 3, parentId: 1, name: 'A3', depth: 1, totalSize: 25},
    {id: 4, parentId: 1, name: 'A4', depth: 1, totalSize: 15},
    {id: 5, parentId: 1, name: 'A5', depth: 1, totalSize: 10},
    {id: 6, parentId: 1, name: 'A6', depth: 1, totalSize: 10},
    {id: 7, parentId: 2, name: 'B7', depth: 1, totalSize: 30},
    {id: 8, parentId: 2, name: 'B8', depth: 1, totalSize: 10},
    {id: 9, parentId: 3, name: 'A39', depth: 2, totalSize: 20},
    {id: 10, parentId: 4, name: 'A410', depth: 2, totalSize: 10},
    {id: 11, parentId: 4, name: 'A411', depth: 2, totalSize: 3},
    {id: 12, parentId: 4, name: 'A412', depth: 2, totalSize: 2},
    {id: 13, parentId: 5, name: 'A513', depth: 2, totalSize: 5},
    {id: 14, parentId: 5, name: 'A514', depth: 2, totalSize: 5},
    {id: 15, parentId: 7, name: 'A715', depth: 2, totalSize: 10},
    {id: 16, parentId: 7, name: 'A716', depth: 2, totalSize: 5},
    {id: 17, parentId: 7, name: 'A717', depth: 2, totalSize: 5},
    {id: 18, parentId: 7, name: 'A718', depth: 2, totalSize: 5},
    {id: 19, parentId: 9, name: 'A919', depth: 3, totalSize: 10},
    {id: 20, parentId: 17, name: 'A1720', depth: 3, totalSize: 2},
  ];

  const expectedData: CallsiteInfo[] = [
    {id: 1, parentId: -1, name: 'A', depth: 0, totalSize: 60},
    {id: 2, parentId: -1, name: 'B', depth: 0, totalSize: 40},
    {id: 3, parentId: 1, name: 'A3', depth: 1, totalSize: 25},
    {id: 4, parentId: 1, name: 'A4', depth: 1, totalSize: 35},
    {id: 7, parentId: 2, name: 'B7', depth: 1, totalSize: 30},
    {id: 8, parentId: 2, name: 'B8', depth: 1, totalSize: 10},
    {id: 9, parentId: 3, name: 'A39', depth: 2, totalSize: 20},
    {id: 10, parentId: 4, name: 'A410', depth: 2, totalSize: 25},
    {id: 15, parentId: 7, name: 'A715', depth: 2, totalSize: 25},
    {id: 19, parentId: 9, name: 'A919', depth: 3, totalSize: 10},
    {id: 20, parentId: 15, name: 'A1720', depth: 3, totalSize: 2},
  ];

  // In this case, on depth 1, callsites A4, A5 and A6 should be merged and
  // initiate merging of their children A410, A411, A412, A513, A514. On depth2,
  // callsites A715, A716, A717 and A718 should be merged.
  const actualData = mergeCallsites(data, 16);

  expect(actualData).toEqual(expectedData);
});
