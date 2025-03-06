export type TetrisShape = 'I' | 'L' | 'J' | 'O' | 'S' | 'T' | 'Z';

export type KanbanStatus = 'Todo' | 'InProgress' | 'Test' | 'Done';

export interface Task {
  id: string;
  title: string;
  skills: string[];
  shape: TetrisShape;
  status: KanbanStatus;
  gridPosition?: { x: number; y: number };
}

export interface KanbanColumn {
  id: KanbanStatus;
  title: string;
  tasks: Task[];
  gridRowStart: number;
  gridRowEnd: number;
}

export interface KanbanBoard {
  columns: KanbanColumn[];
  grid: (string | null)[][];
} 