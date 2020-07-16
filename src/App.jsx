// Import dependencies
import React, { useState, useEffect } from "react";
import useProjects from "./hooks/useProjects";
import { SortableContainer, SortableElement } from "react-sortable-hoc";
import { CSSTransition } from "react-transition-group";

// Import components
import TodoForm from "./components/TodoForm";
import Todo from "./components/Todo";
import Timer from "./components/Timer";

import TimerImage from "./images/timer.svg";

export default function App() {
  // Global store
  const [
    projects,
    { addTodo, completeTodo, removeTodo, moveTodo },
  ] = useProjects();

  // Local states
  const [project, setProject] = useState(() => {
    return projects[0];
  });
  const [showTimer, setShowTimer] = useState(false);

  // Request notifications access
  useEffect(() => {
    if (Notification.permission !== "granted") Notification.requestPermission();
  }, []);

  useEffect(() => {
    setProject(projects[0]);
  }, [projects]);

  const TodoWrapper = SortableElement(({ id, text, completed }) => (
    <Todo
      id={id}
      text={text}
      completed={completed}
      onComplete={(id) => completeTodo(project._id, id)}
      onRemove={(id) => removeTodo(project._id, id)}
    />
  ));

  const Todolist = SortableContainer(() => (
    <div className="todos">
      {project.tasks.map((todo, i) => (
        <TodoWrapper
          key={i}
          index={i}
          id={todo._id}
          text={todo.text}
          completed={todo.completed}
        />
      ))}
    </div>
  ));

  function cancelDragging(e) {
    if (e.target.className.toLowerCase() === "btn-todo-drag") return false;

    return true;
  }

  return (
    <>
      <img
        src={TimerImage}
        alt="Timer button"
        className="btn-toggle-timer"
        onClick={() => setShowTimer((prev) => !prev)}
      />
      <header>
        <h1 className="title">{project.name}</h1>
        <TodoForm onAdd={(value) => addTodo(project._id, value)} />
      </header>
      <main>
        <CSSTransition in={showTimer} timeout={400} classNames="timer">
          <Timer />
        </CSSTransition>

        {project.tasks.length === 0 ? (
          <h2 className="no-todos-message">
            You do not have any tasks. <br />
            It`s a freetime! ⌛
          </h2>
        ) : (
          <Todolist
            onSortEnd={({ oldIndex, newIndex }) =>
              moveTodo(project._id, oldIndex, newIndex)
            }
            lockAxis="y"
            helperClass="todo-dragging"
            shouldCancelStart={cancelDragging}
            lockToContainerEdges={true}
            lockOffset="30px"
          />
        )}
      </main>
    </>
  );
}
