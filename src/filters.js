var filters = {};
filters['ALL'] = function(data) {
  return data;
};

filters['CHECKED'] = function(data) {
  return data.filter(function(value) {
    return value.isActive;
  }, this);
};

filters['UNCHECKED'] = function(data) {
  return data.filter(function(value) {
    return !value.isActive;
  }, this);
};

export { filters };
