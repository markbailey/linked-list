const { nodesFromArray, nodesToArray } = require('./functions');
const ListNode = require('./node');
const TYPES = require('./types');

class LinkedList {
  constructor({ type, values } = {}) {
    this.type = type || TYPES.SINGLY;
    this.head = nodesFromArray((values || []), this.type);
  }

  static types = TYPES;

  get length() {
    let count = 0;
    let currentNode = this.head;
    
    while (currentNode) {
      const nextNode = currentNode.next;
      currentNode = (nextNode && nextNode.id !== this.head.id)
        ? nextNode
        : null;
        
      count++;
    }

    return count;
  }

  get tail() {
    const isCircular = (this.type === TYPES.CIRCULAR);
    const tailNode = (this.head && isCircular)
      ? this.head.previous
      : this.find((_, i) => i === this.length -1);

    return tailNode;
  }

  toArray() {
    return nodesToArray(this.head);
  }

  find(fn) {
    let currentNode = this.head;
    let index = 0;
    
    while (currentNode) {
      if (fn(currentNode, index)) return currentNode;

      const nextNode = currentNode.next;
      currentNode = (nextNode && nextNode.id !== this.head.id)
        ? nextNode
        : null;
      
      index++;
    } 

    return null;
  }

  indexOf(value) {
    let currentNode = this.head;
    let index = -1;
    
    while (currentNode) {
      index++;
      if (currentNode.value === value) return index;
      currentNode = (currentNode.next && currentNode.next.id !== this.head.id)
        ? currentNode.next
        : null;
    } 

    return index;
  }

  push(value) {
    if (typeof value !== 'undefined') {
      const tailNode = this.tail || this.head;
      const prevNode = (this.type !== TYPES.SINGLY)
        ? tailNode 
        : null;

      if (tailNode) 
        tailNode.next = new ListNode({
          value,
          previous: prevNode,
          next: tailNode.next
        });
      else 
        this.head = new ListNode({ value });
    }

    return this.length;
  }

  pop() {
    let currentNode = this.head;
    let prevNode = null;

    while (currentNode) {
      prevNode = currentNode.next
        ? currentNode
        : prevNode;

      currentNode = (currentNode.next && currentNode.next.id !== this.head.id)
        ? currentNode.next
        : null;
    }

    if (prevNode) 
      prevNode.next = (this.type === TYPES.CIRCULAR) 
        ? this.head
        : null;
    else this.head = null;

    return this.length;
  }

  slice(start, end) {
    const length = this.length;
    const slicedValues = [];

    const startIndex = (start >= 0) 
      ? ((start <= length -1)
          ? start
          : length - 1) 
      : 0;

    const endIndex = (end <= length -1)
      ? ((end >= 0)
          ? end
          : 0)
      : length; 
    
    let count = endIndex - startIndex;
    let currentNode = this.find((_, i ) => i === startIndex);

    while (currentNode && count > 0) {
        if (currentNode) slicedValues.push(currentNode.value);
        currentNode = (currentNode.next && currentNode.next.id !== this.head.id)
          ? currentNode.next
          : null;
        count--;
    }

    return slicedValues;
  }

  splice(start = 0, deleteCount = 0, ...items) {
    const isSingly = this.type === TYPES.SINGLY;
    const deletedValues = [];
    let currentNode = this.head;

    const lastIndex = (this.length - 1) || 0;
    let startIndex = (start >= 0) ? start : 0;
    if (startIndex > lastIndex) startIndex = lastIndex;

    let prevNode = null;
    let nextNode = null;
    let position = 0;

    while (currentNode) {
      if (position < startIndex) {
        prevNode = currentNode.next
          ? currentNode
          : prevNode;
      } else if (deleteCount > 0 && deletedValues.length < deleteCount) {
        deletedValues.push(currentNode.value);
        nextNode = null;
      } else if (!nextNode) nextNode = currentNode;
  
      currentNode = (currentNode.next && currentNode.next.id !== this.head.id)
        ? currentNode.next
        : null;
      position++;
    }

    items.forEach((value) => {
      const previous = !isSingly ? prevNode : null;
      const node = new ListNode({ value, previous });
      if (prevNode) prevNode.next = node;
      prevNode = node;
    });

    if (prevNode) prevNode.next = nextNode;
    if (!this.head) this.head = prevNode || nextNode;
    return deletedValues;
  }
}

module.exports = LinkedList;