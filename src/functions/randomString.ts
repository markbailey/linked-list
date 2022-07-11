const randomString = (length: number = 8) =>
  (Math.random() + 1).toString(36).substring(length);

export default randomString;
