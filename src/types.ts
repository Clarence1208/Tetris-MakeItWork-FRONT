export type TetrisShape = 'I' | 'L' | 'J' | 'O' | 'S' | 'T' | 'Z';

export interface Skill {
  name: string;
  imageSrc: string;
}

export type KanbanStatus = 'Todo' | 'InProgress' | 'Test' | 'Done';

export interface Point {
  x: number;
  y: number;
}

export interface Task {
  id: string;
  name: string;
  description: string;
  company: string;
  skills: Skill[];
  shape: TetrisShape;
  status: KanbanStatus;
  gridPosition?: Point;
  blockPoints: Point[]; // Array of points representing each block in the Tetris shape
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

export type User = {
  id: string;
  name: string;
}