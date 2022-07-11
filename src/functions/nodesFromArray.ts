import { ListType } from 'common';
import Node from 'models/Node';

function nodesFromArray<T>(array: T[], listType: ListType) {
  let lastNode = null;
  const node = [...array]
    .reverse()
    .reduce((accumulator: ListNode<T> | null, current) => {
      if (!accumulator) {
        lastNode = new Node<T>({ value: current, previous: null, next: null });
        return lastNode;
      }

      const newNode = new Node({
        value: current,
        previous: null,
        next: accumulator,
      });

      if (listType !== ListType.Singly) accumulator.previous = newNode;
      return newNode;
    }, null);

  if (node && lastNode && listType === ListType.Circular) {
    lastNode.next = node;
    node.previous = lastNode;
  }

  return node;
}

export default nodesFromArray;
