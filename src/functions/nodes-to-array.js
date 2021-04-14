export default function(node) {
  const array = [];
  let currentNode = node;
  
  while (currentNode) {
    array.push(currentNode.value);
    currentNode = 
      (currentNode.next && currentNode.next.id !== node.id)
        ? currentNode.next
        : null;
  }

  return array;
}