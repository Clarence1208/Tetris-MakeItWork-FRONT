import { Api } from "../Api";

const BASE_PATH = "boards";

export class BoardsService {
  api: Api;
  constructor({ api = new Api() } = {}) {
    this.api = api;
  }

  async getBoards() {
    return this.api.request({
      path: BASE_PATH,
      method: "GET",
    });
  }
}