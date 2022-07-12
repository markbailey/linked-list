function findNode<T>(
  startNode: ListNode<T>,
  compare: CompareFunction<T>
): ListNode<T> | null {
  let currentNode = startNode;
  let index = 0;

  while (currentNode) {
    if (compare(currentNode, index)) return currentNode;
    const nextNode = currentNode.next;

    currentNode = nextNode && nextNode.id !== startNode.id ? nextNode : null;
    index++;
  }

  return null;
}

export default findNode;
