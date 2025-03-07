import { Api } from "../Api";

const BASE_PATH = "boards/mine";

export class BoardsService {
  api: Api;
  constructor({ api = new Api() } = {}) {
    this.api = api;
  }

  async getMyBoards() {
    return this.api.request({
      path: BASE_PATH,
      method: "GET",
    });
  }
}