import axios from "axios";

export interface Board {
  id: string;
  name: string;
  column: number;
}

export async function getBoardById(id: string): Promise<Board> {
  const response = await axios.get(`/boards/${id}`);
  return response.data;
}
export async function getAllBoards(): Promise<Board[]> {
    const response = await axios.get("http://localhost:3000/boards"); 
    return response.data;
  }
