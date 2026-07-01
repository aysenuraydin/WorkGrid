import axios, { AxiosInstance, AxiosResponse, AxiosRequestConfig } from "axios";
import config from "../config";
import { toast } from "react-toastify"; 

const getStoredRefreshToken = (): string | null => {
  const authUser = localStorage.getItem("authUser");
  if (!authUser) return null;
  try {
    const refreshToken = JSON.parse(authUser).refreshToken;
    return refreshToken ? refreshToken.replace(/^"+|"+$/g, "").trim() : null;
  } catch {
    return null;
  }
};
  
const serializeParams = (params: Record<string, any>): string => {
  const sp = new URLSearchParams();
  Object.entries(params ?? {}).forEach(([key, val]) => {
    if (val === null || val === undefined) return;
    if (Array.isArray(val)) {
      val.forEach((v) => {
        if (v !== null && v !== undefined && v !== "") sp.append(key, String(v));
      });
    } else {
      sp.append(key, String(val));
    }
  });
  return sp.toString();
};

class APIClient {
  private axiosInstance: AxiosInstance;

  constructor() {
    this.axiosInstance = axios.create({
      baseURL: config.api.API_URL,
      headers: {
        "Content-Type": "application/json"
      },
      paramsSerializer: {
        serialize: serializeParams
      }
    });

    this.axiosInstance.interceptors.request.use(
      (config) => {
        const authUser = localStorage.getItem("authUser");
        if (authUser) {
          const token = JSON.parse(authUser).token?.replace(/^"+|"+$/g, "").trim();
          if (token) config.headers["Authorization"] = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    this.axiosInstance.interceptors.response.use(
      (response) => {
        return response.data !== undefined ? response.data : response;
      },
      async (error) => {
        const originalRequest = error.config;


        if (error.response?.status === 403) {
            if (window.location.pathname.startsWith("/datatable/")) {
                window.location.replace("/forbidden");
            }
          }

        if ((error.response?.status === 401) && originalRequest && !originalRequest._retry) {
          originalRequest._retry = true;

          try {
            const currentRefreshToken = getStoredRefreshToken();
            if (!currentRefreshToken) throw new Error("No refresh token available");

            const refreshResponse = await axios.post(
              `${config.api.API_URL}/auth/refresh-token`,
              JSON.stringify(currentRefreshToken),
              { headers: { "Content-Type": "application/json" } }
            );

            const resData = refreshResponse.data;
            const AccessToken = resData?.AccessToken || resData?.accessToken || resData?.data?.accessToken || resData;
            const RefreshToken = resData?.RefreshToken || resData?.refreshToken || resData?.data?.refreshToken;

            const finalToken = typeof AccessToken === "string" ? AccessToken.replace(/^"+|"+$/g, "").trim() : null;

            if (!finalToken) throw new Error("New access token could not be parsed.");

            const existingAuthUserStr = localStorage.getItem("authUser");
            let parsedAuthUser = existingAuthUserStr ? JSON.parse(existingAuthUserStr) : {};

            const updatedAuthUser = {
              ...parsedAuthUser,
              token: finalToken,
              refreshToken: RefreshToken || currentRefreshToken
            };
            localStorage.setItem("authUser", JSON.stringify(updatedAuthUser));

            originalRequest.headers = originalRequest.headers || {};
            if (typeof originalRequest.headers.set === "function") {
              originalRequest.headers.set("Authorization", `Bearer ${finalToken}`);
            } else {
              originalRequest.headers["Authorization"] = `Bearer ${finalToken}`;
            }

            return this.axiosInstance(originalRequest);

          } catch (refreshError) {
            console.error("Token yenileme başarısız, seans sıfırlanıyor:", refreshError);
            localStorage.removeItem("authUser");

            if (window.location.pathname !== "/login") {
              window.location.replace("/login");
            }

            return Promise.reject(refreshError);
          }

        }
        return Promise.reject(error);
      }
    );
  }


  get = (url: string, arg?: any): Promise<any> => {
    if (!arg) return this.axiosInstance.get(url);
    const isAxiosConfig =
      typeof arg === "object" &&
      ("params" in arg || "headers" in arg || "signal" in arg ||
      "responseType" in arg || "timeout" in arg);
    return isAxiosConfig
      ? this.axiosInstance.get(url, arg)
      : this.axiosInstance.get(url, { params: arg });
  };

  create = (url: string, data: any): Promise<any> =>
    this.axiosInstance.post(url, data);

  patch = (url: string, data: any): Promise<any> =>
    this.axiosInstance.patch(url, data);

  put = (url: string, data: any): Promise<any> =>
    this.axiosInstance.put(url, data);

  delete = (url: string, config?: AxiosRequestConfig): Promise<any> =>
    this.axiosInstance.delete(url, config);
}

const getLoggedinUser = () => {
  const user = sessionStorage.getItem("authUser");
  return user ? JSON.parse(user) : null;
};

let apiClientInstance: APIClient | null = null;
const getApiClient = (): APIClient => {
  if (!apiClientInstance) apiClientInstance = new APIClient();
  return apiClientInstance;
};

const setAuthorization = (token: string) => {};

export { APIClient, getLoggedinUser, getApiClient, setAuthorization };