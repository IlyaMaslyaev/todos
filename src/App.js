import React, { Component } from 'react';
import './App.css';
import { filters } from './filters';
import { buttons } from './buttons';
import { updateTodosInLocalStorage, getTodosFromLocalStorage } from './todosLocalStorageWorker';

class AddTodo extends Component {
  addTodoHandle(e){
    if (e.keyCode === 13 && this.refs.text.value !== '') {
      this.props.addTodo({
        id: this.props.data.length,
        isActive: true,
        text: this.refs.text.value
      });
      this.refs.text.value = '';
    }
  }

  completeAllTodosHandle(e){
    this.props.completeAll();
  }

  render(){
    return (
      <div className='add-todo'>
        <button
          className='complete-all-todos'
          onClick={this.completeAllTodosHandle.bind(this)}
        >˅
        </button>
        <input className='add-todo-input'
          placeholder='What needs to be done?'
          ref='text'
          onKeyDown={this.addTodoHandle.bind(this)}
        />
      </div>
    );
  }
};

class Todo extends Component {
  deleteTodo(e){
    this.props.deleteTodo(this.props.index);
  }

  changeStatus(e){
    this.props.changeStatus(this.props.data);
  }

  render(){
    return (
      <div className='todo'>
        <button
          className='status-button'
          onClick={this.changeStatus.bind(this)}
        >{this.props.data.isActive ? '' : '✔'}</button>
        <div className='todo-text'>{this.props.data.text}</div>
        <button
          className='close-button'
          onClick={this.deleteTodo.bind(this)}
        >×</button>
      </div>
    );
  }
}

class Todos extends Component {
  render(){
    var data = filters[this.props.filter](this.props.data);
    var temp;

    if (data.length > 0) {
      temp = data.map(function(todo, index) {
        return (
          <div key={index}>
            <Todo
              data={todo}
              index={index}
              deleteTodo={this.props.deleteTodo}
              changeStatus={this.props.changeStatus}
            />
          </div>
        );
      },this);
    } else {
      temp = <div></div>;
    };

    return (
      <div className='todos'>
        {temp}
      </div>
    );
  }
}

class TodosCount extends Component{
  render(){
    var temp = this.props.data.filter(function(todo) {
      return todo.isActive;
    }, this).length;

    return (
      <div className='todos-counter'>
        {temp} todo{temp === 1 ? '' : 's'} left
      </div>
    );
  }
}

class CustomButton extends Component {
  changeFilter(e) {
    this.props.changeFilter(this.props.buttonFilter);
  }

  render(){
    return (
      <button
        className='custom-button'
        id={this.props.buttonId}
        onClick={this.changeFilter.bind(this)}
      >
        {this.props.buttonText}
      </button>
    );
  }
}

class FilterPanel extends Component {
  closeCompleted(e) {
    this.props.closeCompleted();
  }

  render(){
    var buttons = this.props.buttons;
    var temp = buttons.map(function (button, index) {
      return (
        <CustomButton
          key={index}
          buttonId={button.name}
          buttonText={button.text}
          buttonFilter={button.filter}
          changeFilter={this.props.changeFilter}
        />);
    }, this);

    return (
      <div className='filter-panel'>
        <TodosCount data={this.props.data}/>
        <div className='button-panel'>{temp}</div>
        <button
          className='close-completed-button'
          onClick={this.closeCompleted.bind(this)}
        >Close Completed
        </button>
      </div>
    );
  }
}

class TodosContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: this.props.todosData,
      filter: 'ALL'
    };

    this.addTodo = this.addTodo.bind(this);
    this.deleteTodo = this.deleteTodo.bind(this);
    this.changeFilter = this.changeFilter.bind(this);
    this.changeStatus = this.changeStatus.bind(this);
    this.closeCompleted = this.closeCompleted.bind(this);
    this.completeAll = this.completeAll.bind(this);
  }

  addTodo(todo) {
    var data = this.state.data;

    data.push(todo);
    this.setState({
      data: data,
      filter: this.state.filter
    });
    updateTodosInLocalStorage(data);
  }

  deleteTodo(index) {
    var temp = filters[this.state.filter](this.state.data)[index];
    var data = this.state.data;

    data.splice(temp.id, 1);
    data.map(function(todo,index) {
      todo.id = index;
      return todo;
    }, this);
    this.setState({
      data: data,
      filter: this.state.filter,
    });
    updateTodosInLocalStorage(data);
  }

  changeFilter(filterName) {
    this.setState({
      data: this.state.data,
      filter: filterName
    });
    updateTodosInLocalStorage(this.state.data);
  }

  changeStatus(todo) {
    var data = this.state.data;

    todo.isActive = !todo.isActive;
    data[todo.Id] = todo;
    this.setState({
      data: data,
      filter: this.state.filter
    });
    updateTodosInLocalStorage(data);
  }

  closeCompleted() {
    var temp = this.state.data.filter(function(todo) {
      return todo.isActive;
    }, this);

    this.setState({
      data: temp,
      filter: this.state.filter
    });
    updateTodosInLocalStorage(this.state.data);
  }

  completeAll() {
    var data = this.state.data;
    var status = data.filter(function(todo) {
      return todo.isActive
    }, this).length === 0;

    data.forEach(function (todo){
      todo.isActive = status;
    }, this);
    this.setState({
      data: data,
      filter: this.state.filter
    });
    updateTodosInLocalStorage(data);
  }

  render () {
    return (
    <div className='todos-container'>
      <div className='todo-logo'>todos</div>
      <AddTodo
        data={this.state.data}
        addTodo={this.addTodo}
        completeAll={this.completeAll}
      />
      <Todos
        data={this.state.data}
        filter={this.state.filter}
        deleteTodo={this.deleteTodo}
        changeStatus={this.changeStatus}
      />
      <FilterPanel
        buttons={buttons}
        data={this.state.data}
        changeFilter={this.changeFilter}
        closeCompleted={this.closeCompleted}
      />
    </div>
    );
  }
}

class App extends Component {
  render() {
    var todosData = getTodosFromLocalStorage();
    console.log(todosData);
    return (
      <div className='App'>
        <TodosContainer todosData={todosData}/>
      </div>
    );
  }
}

export default App;
