import { Api } from "../Api";

const BASE_PATH = "users";

export class UserService {
  api: Api;
  constructor({ api = new Api() } = {}) {
    this.api = api;
  }

  async getUser() {
    return this.api.request({
      path: BASE_PATH,
      method: "GET",
    });
  }
}
