import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: "http://localhost:8080",
});

export class LoginService {
    
  register(name: String, email: String, password: String) {
    return axiosInstance.post("/auth/register", {
      name: name,
      email: email,
      password: password,
    });
  }

  login(email: String, password: String) {
    return axiosInstance.post("/auth/login", {
      email: email,
      password: password,
    });
  }
}
