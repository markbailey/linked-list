declare interface ListNodeProps<T> {
  value: T;
  next: ListNode<T> | null;
  previous: ListNode<T> | null;
}

declare interface ListNode<T> extends ListNodeProps<T> {
  id: string;
}

declare type CompareFunction<T> = (node: ListNode<T>, index: number) => boolean;
