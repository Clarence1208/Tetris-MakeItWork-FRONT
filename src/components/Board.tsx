import React, { useState } from 'react';
import { DndContext, DragEndEvent, DragOverEvent, DragStartEvent } from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';
import { KanbanBoard, KanbanStatus, Task } from '../types';
import KanbanColumn from './KanbanColumn';

// Sample data for initial state
const initialTasks: Task[] = [
  {
    id: '1',
    title: 'Create UI Components',
    skills: ['React', 'CSS', 'HTML'],
    shape: 'I',
    status: 'Todo',
  },
  {
    id: '2',
    title: 'Implement API',
    skills: ['Node.js', 'Express', 'MongoDB', 'REST'],
    shape: 'L',
    status: 'Todo',
  },
  {
    id: '3',
    title: 'Design Database',
    skills: ['MongoDB', 'Schema Design'],
    shape: 'T',
    status: 'InProgress',
  },
  {
    id: '4',
    title: 'Write Tests',
    skills: ['Jest', 'Testing', 'Cypress', 'QA', 'Documentation'],
    shape: 'O',
    status: 'InProgress',
  },
  {
    id: '5',
    title: 'Deploy Application',
    skills: ['DevOps', 'AWS', 'CI/CD'],
    shape: 'Z',
    status: 'Done',
  },
  {
    id: '6',
    title: 'Security Review',
    skills: ['Auth', 'Encryption'],
    shape: 'J',
    status: 'Todo',
  },
  {
    id: '7',
    title: 'Performance Optimization',
    skills: ['Webpack', 'Code Splitting', 'Lazy Loading', 'Caching'],
    shape: 'S',
    status: 'InProgress',
  },
];

const initialBoard: KanbanBoard = {
  columns: [
    {
      id: 'Todo',
      title: 'To Do',
      tasks: initialTasks.filter(task => task.status === 'Todo'),
    },
    {
      id: 'InProgress',
      title: 'In Progress',
      tasks: initialTasks.filter(task => task.status === 'InProgress'),
    },
    {
      id: 'Done',
      title: 'Done',
      tasks: initialTasks.filter(task => task.status === 'Done'),
    },
  ],
};

const Board: React.FC = () => {
  const [board, setBoard] = useState<KanbanBoard>(initialBoard);
  const [activeTask, setActiveTask] = useState<Task | null>(null);

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const taskId = active.id as string;
    
    // Find the active task
    const task = findTaskById(taskId);
    if (task) {
      setActiveTask(task);
    }
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    
    if (!over) return;
    
    const activeId = active.id as string;
    const overId = over.id as string;
    
    // Find the active task
    const activeTask = findTaskById(activeId);
    if (!activeTask) return;
    
    // Check if we're dragging over a column
    const isOverColumn = board.columns.some(col => col.id === overId);
    
    if (isOverColumn) {
      // We're dragging over a column, update the task's status
      const newStatus = overId as KanbanStatus;
      
      if (activeTask.status !== newStatus) {
        setBoard(prev => {
          // Create a new board with the task moved to the new column
          const updatedColumns = prev.columns.map(col => {
            // Remove the task from its current column
            if (col.id === activeTask.status) {
              return {
                ...col,
                tasks: col.tasks.filter(t => t.id !== activeId),
              };
            }
            
            // Add the task to its new column
            if (col.id === newStatus) {
              const updatedTask = { ...activeTask, status: newStatus };
              return {
                ...col,
                tasks: [...col.tasks, updatedTask],
              };
            }
            
            return col;
          });
          
          return { columns: updatedColumns };
        });
      }
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (!over) {
      setActiveTask(null);
      return;
    }
    
    const activeId = active.id as string;
    const overId = over.id as string;
    
    // Find the active task
    const activeTask = findTaskById(activeId);
    if (!activeTask) {
      setActiveTask(null);
      return;
    }
    
    // Check if we're dropping over a task
    const overTask = findTaskById(overId);
    
    if (overTask && activeTask.status === overTask.status) {
      // We're reordering within the same column
      setBoard(prev => {
        const columnIndex = prev.columns.findIndex(col => col.id === activeTask.status);
        if (columnIndex === -1) return prev;
        
        const column = prev.columns[columnIndex];
        const oldIndex = column.tasks.findIndex(t => t.id === activeId);
        const newIndex = column.tasks.findIndex(t => t.id === overId);
        
        if (oldIndex === -1 || newIndex === -1) return prev;
        
        const updatedTasks = arrayMove(column.tasks, oldIndex, newIndex);
        
        const updatedColumns = [...prev.columns];
        updatedColumns[columnIndex] = {
          ...column,
          tasks: updatedTasks,
        };
        
        return { columns: updatedColumns };
      });
    }
    
    setActiveTask(null);
  };

  const findTaskById = (taskId: string): Task | undefined => {
    for (const column of board.columns) {
      const task = column.tasks.find(t => t.id === taskId);
      if (task) return task;
    }
    return undefined;
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-3xl font-bold mb-8 text-center">Tetris Kanban Board</h2>
      <DndContext
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {board.columns.map(column => (
            <KanbanColumn key={column.id} column={column} />
          ))}
        </div>
      </DndContext>
    </div>
  );
};

export default Board; 