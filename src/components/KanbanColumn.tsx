import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { KanbanColumn as KanbanColumnType, Task } from '../types';
import TetrisBlock from './TetrisBlock';

interface KanbanColumnProps {
  column: KanbanColumnType;
}

const KanbanColumn: React.FC<KanbanColumnProps> = ({ column }) => {
  const { setNodeRef } = useDroppable({
    id: column.id,
  });

  return (
    <div className="flex flex-col h-full">
      <div className="text-xl font-bold mb-4 text-center bg-base-300 py-2 rounded-t-lg">
        {column.title}
      </div>
      <div
        ref={setNodeRef}
        className="flex-1 p-2 bg-base-200 rounded-b-lg min-h-[500px] overflow-y-auto"
      >
        <SortableContext items={column.tasks.map(task => task.id)} strategy={verticalListSortingStrategy}>
          {column.tasks.map((task) => (
            <TetrisBlock key={task.id} task={task} />
          ))}
        </SortableContext>
      </div>
    </div>
  );
};

export default KanbanColumn; 