export type TetrisShape = 'I' | 'L' | 'J' | 'O' | 'S' | 'T' | 'Z';

export type KanbanStatus = 'Todo' | 'InProgress' | 'Done';

export interface Task {
  id: string;
  title: string;
  skills: string[];
  shape: TetrisShape;
  status: KanbanStatus;
}

export interface KanbanColumn {
  id: KanbanStatus;
  title: string;
  tasks: Task[];
}

export interface KanbanBoard {
  columns: KanbanColumn[];
} 