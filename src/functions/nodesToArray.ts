function nodesToArray<T>(startNode: ListNode<T>): T[] {
  const array = [];
  let currentNode = startNode;

  while (currentNode) {
    array.push(currentNode.value);
    currentNode =
      currentNode.next && currentNode.next.id !== startNode.id
        ? currentNode.next
        : null;
  }

  return array;
}

export default nodesToArray;
