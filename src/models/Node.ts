import randomString from '../functions/randomString';

class Node<T> implements ListNode<T> {
  readonly id: string;
  readonly value: T;
  readonly previous: ListNode<T> | null;
  readonly next: ListNode<T> | null;

  constructor({ value, previous, next }: ListNodeProps<T>) {
    this.id = randomString();

    this.value = value;
    this.previous = previous || null;
    this.next = next || null;
  }
}

export default Node;
