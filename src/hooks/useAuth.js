import { useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";

const API_URL = "http://localhost:8000";

export function useAuth() {
  const { user, login, logout } = useContext(AuthContext);

  const loginUser = async (username, password) => {
    const response = await axios.get(
      `${API_URL}/users?username=${username}&password=${password}`
    );

    const users = response.data;

    if (users.length === 0) {
      throw new Error("Username hoặc password không đúng");
    }

    const currentUser = users[0];

    const userData = {
      id: currentUser.id,
      username: currentUser.username,
      fullname: currentUser.fullname,
      role: currentUser.role,
    };

    login(userData);
    return userData;
  };

  const registerUser = async (newUser) => {
    const checkUser = await axios.get(
      `${API_URL}/users?username=${newUser.username}`
    );

    if (checkUser.data.length > 0) {
      throw new Error("Username đã tồn tại");
    }

    const response = await axios.post(`${API_URL}/users`, {
      ...newUser,
      role: "customer",
    });

    return response.data;
  };

  return {
    user,
    loginUser,
    registerUser,
    logout,
  };
}
