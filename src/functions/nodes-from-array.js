import ListNode from '../node';
import TYPES from '../types';

export default function(array, type) {
  let lastNode = null;
  const node = 
    array.reverse()
      .reduce((accumulator, current) => {
        if (!accumulator) {
          lastNode = new ListNode({ value: current });
          return lastNode;
        }
        
        const newNode = new ListNode({ value: current, next: accumulator });
        if (type !== TYPES.SINGLY)
          accumulator.previous = newNode;

        return newNode;      
      }, null);

  if (node && lastNode && type === TYPES.CIRCULAR) {
    lastNode.next = node;
    node.previous = lastNode;
  }

  return node;
}