import { useState, useCallback } from 'react';
import { Plus, Trash2, Check, X, Edit2 } from 'lucide-react';
import { cn } from '@/utils/cn';
import { Button } from '@/components/ui/primitives/Button';
import { useTodoStore } from '@/store/todoStore';
import type { FilterType } from '@/types/todo.types';

const TodoApp = () => {
  const [inputValue, setInputValue] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');
  const [filter, setFilter] = useState<FilterType>('all');

  const { todos, addTodo, toggleTodo, deleteTodo, editTodo, clearCompleted } = useTodoStore();

  const handleAddTodo = useCallback(() => {
    if (inputValue.trim()) {
      addTodo(inputValue);
      setInputValue('');
    }
  }, [inputValue, addTodo]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter') {
        handleAddTodo();
      }
    },
    [handleAddTodo],
  );

  const handleEditStart = useCallback((id: string, text: string) => {
    setEditingId(id);
    setEditValue(text);
  }, []);

  const handleEditSave = useCallback(() => {
    if (editingId && editValue.trim()) {
      editTodo(editingId, editValue);
      setEditingId(null);
      setEditValue('');
    }
  }, [editingId, editValue, editTodo]);

  const handleEditCancel = useCallback(() => {
    setEditingId(null);
    setEditValue('');
  }, []);

  const filteredTodos = todos.filter((todo) => {
    if (filter === 'active') return !todo.completed;
    if (filter === 'completed') return todo.completed;
    return true;
  });

  const activeTodosCount = todos.filter((todo) => !todo.completed).length;
  const completedTodosCount = todos.filter((todo) => todo.completed).length;

  return (
    <div className="mx-auto max-w-xl p-6">
      <div className="rounded-2xl border border-border/50 bg-surface-secondary shadow-sm dark:border-border-dark/50 dark:bg-surface-dark-secondary">
        <div className="border-b border-border/50 p-6 dark:border-border-dark/50">
          <h1 className="text-lg font-semibold text-text-primary dark:text-text-dark-primary">
            Todo List
          </h1>
          <p className="mt-1 text-xs text-text-tertiary dark:text-text-dark-tertiary">
            Manage your tasks efficiently
          </p>
        </div>

        <div className="p-6">
          <div className="flex gap-2">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="What needs to be done?"
              className="flex-1 rounded-lg border border-border bg-surface px-4 py-2.5 text-xs text-text-primary placeholder:text-text-quaternary focus:border-text-quaternary/40 focus:outline-none focus:ring-2 focus:ring-text-quaternary/20 dark:border-border-dark dark:bg-surface-dark dark:text-text-dark-primary dark:placeholder:text-text-dark-quaternary dark:focus:border-text-dark-quaternary/40"
            />
            <Button
              onClick={handleAddTodo}
              size="md"
              className="shrink-0"
              disabled={!inputValue.trim()}
            >
              <Plus className="h-4 w-4" />
              Add
            </Button>
          </div>

          <div className="mt-4 flex items-center justify-between">
            <div className="flex gap-1">
              {(['all', 'active', 'completed'] as FilterType[]).map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={cn(
                    'rounded-md px-3 py-1.5 text-2xs font-medium capitalize transition-colors duration-200',
                    filter === f
                      ? 'bg-surface-active text-text-primary dark:bg-surface-dark-active dark:text-text-dark-primary'
                      : 'text-text-tertiary hover:bg-surface-hover hover:text-text-secondary dark:text-text-dark-tertiary dark:hover:bg-surface-dark-hover dark:hover:text-text-dark-secondary',
                  )}
                >
                  {f}
                </button>
              ))}
            </div>

            {completedTodosCount > 0 && (
              <Button onClick={clearCompleted} variant="ghost" size="sm" className="text-2xs">
                Clear completed
              </Button>
            )}
          </div>

          <div className="mt-4 space-y-2">
            {filteredTodos.length === 0 ? (
              <div className="py-12 text-center">
                <p className="text-xs text-text-tertiary dark:text-text-dark-tertiary">
                  {filter === 'completed'
                    ? 'No completed tasks yet'
                    : filter === 'active'
                      ? 'No active tasks'
                      : 'No tasks yet. Add one above!'}
                </p>
              </div>
            ) : (
              filteredTodos.map((todo) => (
                <div
                  key={todo.id}
                  className={cn(
                    'group flex items-center gap-3 rounded-xl border border-border/50 bg-surface p-3 transition-all duration-200 dark:border-border-dark/50 dark:bg-surface-dark',
                    todo.completed && 'bg-surface-tertiary/50 dark:bg-surface-dark-tertiary/50',
                  )}
                >
                  <button
                    onClick={() => toggleTodo(todo.id)}
                    className={cn(
                      'flex h-5 w-5 shrink-0 items-center justify-center rounded-md border-2 transition-colors duration-200',
                      todo.completed
                        ? 'border-text-primary bg-text-primary text-surface dark:border-text-dark-primary dark:bg-text-dark-primary dark:text-surface-dark'
                        : 'border-border hover:border-text-tertiary dark:border-border-dark dark:hover:border-text-dark-tertiary',
                    )}
                  >
                    {todo.completed && <Check className="h-3 w-3" />}
                  </button>

                  {editingId === todo.id ? (
                    <div className="flex flex-1 items-center gap-2">
                      <input
                        type="text"
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') handleEditSave();
                          if (e.key === 'Escape') handleEditCancel();
                        }}
                        autoFocus
                        className="flex-1 rounded-md border border-border bg-surface px-2 py-1 text-xs text-text-primary focus:border-text-quaternary/40 focus:outline-none focus:ring-2 focus:ring-text-quaternary/20 dark:border-border-dark dark:bg-surface-dark dark:text-text-dark-primary dark:focus:border-text-dark-quaternary/40"
                      />
                      <button
                        onClick={handleEditSave}
                        className="rounded-md p-1 text-text-secondary hover:bg-surface-hover hover:text-text-primary dark:text-text-dark-secondary dark:hover:bg-surface-dark-hover dark:hover:text-text-dark-primary"
                      >
                        <Check className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={handleEditCancel}
                        className="rounded-md p-1 text-text-secondary hover:bg-surface-hover hover:text-text-primary dark:text-text-dark-secondary dark:hover:bg-surface-dark-hover dark:hover:text-text-dark-primary"
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  ) : (
                    <>
                      <span
                        className={cn(
                          'flex-1 text-xs transition-all duration-200',
                          todo.completed
                            ? 'text-text-quaternary line-through dark:text-text-dark-quaternary'
                            : 'text-text-primary dark:text-text-dark-primary',
                        )}
                      >
                        {todo.text}
                      </span>

                      <div className="flex items-center gap-1 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                        <button
                          onClick={() => handleEditStart(todo.id, todo.text)}
                          className="rounded-md p-1.5 text-text-tertiary hover:bg-surface-hover hover:text-text-primary dark:text-text-dark-tertiary dark:hover:bg-surface-dark-hover dark:hover:text-text-dark-primary"
                        >
                          <Edit2 className="h-3 w-3" />
                        </button>
                        <button
                          onClick={() => deleteTodo(todo.id)}
                          className="rounded-md p-1.5 text-text-tertiary hover:bg-surface-hover hover:text-error-500 dark:text-text-dark-tertiary dark:hover:bg-surface-dark-hover dark:hover:text-error-400"
                        >
                          <Trash2 className="h-3 w-3" />
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ))
            )}
          </div>

          {todos.length > 0 && (
            <div className="mt-4 flex items-center justify-between border-t border-border/50 pt-4 text-2xs text-text-tertiary dark:border-border-dark/50 dark:text-text-dark-tertiary">
              <span>
                {activeTodosCount} {activeTodosCount === 1 ? 'task' : 'tasks'} remaining
              </span>
              <span>{completedTodosCount} completed</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TodoApp;
