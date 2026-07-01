import axios, { AxiosInstance, AxiosResponse, AxiosRequestConfig } from "axios";
import config from "config";


class FileAPIClient {
  private axiosInstance: AxiosInstance;

  constructor() {
      this.axiosInstance = axios.create({
        baseURL: config.api.FILE_API_URL, 
      });

      const authUser = sessionStorage.getItem("authUser");
      const token = authUser ? JSON.parse(authUser).token : null;

      if (token) {
        this.axiosInstance.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${token}`;
      }

      this.axiosInstance.interceptors.response.use(
        response => response.data ?? response,
        error => Promise.reject(error)
      );
    }
    view = (fileName: string): Promise<Blob> =>
      this.axiosInstance.get(`/File/${fileName}`, {
        responseType: "blob"
      });

    upload = (file: File): Promise<string> => {
      const formData = new FormData();
      formData.append("file", file);
      return this.axiosInstance.post("/File", formData, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      });
    };

    delete = (fileName: string): Promise<void> =>
      this.axiosInstance.delete(`/File/${fileName}`);
  }
const getLoggedinUser = () => {
  const user = sessionStorage.getItem("authUser");
  return user ? JSON.parse(user) : null;
};

const setAuthorization = (token: string) => {
  // ⚠️ login sonrası çağırmak için
  // apiClientInstance?.setToken(token);
};

/* Optional ama temiz çözüm */
let apiClientInstance: FileAPIClient | null = null;
const getApiClient = () => {
  if (!apiClientInstance) apiClientInstance = new FileAPIClient();
  return apiClientInstance;
};

export { FileAPIClient, getLoggedinUser, getApiClient, setAuthorization };