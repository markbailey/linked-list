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

  findIndex(fn) {
    const node = this.find(fn);
    return node
      ? this.indexOf(node.value)
      : -1;
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

    const deletedItems = deleteCount > 0
      ? this.slice(startIndex, startIndex + deleteCount)
      : [];

    const prevNode = startIndex > 0 ? nodesFromArray(this.slice(0, startIndex), nfaType) : null;
    const nextNode = nodesFromArray(this.slice((startIndex + deleteCount)), nfaType);
    const newNode = nodesFromArray(items, nfaType);

    const stitchNodes = (...nodes) => {
      let prevNode = null;
      nodes.forEach((node) => {
        const lastNode = findNode(node, (n) => !n.next);
        if (prevNode && node) prevNode.next = node;
        prevNode = lastNode || prevNode;
      });

      if (this.type !== TYPES.SINGLY) {
        prevNode = null;
        [...nodes].reverse().forEach((node, i) => {
          const lastNode = findNode(prevNode, (n) => !n.next);
          if (lastNode) node.previous = lastNode;
          prevNode = node;
        });
      }
    };

    stitchNodes(prevNode, newNode, nextNode);
    this.head = prevNode || newNode || nextNode;
    if (this.type === TYPES.CIRCULAR) {
      const tailNode = findNode(this.head, (node) => !node.next);
      if (tailNode) {
        this.head.previous = tailNode;
        tailNode.next = this.head;
      }
    }

    return deletedItems;
  }
}

module.exports = LinkedList;