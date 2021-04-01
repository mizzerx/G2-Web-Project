const findIndex = (value, array) => {
  const index = -1;

  array.forEach((each, i) => {
    if (String(value) === String(each)) {
      index = i;
    }
  });

  return index;
};

module.exports = { findIndex };
