function updateTodosInLocalStorage(data) {
  localStorage['todosData'] = JSON.stringify(data);
};

function getTodosFromLocalStorage() {
  var todosData;
  
  if (localStorage.todosData === undefined) {
    todosData = [];
  } else {
    todosData = JSON.parse(localStorage['todosData']);
  }

  return todosData;
};

export { updateTodosInLocalStorage, getTodosFromLocalStorage };
