import { Api } from "../Api";

const BASE_URL = "auth";

type Auth = {
  name: string;
  email: string;
  password: string;
};

export class AuthService {
  api: Api;
  constructor({ api = new Api() } = {}) {
    this.api = api;
  }

  async register(data: Auth) {
    return this.api.request({
      path: `${BASE_URL}/register`,
      data,
      method: "POST",
    });
  }

  async login(data: Omit<Auth, "name">) {
    return this.api.request({
      path: `${BASE_URL}/login`,
      data,
      method: "POST",
    });
  }
}
