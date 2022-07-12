import LinkedList from '../models/LinkedList';

const randomNumber = (min = 0, max = 10) =>
  Math.floor(Math.random() * (max - min) + min);

const newValuesArray = (reverse = false, unique = false) => {
  const count = randomNumber(1);
  const randomValues = [...new Array(count)].map((_, i) => randomNumber(i));
  const valuesToReturn = unique
    ? randomValues.filter((value, index, self) => self.indexOf(value) === index)
    : randomValues;

  return reverse ? valuesToReturn.reverse() : valuesToReturn;
};

test('Verifying list length', () => {
  const values = newValuesArray();
  const linkedList = new LinkedList(values);
  expect(linkedList.length).toBe(values.length);
});

test('Verifying list tail', () => {
  const values = newValuesArray();
  const linkedList = new LinkedList(values);

  const tailNode = linkedList.tail;
  if (values.length === 0) return expect(tailNode).toBeNull();

  expect(tailNode).not.toBeNull();
  expect(tailNode.value).toBe(values[values.length - 1]);
});

test('Verifying findIndex method', () => {
  const values = newValuesArray(false, true);
  const linkedList = new LinkedList(values);

  for (let i = 0; i < values.length; i++) {
    const index = linkedList.findIndex((node) => node.value === values[i]);
    expect(index).toBe(i);
  }
});

test('Verifying indexOf method', () => {
  const values = newValuesArray(false, true);
  const linkedList = new LinkedList(values);

  for (let i = 0; i < values.length; i++) {
    const index = linkedList.indexOf(values[i]);
    expect(index).toBe(i);
  }
});

test('Verifying push method', () => {
  const linkedList = new LinkedList<number>([]);

  const count = randomNumber();
  for (let i = 0; i < count; i++) {
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
  const values = newValuesArray();
  const linkedList = new LinkedList(values);

  linkedList.pop();
  let i = linkedList.length;
  while (linkedList.length > 0) {
    expect(linkedList.length).toBe(i);
    expect(linkedList.tail.value).toBe(values[i - 1]);
    linkedList.pop();
    i--;
  }
});

test('Verifying slice method', () => {
  const values = newValuesArray();
  const linkedList = new LinkedList(values);

  const start = randomNumber(0, values.length - 1);
  const end = randomNumber(start, values.length - 1);
  const count = end - start;

  const slicedValues = linkedList.slice(start, end);
  expect(slicedValues.length).toBe(count);

  for (let i = 0; i < count - 1; i++) {
    expect(slicedValues[i]).toBe(values[start + i]);
  }
});

test('Verifying splice method', () => {
  const values = newValuesArray();
  const linkedList = new LinkedList(values);

  const startIndex = randomNumber(0, values.length - 1);
  const valuesToAdd = newValuesArray();
  const deleteCount = randomNumber(0, values.length - startIndex);

  const newLength = values.length - deleteCount + valuesToAdd.length;
  const deletedItems = linkedList.splice(
    startIndex,
    deleteCount,
    ...valuesToAdd
  );

  const newArray = [...values];
  const testDeletedItems = newArray.splice(
    startIndex,
    deleteCount,
    ...valuesToAdd
  );

  expect(linkedList.length).toBe(newLength);
  expect(deletedItems.length).toBe(deleteCount);
  expect(JSON.stringify(deletedItems)).toBe(JSON.stringify(testDeletedItems));
  expect(JSON.stringify(linkedList.toArray())).toBe(JSON.stringify(newArray));
});
