import { Api } from "../Api";

const BASE_PATH = "skills";

export class SkillService {
  api: Api;
  constructor({ api = new Api() } = {}) {
    this.api = api;
  }

  async getSkills() {
    return this.api.request({
      path: BASE_PATH,
      method: "GET",
    });
  }
}