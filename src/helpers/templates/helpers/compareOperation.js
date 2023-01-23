const compare = (operation, left, right) => {
  switch (operation) {
    case '>=':
      return left >= right;
    case '>':
      return left > right;
    case '===':
      return left === right;
    case '==':
      return left == right; // eslint-disable-line eqeqeq
    case '<':
      return left < right;
    case '<=':
      return left <= right;
    default: 
      return true;
  }
}

export default compare;