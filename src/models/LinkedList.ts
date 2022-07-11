import { ListType } from 'common';
import findNode from 'functions/findNode';
import nodesFromArray from 'functions/nodesFromArray';
import nodesToArray from 'functions/nodesToArray';
import Node from './Node';

class LinkedList<T> {
  type: ListType;
  head: ListNode<T> | null;

  constructor(values: T[], type: ListType = ListType.Singly) {
    this.type = type;
    this.head = nodesFromArray<T>(values, type);
  }

  static ListType = ListType;

  // Return the number of node sin the list
  get length() {
    let count = 0;
    let currentNode = this.head;

    while (currentNode !== null) {
      const nextNode = currentNode.next;

      currentNode =
        nextNode !== null && nextNode.id !== this.head.id ? nextNode : null;
      count++;
    }

    return count;
  }

  // Return the tail node of the list
  get tail() {
    const isCircular = this.type === ListType.Circular;
    const tailNode =
      this.head && isCircular
        ? this.head.previous
        : this.find((_, i) => i === this.length - 1);

    return tailNode;
  }

  // Return all the nodes as an array
  toArray() {
    return nodesToArray(this.head);
  }

  // Return the node that matches the condition
  find(compare: CompareFunction<T>) {
    return findNode(this.head, compare);
  }

  // Return the index of the node that matches the condition
  findIndex(compare: CompareFunction<T>) {
    const node = this.find(compare);
    return node ? this.indexOf(node.value) : -1;
  }

  // Return the index of the node that matches the value
  indexOf(value: T) {
    let currentNode = this.head;
    let index = -1;

    while (currentNode) {
      index++;
      if (currentNode.value === value) return index;
      currentNode =
        currentNode.next && currentNode.next.id !== this.head.id
          ? currentNode.next
          : null;
    }

    return index;
  }

  // Create a new node form value and add it to the end of the list and return the new length of the list
  push(value: T) {
    if (typeof value !== 'undefined') {
      const tailNode = this.tail || this.head;
      const prevNode = this.type !== ListType.Singly ? tailNode : null;

      if (tailNode)
        tailNode.next = new Node<T>({
          value,
          previous: prevNode,
          next: tailNode.next,
        });
      else this.head = new Node({ value, previous: null, next: null });
    }

    return this.length;
  }

  // Remove the last node in the list and return the new length of the list
  pop() {
    let currentNode = this.head;
    let prevNode: ListNode<T> | null = null;

    while (currentNode) {
      prevNode = currentNode.next ? currentNode : prevNode;
      currentNode =
        currentNode.next && currentNode.next.id !== this.head.id
          ? currentNode.next
          : null;
    }

    if (prevNode)
      prevNode.next = this.type === ListType.Circular ? this.head : null;
    else this.head = null;

    return this.length;
  }

  // Return an array of values from the list between start and end indexes
  slice(start: number, end: number = this.length) {
    const length = this.length;
    const slicedValues: T[] = [];

    const startIndex =
      start >= 0 ? (start <= length - 1 ? start : length - 1) : 0;
    const endIndex = end <= length - 1 ? (end >= 0 ? end : 0) : length;

    let count = endIndex - startIndex;
    let currentNode = this.find((_, i) => i === startIndex);

    while (currentNode && count > 0) {
      if (currentNode) slicedValues.push(currentNode.value);
      currentNode =
        currentNode.next && currentNode.next.id !== this.head.id
          ? currentNode.next
          : null;
      count--;
    }

    return slicedValues;
  }

  // Add one or more values to the list at the index, optionally replacing the existing value at the index and return the deleted values
  splice(start = 0, deleteCount = 0, ...items: T[]) {
    const nfaType =
      this.type === ListType.Circular ? ListType.Doubley : this.type;
    const lastIndex = this.length - 1 || 0;
    let startIndex = start >= 0 ? start : 0;

    if (startIndex > lastIndex) startIndex = lastIndex;

    const deletedItems =
      deleteCount > 0 ? this.slice(startIndex, startIndex + deleteCount) : [];

    const prevNode =
      startIndex > 0
        ? nodesFromArray(this.slice(0, startIndex), nfaType)
        : null;

    const nextNode = nodesFromArray<T>(
      this.slice(startIndex + deleteCount),
      nfaType
    );

    const newNode = nodesFromArray<T>(items, nfaType);

    const stitchNodes = (...nodes: ListNode<T>[]) => {
      let prevNode = null;

      nodes.forEach((node) => {
        const lastNode = findNode<T>(node, (n) => !n.next);

        if (prevNode && node) prevNode.next = node;
        prevNode = lastNode || prevNode;
      });

      if (this.type !== ListType.Singly) {
        prevNode = null;
        [...nodes].reverse().forEach((node) => {
          const lastNode = findNode<T>(prevNode, (n) => !n.next);

          if (lastNode) node.previous = lastNode;
          prevNode = node;
        });
      }
    };

    stitchNodes(prevNode, newNode, nextNode);
    this.head = prevNode || newNode || nextNode;
    if (this.type === ListType.Circular) {
      const tailNode = findNode(this.head, (node) => !node.next);
      if (tailNode) {
        this.head.previous = tailNode;
        tailNode.next = this.head;
      }
    }

    return deletedItems;
  }
}

export default LinkedList;
