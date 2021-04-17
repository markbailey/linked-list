export default (startNode, fn) => {
  let currentNode = startNode;
  let index = 0;
    
    while (currentNode) {
      if (fn(currentNode, index)) return currentNode;

      const nextNode = currentNode.next;
      currentNode = (nextNode && nextNode.id !== startNode.id)
        ? nextNode
        : null;
      
      index++;
    } 

    return null;
}