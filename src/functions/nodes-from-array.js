import ListNode from '../node';
import TYPES from '../types';

export default function(array, listType) {
  let lastNode = null;
  const node = 
    [...array].reverse()
      .reduce((accumulator, current) => {
        if (!accumulator) {
          lastNode = new ListNode({ value: current });
          return lastNode;
        }
        
        const newNode = new ListNode({ value: current, next: accumulator });
        if (listType !== TYPES.SINGLY)
          accumulator.previous = newNode;

        return newNode;      
      }, null);

  if (node && lastNode && listType === TYPES.CIRCULAR) {
    lastNode.next = node;
    node.previous = lastNode;
  }

  return node;
}