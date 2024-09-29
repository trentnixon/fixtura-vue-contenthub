import { defineStore } from "pinia";
import { ref } from "vue";

export const useAuthStore = defineStore("auth", () => {
  const isAuthenticated = ref(
    localStorage.getItem("isAuthenticated") === "true" || false
  );

  const login = (username: string, password: string): boolean => {
    const envUsername = process.env.VUE_APP_USERNAME;
    const envPassword = process.env.VUE_APP_PASSWORD;

    if (username === envUsername && password === envPassword) {
      isAuthenticated.value = true;
      localStorage.setItem("isAuthenticated", "true");
      return true;
    } else {
      isAuthenticated.value = false;
      localStorage.removeItem("isAuthenticated");
      return false;
    }
  };

  const logout = () => {
    isAuthenticated.value = false;
    localStorage.removeItem("isAuthenticated");
  };

  return {
    isAuthenticated,
    login,
    logout,
  };
});
