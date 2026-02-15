import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Todo, TodoState } from '@/types/todo.types';

const generateId = (): string => Math.random().toString(36).substring(2, 9);

export const useTodoStore = create<TodoState>()(
  persist(
    (set) => ({
      todos: [],

      addTodo: (text: string) => {
        const newTodo: Todo = {
          id: generateId(),
          text: text.trim(),
          completed: false,
          createdAt: Date.now(),
        };
        set((state) => ({ todos: [...state.todos, newTodo] }));
      },

      toggleTodo: (id: string) => {
        set((state) => ({
          todos: state.todos.map((todo) =>
            todo.id === id ? { ...todo, completed: !todo.completed } : todo,
          ),
        }));
      },

      deleteTodo: (id: string) => {
        set((state) => ({
          todos: state.todos.filter((todo) => todo.id !== id),
        }));
      },

      editTodo: (id: string, text: string) => {
        set((state) => ({
          todos: state.todos.map((todo) =>
            todo.id === id ? { ...todo, text: text.trim() } : todo,
          ),
        }));
      },

      clearCompleted: () => {
        set((state) => ({
          todos: state.todos.filter((todo) => !todo.completed),
        }));
      },
    }),
    {
      name: 'todo-storage',
    },
  ),
);
