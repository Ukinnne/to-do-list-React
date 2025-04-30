import { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [tasks, setTasks] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // Загрузка задач из localStorage при монтировании компонента
  useEffect(() => {
    const loadTasks = () => {
      try {
        const savedTasks = localStorage.getItem('tasks');
        if (savedTasks) {
          const parsedTasks = JSON.parse(savedTasks);
          // Проверяем структуру загруженных данных
          if (Array.isArray(parsedTasks) && parsedTasks.every(task => 
            typeof task === 'object' && 
            'text' in task && 
            'completed' in task &&
            'id' in task
          )) {
            setTasks(parsedTasks);
          } else {
            console.warn('Некорректный формат данных в localStorage');
            localStorage.removeItem('tasks');
          }
        }
      } catch (error) {
        console.error('Ошибка при чтении из localStorage:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadTasks();
  }, []);

  // Сохранение задач в localStorage при их изменении
  useEffect(() => {
    if (!isLoading) {
      try {
        localStorage.setItem('tasks', JSON.stringify(tasks));
      } catch (error) {
        console.error('Ошибка при записи в localStorage:', error);
      }
    }
  }, [tasks, isLoading]);

  const handleAddTask = () => {
    const text = inputValue.trim();
    if (text) {
      const newTask = {
        text,
        completed: false,
        id: Date.now() // уникальный идентификатор
      };
      setTasks([...tasks, newTask]);
      setInputValue('');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleAddTask();
    }
  };

  const handleToggleTask = (id) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  const handleRemoveCompleted = () => {
    const completedTasks = tasks.filter(task => task.completed);
    if (completedTasks.length === 0) return;

    // Анимация удаления
    completedTasks.forEach(task => {
      const element = document.querySelector(`.task-item[data-id="${task.id}"]`);
      if (element) {
        element.classList.add('fade-out');
      }
    });

    setTimeout(() => {
      setTasks(tasks.filter(task => !task.completed));
    }, 300);
  };

  if (isLoading) {
    return <div className="container loading">Загрузка задач...</div>;
  }

  return (
    <div className="container">
      <h1 className="tasks-title">Задачи:</h1>
      <input
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyPress={handleKeyPress}
        placeholder="Введите текст и нажмите Enter"
        className="task-input"
      />
      <div className="tasks-list">
        {tasks.length > 0 ? (
          tasks.map((task) => (
            <div 
              key={task.id} 
              className={`task-item ${task.completed ? 'completed' : ''}`}
              data-id={task.id}
            >
              <input
                type="checkbox"
                checked={task.completed}
                onChange={() => handleToggleTask(task.id)}
                className="task-checkbox"
              />
              <span className="task-text">{task.text}</span>
            </div>
          ))
        ) : (
          <div className="empty-state">Нет задач</div>
        )}
      </div>
      {tasks.some(task => task.completed) && (
        <button 
          onClick={handleRemoveCompleted}
          className="remove-completed-btn"
        >
          Удалить выполненные ({tasks.filter(t => t.completed).length})
        </button>
      )}
    </div>
  );
}

export default App;