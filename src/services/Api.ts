import Cookies from "js-cookie";

export class Api {
  async request<T>({
    path,
    method = "GET",
    data,
    headers = {},
    contentType = "application/json",
  }: {
    path: string;
    method?: string;
    data?: T;
    headers?: Record<string, string>;
    contentType?: string;
  }) {
    try {
      const token = Cookies.get("token");

      const apiUrl = import.meta.env.VITE_API_URL;

      const requestHeaders: Record<string, string> = {
        ...headers,
        ...(contentType ? { "Content-Type": contentType } : {}),
      };

      if (token) {
        requestHeaders.Authorization = `Bearer ${token}`;
      }

      const options: RequestInit = {
        method,
        headers: requestHeaders,
      };

      if (data && ["POST", "PUT", "PATCH"].includes(method.toUpperCase())) {
        options.body = JSON.stringify(data);
      }

      const response = await fetch(`${apiUrl}/${path}`, options);

      return response.json();
    } catch {
      throw new Error("An unknown error occurred");
    }
  }
}
