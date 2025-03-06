import { Api } from "../Api";

const BASE_PATH = "skills";

type CreateSkills = {
  name: string;
  imageSrc: string;
};

export class SkillService {
  api: Api;
  constructor({ api = new Api() } = {}) {
    this.api = api;
  }

  async createSkill(data: CreateSkills) {
    return this.api.request({
      path: BASE_PATH,
      method: "POST",
      data,
    });
  }

  async updateSkills(data: Partial<CreateSkills>) {
    return this.api.request({
      path: BASE_PATH,
      method: "PUT",
      data,
    });
  }

  async getSkills() {
    return this.api.request({
      path: BASE_PATH,
      method: "GET",
    });
  }

  async getSkillssById(skillId: string) {
    return this.api.request({
      path: `${BASE_PATH}/${skillId}`,
      method: "GET",
    });
  }

  async deleteSkillsById(skillId: string) {
    return this.api.request({
      path: `${BASE_PATH}/${skillId}`,
      method: "DELETE",
    });
  }
}
