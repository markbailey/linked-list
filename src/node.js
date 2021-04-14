class Node {
  constructor({ value, previous, next }) {
    this.id = `${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`;
    this.value = value;
    this.previous = previous || null;
    this.next = next || null;
  }
}

module.exports = Node;