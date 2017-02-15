import React, { Component } from 'react';
import './App.css';
import { filters } from './filters'
import { buttons } from './buttons'

class Add extends Component {
  add(e){
    if (e.keyCode === 13) {

      this.props.addToDo({
        isActive: true,
        text: this.refs.text.value
      });
      this.refs.text.value = '';
    }
  }
  completeAllToDos(e){
    this.props.completeAll();
  }
  render(){
    return (
      <div className="addToDo">
        <button
          className='completeAllButton'
          onClick={this.completeAllToDos.bind(this)}
        >x
        </button>
        <input
          className='add_todo'
          placeholder='What needs to be done?'
          ref='text'
          onKeyDown={this.add.bind(this)}
        ></input>
      </div>
    );
  }
};

class Todo extends Component {
  deleteToDo(e){
    this.props.deleteToDo(this.props.index);
  }
  changeStatus(e){
    this.props.changeStatus(this.props.index, {
      isActive: !this.props.data.isActive,
      text: this.props.data.text
    });
  }
  render(){
    return (
      <div className="todo">
        <button
          className='statusButton'
          onClick={this.changeStatus.bind(this)}
        >{this.props.data.isActive ? '' : 'D!'}
        </button>
        <div className="todo_text">{this.props.data.text}</div>
        <button
          className='closeButton'
          onClick={this.deleteToDo.bind(this)}
        >Close
        </button>
      </div>
    );
  }
}

class Todos extends Component {
  render(){
    var data = filters[this.props.filter](this.props.data);
    var temp = [];
    if (data.length > 0) {
      for (var i = 0; i < data.length; i++) {
        temp.push(<div key={i}>
          <Todo
            data={data[i]}
            index={i}
            deleteToDo={this.props.deleteToDo}
            changeStatus={this.props.changeStatus}
          />
        </div>);
      }
    } else {
      temp = <div></div>;
    };

    return (
      <div className="todos">
        {temp}
      </div>
    );
  }
}

class TodosCount extends Component{
  render(){
    var data = this.props.data;
    var temp = 0;
    for (var i = 0; i < data.length; i++) {
      if (data[i].isActive) {
        temp++;
      }
    }
    return (
      <div className='todos_count'>
        {temp} items left
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
        className='customButton'
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
    var temp = [];
    for (var i = 0; i < buttons.length; i++)
    {
      temp.push(
        <CustomButton key={i}
          buttonId={buttons[i].name}
          buttonText={buttons[i].text}
          buttonFilter={buttons[i].filter}
          changeFilter={this.props.changeFilter}
        />
      );
    };

    return (
      <div className='filterPanel'>
        <TodosCount data={this.props.data}/>
        <div className='buttonPanel'>{temp}</div>
        <button
          className='closeCompletedButton'
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
      data: [],
      filter: 'ALL'
    };

    this.addToDo = this.addToDo.bind(this);
    this.deleteToDo = this.deleteToDo.bind(this);
    this.changeFilter = this.changeFilter.bind(this);
    this.changeStatus = this.changeStatus.bind(this);
    this.closeCompleted = this.closeCompleted.bind(this);
    this.completeAll = this.completeAll.bind(this);
  }

  addToDo(todo) {
    var data = this.state.data;
    data.push(todo);
    this.setState({
      data: data,
      filter: 'ALL'
    });
  }

  deleteToDo(index) {
    var data = this.state.data;
    data.splice(index, 1);
    this.setState({
      data: data,
      filter: 'ALL'
    });
  }

  changeFilter(filterName) {
    this.setState({
      data: this.state.data,
      filter: filterName
    });
  }

  changeStatus(index, value) {
    var data = this.state.data;
    var filter = this.state.filter;
    data[index] = value;
    this.setState({
      data: data,
      filter: filter
    });
  }

  closeCompleted() {
    var data = this.state.data;
    var temp = [];
    for (var i = 0; i < data.length; i++){
      if (data[i].isActive) {
        temp.push(data[i]);
      }
    }
    var filter = this.state.filter;
    this.setState({
      data: temp,
      filter: filter
    });
  }

  completeAll() {
    var data = this.state.data;
    for (var i = 0; i < data.length; i++){
      this.changeStatus(i, {
        status: false,
        text: data[i].text
      });
    }
  }

  render () {
    return (
    <div className="TodosContainer">
      <div className="toDoLogo">todos</div>
      <Add
        data={this.state.data}
        addToDo={this.addToDo}
        completeAll={this.completeAll}
      />
      <Todos
        data={this.state.data}
        filter={this.state.filter}
        deleteToDo={this.deleteToDo}
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
    return (
      <div className="App">
        <TodosContainer />
      </div>
    );
  }
}

export default App;
