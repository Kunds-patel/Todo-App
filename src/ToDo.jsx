import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import React, { Component, createRef } from 'react';

export default class ToDo extends Component {
  state = {
    todoList: [],
  };

  inputRef = createRef();

  addTodo = event => {
    event.preventDefault();
    const input = this.inputRef.current;
    this.setState(
      ({ todoList }) => ({
        todoList: [
          ...todoList,
          { id: new Date().valueOf(), text: input.value, isDone: false },
        ],
      }),
      () => {
        input.value = '';
      },
    );
  };

  toggleDone = item => {
    this.setState(({ todoList }) => {
      const index = todoList.findIndex(x => x.id === item.id);
      return {
        todoList: [
          ...todoList.slice(0, index),
          { ...item, isDone: !item.isDone },
          ...todoList.slice(index + 1),
        ],
      };
    });
  };

  deleteTodo = item => {
    this.setState(({ todoList }) => {
      const index = todoList.findIndex(x => x.id === item.id);
      return {
        todoList: [...todoList.slice(0, index), ...todoList.slice(index + 1)],
      };
    });
  };

  render() {
    const { todoList } = this.state;
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
          {todoList.map(item => (
            <div key={item.id} className="flex items-center justify-between">
              <Checkbox
                className={`size-5 ${item.isDone ? 'line-through' : ''}`}
                checked={item.isDone}
                onCheckedChange={() => this.toggleDone(item)}
              />
              <p className="mx-6 flex-1">{item.text}</p>
              <Button type="button" onClick={() => this.deleteTodo(item)}>
                Delete
              </Button>
            </div>
          ))}
        </div>
        <div className="flex w-full">
          {' '}
          <Button variant="destructive" className="flex-1 rounded-none">
            All
          </Button>
          <Button className="flex-1 rounded-none">Pending</Button>
          <Button className="flex-1 rounded-none">Completed</Button>
        </div>
      </div>
    );
  }
}
