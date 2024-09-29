import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";

console.log("process.env ", process.env);
const apiBaseUrl = process.env.VUE_APP_API_BASE_URL;
const apiKey = process.env.VUE_APP_API_KEY;

console.log("apiBaseUrl ", apiBaseUrl);

const axiosInstance: AxiosInstance = axios.create({
  baseURL: apiBaseUrl,
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${apiKey}`,
  },
});

const fetcher = {
  get: async <T>(url: string, config?: AxiosRequestConfig): Promise<T> => {
    try {
      const response: AxiosResponse<T> = await axiosInstance.get(url, config);
      return response.data;
    } catch (error) {
      return handleError(error);
    }
  },

  post: async <T>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<T> => {
    try {
      const response: AxiosResponse<T> = await axiosInstance.post(
        url,
        data,
        config
      );
      return response.data;
    } catch (error) {
      return handleError(error);
    }
  },

  put: async <T>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<T> => {
    try {
      const response: AxiosResponse<T> = await axiosInstance.put(
        url,
        data,
        config
      );
      return response.data;
    } catch (error) {
      return handleError(error);
    }
  },

  delete: async <T>(url: string, config?: AxiosRequestConfig): Promise<T> => {
    try {
      const response: AxiosResponse<T> = await axiosInstance.delete(
        url,
        config
      );
      return response.data;
    } catch (error) {
      return handleError(error);
    }
  },
};

interface AxiosError {
  response?: {
    data: any;
    status: number;
    statusText: string;
  };
  message: string;
  config: AxiosRequestConfig;
  isAxiosError: boolean;
}

const handleError = (error: unknown): never => {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError;
    console.error(
      "Axios error:",
      axiosError.response?.data || axiosError.message
    );
  } else {
    console.error("Unexpected error:", error);
  }
  throw error;
};

export default fetcher;
