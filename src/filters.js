var filters = {};
filters['ALL'] = function(data) {
  return data;
};

filters['CHECKED'] = function(data) {
  var temp = [];
  for (var i = 0; i < data.length; i++) {
    if (data[i].isActive) {
      temp.push(data[i]);
    }
  }
  return temp;
};

filters['UNCHECKED'] = function(data) {
  var temp = [];
  for (var i = 0; i < data.length; i++) {
    if (!data[i].isActive) {
      temp.push(data[i]);
    }
  }
  return temp;
};

export { filters};
