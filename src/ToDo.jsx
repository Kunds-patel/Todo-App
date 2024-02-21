import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import React, { Component, createRef } from 'react';

export default class ToDo extends Component {
  state = {
    todoList: [],
    filterType: 'All',
  };

  inputRef = createRef();

  async componentDidMount() {
    this.loadTodo();
  }

  loadTodo = async () => {
    try {
      const res = await fetch('http://localhost:3000/todoList');
      const json = await res.json();
      this.setState({ todoList: json });
    } catch (error) {
      throw new Error(error);
    }
  };

  addTodo = async event => {
    try {
      event.preventDefault();
      const input = this.inputRef.current;
      const res = await fetch('http://localhost:3000/todoList', {
        method: 'POST',
        body: JSON.stringify({
          text: input.value,
          isDone: false,
        }),
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
      });
      const json = await res.json();
      this.setState(
        ({ todoList }) => ({
          todoList: [...todoList, json],
        }),
        () => {
          input.value = '';
        },
      );
    } catch (error) {
      throw new Error(error);
    }
  };

  toggleDone = async item => {
    try {
      const res = await fetch(`http://localhost:3000/todoList/${item.id}`, {
        method: 'PUT',
        body: JSON.stringify({
          ...item,
          isDone: !item.isDone,
        }),
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
      });
      const json = await res.json();

      this.setState(({ todoList }) => {
        const index = todoList.findIndex(x => x.id === item.id);
        return {
          todoList: [
            ...todoList.slice(0, index),
            json,
            ...todoList.slice(index + 1),
          ],
        };
      });
    } catch (error) {
      throw new Error(error);
    }
  };

  deleteTodo = async item => {
    try {
      await fetch(`http://localhost:3000/todoList/${item.id}`, {
        method: 'DELETE',
      });
      this.setState(({ todoList }) => {
        const index = todoList.findIndex(x => x.id === item.id);
        return {
          todoList: [...todoList.slice(0, index), ...todoList.slice(index + 1)],
        };
      });
    } catch (error) {
      throw new Error(error);
    }
  };

  changeFilterType = filterType => {
    this.setState({ filterType });
  };

  render() {
    const { todoList, filterType } = this.state;
    return (
      <div className="flex min-h-screen flex-col items-center gap-8 pt-5">
        <h1 className="text-center text-3xl font-bold">Todo App</h1>
        <form onSubmit={this.addTodo} className="flex">
          <Input
            ref={this.inputRef}
            type="text"
            className="rounded-r-none"
            required
          />
          <Button className="rounded-l-none" type="submit">
            Button
          </Button>
        </form>
        <div className="flex w-full flex-1 flex-col gap-3 px-5">
          {todoList.map(item => {
            if (
              filterType === 'All' ||
              (filterType === 'Pending' && item.isDone === false) ||
              (filterType === 'Completed' && item.isDone === true)
            ) {
              return (
                <div
                  key={item.id}
                  className="flex items-center justify-between"
                >
                  <Checkbox
                    className="size-5"
                    checked={item.isDone}
                    onCheckedChange={() => this.toggleDone(item)}
                  />
                  <p
                    className={`mx-6 flex-1 ${item.isDone ? 'line-through' : ''}`}
                  >
                    {item.text}
                  </p>
                  <Button type="button" onClick={() => this.deleteTodo(item)}>
                    Delete
                  </Button>
                </div>
              );
            }
            return null;
          })}
        </div>
        <div className="flex w-full">
          <Button
            variant={filterType === 'All' ? 'destructive' : 'default'}
            className="flex-1 rounded-none"
            onClick={() => this.changeFilterType('All')}
          >
            All
          </Button>
          <Button
            variant={filterType === 'Pending' ? 'destructive' : 'default'}
            className="flex-1 rounded-none"
            onClick={() => this.changeFilterType('Pending')}
          >
            Pending
          </Button>
          <Button
            variant={filterType === 'Completed' ? 'destructive' : 'default'}
            className="flex-1 rounded-none"
            onClick={() => this.changeFilterType('Completed')}
          >
            Completed
          </Button>
        </div>
      </div>
    );
  }
}
