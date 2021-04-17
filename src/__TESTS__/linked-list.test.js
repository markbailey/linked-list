import LinkedList from '../linked-list';
import TYPES from '../types';

test('Verifying list length', () => {
  const count = Math.ceil(Math.random() * 10);
  const values = [...new Array(count)].map((_,i) => i);
  const linkedList = new LinkedList({ values: [...values].reverse() });
  const length = linkedList.length;

  expect(length).toBe(count);
});

test('Verifying list tail', () => {
  const count = Math.ceil(Math.random() * 10);
  const values = [...new Array(count)].map((_,i) => i);
  const linkedList = new LinkedList({
    type: LinkedList.types.CIRCULAR,
    values: [...values].reverse()
  });

  const tailNode = linkedList.tail;
  if (count === 0) return expect(tailNode).toBeNull();
  expect(tailNode).not.toBeNull();
  expect(tailNode.value).toBe(values[0]);
});

test('Verifying findIndex method', () => {
  const values = [1, 2, 3, 4, 5, 6];
  const linkedList = new LinkedList({ values });
  values.reverse(); // Shouldn't be required, but for some reason the values array was being reversed;

  for (let i = 0; i < 6; i++) {
    const index = linkedList.findIndex((node) => node.value === values[i]);
    expect(index).not.toBe(-1);
    expect(index).toBe(i);
  }
});

test('Verifying indexOf method', () => {
  const values = [1, 2, 3, 4, 5, 6];
  const linkedList = new LinkedList({
    type: LinkedList.types.DOUBLEY,
    values
  });

  for (let i = 0; i < 6; i++) {
    const index = linkedList.indexOf(i +1);
    expect(index).not.toBe(-1);
    expect(index).toBe(i);
  }
});

test('Verifying push method', () => {
  const linkedList = new LinkedList();

  for (let i = 0; i < 6; i++) {
    const oldLength = linkedList.length;
    linkedList.push(i);
    const newLength = linkedList.length;

    expect(newLength).not.toBe(0);
    expect(newLength).not.toBe(oldLength);
    expect(newLength).toBe(oldLength + 1);
    expect(linkedList.indexOf(i)).toBe(i);
  }
});

test('Verifying pop method', () => {
  const values = [1, 2, 3, 4, 5 ,6];
  const linkedList = new LinkedList({ values });
  values.reverse(); // Shouldn't be required, but for some reason the values array was being reversed;

  linkedList.pop();
  let i = linkedList.length;
  while (linkedList.length > 0) {
    expect(linkedList.length).toBe(i);
    expect(linkedList.tail.value).toBe(values[i -1]);
    linkedList.pop();
    i--;
  }
});

test('Verifying slice method', () => {
  const values = [1, 2, 3, 4, 5 ,6];
  const linkedList = new LinkedList({ values });
  values.reverse(); // Shouldn't be required, but for some reason the values array was being reversed;

  const start = 1;
  const end = 5;
  const count = end - start;
  const slicedValues = linkedList.slice(start, end);
  expect(slicedValues.length).toBe(count);

  for (let i = 0; i < count -1; i++) {
    expect(slicedValues[i]).toBe(values[start + i]);
  }
});

test('Verifying splice method', () => {
  const type = TYPES.CIRCULAR;
  const values = [1, 2, 3, 4, 5 ,6];
  const linkedList = new LinkedList({ type, values });
  values.reverse(); // Shouldn't be required, but for some reason the values array was being reversed;

  const startIndex = 3;
  const valuesToAdd = [0]
  const deleteCount = 1;
  const newLength = (values.length - deleteCount) + valuesToAdd.length;
  const deletedItems = linkedList.splice(startIndex, deleteCount, ...valuesToAdd);

  expect(linkedList.length).toBe(newLength);
  expect(deletedItems.length).toBe(deleteCount);
  for (let i = 0; i < valuesToAdd.length; i++) {
    expect(linkedList.indexOf(valuesToAdd[i])).toBe(startIndex + i);
  }
});