const LinkedList = require('../models/linked-list');

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
    const length = linkedList.length;
    linkedList.push(i);
    expect(linkedList.length).not.toBe(0);
    expect(linkedList.length).not.toBe(length);
    expect(linkedList.length).toBe(length + 1);
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
  const values = [1, 2, 3, 4, 5 ,6];
  const linkedList = new LinkedList({ values });
  values.reverse(); // Shouldn't be required, but for some reason the values array was being reversed;

  linkedList.splice(0, 0, 0);
  console.log(linkedList.toArray());
  expect(linkedList.length).toBe(values.length + 1);
  expect(linkedList.head.value).toBe(0);
});