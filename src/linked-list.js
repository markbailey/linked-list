const { findNode, nodesFromArray, nodesToArray } = require('./functions');
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
    return findNode(this.head, fn);
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
    const nfaType = (this.type === TYPES.CIRCULAR) 
      ? TYPES.DOUBLEY
      : this.type;
      
    const lastIndex = (this.length - 1) || 0;
    let startIndex = (start >= 0) ? start : 0;
    if (startIndex > lastIndex) startIndex = lastIndex;

    let prevNode = startIndex > 0 ? nodesFromArray(this.slice(0, startIndex), nfaType) : null;
    const nextNode = nodesFromArray(this.slice(startIndex + deleteCount), nfaType);
    let newNode = nodesFromArray(items, nfaType);

    const lastNewNode = items.length > 1
      ? findNode(newNode, (_, i) => i === items.length -1)
      : null;

    if (lastNewNode) lastNewNode.next = nextNode;
    else if (newNode) newNode.next = nextNode;

    const lastPrevNode = prevNode && prevNode.next
      ? findNode(prevNode, (node) => !node.next || (nextNode && node.next.id === nextNode.id))
      : null;

    if (lastPrevNode) lastPrevNode.next = newNode || nextNode;
    else if (prevNode) prevNode.next = newNode || nextNode;
    // else prevNode = newNode || nextNode;

    if (this.type !== TYPES.SINGLY) {
      if (nextNode) nextNode.previous = lastNewNode || newNode || lastPrevNode || prevNode;
      if (newNode) newNode.previous = lastPrevNode || prevNode;
    }
    
    if (this.type === TYPES.CIRCULAR) {
      const lastNode = nextNode 
        ? findNode(nextNode, (node) => !node.next || (prevNode && node.next.id === prevNode.id))
        : null;
      
      if (prevNode) prevNode.previous = lastNode || nextNode || lastNewNode || newNode;
      if (lastNode) lastNode.next = prevNode;
      else if (nextNode) nextNode.next = prevNode;
      else if (lastNewNode) lastNewNode.next = prevNode;
      else if (newNode) newNode.next = prevNode;
    }

    this.head = prevNode || newNode || nextNode;
    return deleteCount > 0
      ? this.slice(startIndex, startIndex + deleteCount)
      : [];
  }
}

module.exports = LinkedList;