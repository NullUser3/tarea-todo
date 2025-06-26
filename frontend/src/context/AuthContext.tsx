// React and necessary hooks
import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
  useCallback,
} from "react";
// React Router hooks
import { useNavigate, useLocation } from "react-router-dom";
// Axios for HTTP requests
import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios";
import toast from "react-hot-toast";

// Interface that defines the shape of our AuthContext
interface AuthContextType {
  accessToken: string | null;
  signupError: string | null;
  isAuthenticated: boolean;
  login: (credentials: {
    usernameOrEmail: string;
    password: string;
  }) => Promise<void>;
  signup: (credentials: {
    username: string;
    email: string;
    password: string;
  }) => Promise<void>;
  logout: () => Promise<void>;
  refreshAccessToken: () => Promise<string>;
  setAccessToken: (token: string | null) => void;
  authInitialized: boolean;
  isLoading: boolean; // Added isLoading to the interface
  setSignupError: React.Dispatch<React.SetStateAction<string | null>>;
}

// Create a Context object for Auth
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Create an Axios instance with base configuration
const apiClient = axios.create({
  baseURL: process.env.REACT_APP_API, // Base URL from environment variables
  withCredentials: true, // Include cookies in requests
  headers: {
    "Content-Type": "application/json", // Set default Content-Type for requests
  },
});

// AuthProvider component to wrap around the app
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [authInitialized, setAuthInitialized] = useState(false);
  // Store the access token
  const [accessToken, setAccessToken] = useState<string | null>(null);

  const [signupError, setSignupError] = useState<string | null>(null);
  // Track if we are currently refreshing the token
  const [isRefreshing, setIsRefreshing] = useState(false);
  // Queue of requests waiting for refresh to complete
  const [refreshQueue, setRefreshQueue] = useState<
    Array<(token: string) => void>
  >([]);
  // Track loading state
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate(); // Hook to programmatically navigate
  const location = useLocation(); // Hook to get current location

  console.log(accessToken);

  // Calculate whether user is authenticated
  const isAuthenticated = !!accessToken;

  const logout = useCallback(async () => {
    // Only make the API call if we actually have a token
    if (accessToken) {
      try {
        setIsLoading(true);
        await apiClient.post("/api/logout");
      } catch (error) {
        console.error("Logout failed:", error);
      } finally {
        setAccessToken(null);
        setIsLoading(false);
        navigate("/login", { state: { from: location }, replace: true });
      }
    } else {
      // Already logged out, just redirect
      setIsLoading(false);
      navigate("/login", { state: { from: location }, replace: true });
    }
  }, [navigate, location, accessToken]);

  const refreshAccessToken = useCallback(async () => {
    // If we're already logged out, don't try to refresh
    if (!accessToken && authInitialized) {
      console.log("Already logged out, skipping refresh");
      return Promise.reject(new Error("Already logged out"));
    }

    try {
      setIsLoading(true);
      console.log("Calling refresh token endpoint...");
      const response = await apiClient.post<{ token: string }>(
        "/api/refresh-token"
      );
      console.log("Refresh token response received:", response.status);
      const newToken = response.data.token;
      setAccessToken(newToken);
      setIsLoading(false);
      return newToken;
    } catch (error) {
      console.error("Refresh token error:", error);
      setAccessToken(null);
      setIsLoading(false);
      throw error;
    }
  }, [accessToken, authInitialized]);

  // Login function
  const login = useCallback(
    async (credentials: { usernameOrEmail: string; password: string }) => {
      try {
        setIsLoading(true);
        const response = await apiClient.post<{ token: string }>(
          "/api/login",
          credentials
        ); // Post login credentials
        setAccessToken(response.data.token); // Save returned access token
        setIsLoading(false);
        const redirectPath = location.state?.from?.pathname || "/allTasks"; // Redirect to original page or dashboard
        navigate(redirectPath, { replace: true });
      } catch (error) {
        setAccessToken(null); // If login fails, clear token
        setIsLoading(false);
        throw error; // Rethrow for UI error handling
      }
    },
    [navigate, location.state]
  );

  const signup = useCallback(
    (credentials: { username: string; email: string; password: string }) => {
      setIsLoading(true);

      return apiClient
        .post<{ token: string }>("/api/createUser", credentials)
        .then(() => {
          const { email, username, ...rest } = credentials;
          const loginData = {
            ...rest,
            usernameOrEmail: email,
          };
          return apiClient.post<{ token: string }>("/api/login", loginData);
        })
        .then((response) => {
          setAccessToken(response.data.token);
          const redirectPath = location.state?.from?.pathname || "/allTasks";
          navigate(redirectPath, { replace: true });
        })
        .catch((error) => {
          setAccessToken(null);
          setSignupError(error.response.data.message);
          toast.error(error.response.data.message);
          throw error;
        })
        .finally(() => {
          setIsLoading(false);
        });
    },
    [navigate, location.state]
  );

  // Add request interceptor
  useEffect(() => {
    const requestInterceptor = apiClient.interceptors.request.use(
      (config) => {
        if (accessToken && !config.headers["Authorization"]) {
          config.headers["Authorization"] = `Bearer ${accessToken}`; // Attach access token to every request
        }
        return config; // Continue request
      },
      (error) => Promise.reject(error) // Pass request errors to caller
    );

    return () => {
      apiClient.interceptors.request.eject(requestInterceptor); // Remove interceptor on unmount
    };
  }, [accessToken]);

  // Add response interceptor
  useEffect(() => {
    const responseInterceptor = apiClient.interceptors.response.use(
      (response: AxiosResponse) => response,
      async (error: AxiosError) => {
        const originalRequest = error.config as AxiosRequestConfig & {
          _retry?: boolean;
        };

        // Get the request path without domain for comparison
        const requestPath = originalRequest.url || "";
        const isRefreshTokenRequest =
          requestPath.includes("/api/refresh-token");
        const isLoginRequest = requestPath.includes("/api/login");

        // Check if this is a 401 error from the refresh token endpoint itself
        if (
          error.response?.status === 401 &&
          isRefreshTokenRequest &&
          location.pathname !== "/register" &&
          location.pathname !== "/register"
        ) {
          console.log("Refresh token request failed with 401, logging out");
          // Don't call refreshAccessToken again, just clear the token and redirect
          setAccessToken(null);
          setIsLoading(false);
          navigate("/login", { state: { from: location }, replace: true });
          return Promise.reject(error);
        }
        // Handle other 401 Unauthorized errors
        if (
          (error.response?.status === 401 || error.response?.status === 403) &&
          !originalRequest._retry &&
          !isLoginRequest &&
          !isRefreshTokenRequest
        ) {
          if (isRefreshing) {
            // If refresh already happening, wait in queue
            return new Promise((resolve, reject) => {
              setRefreshQueue((prev) => [
                ...prev,
                (token: string) => {
                  if (originalRequest.headers) {
                    originalRequest.headers[
                      "Authorization"
                    ] = `Bearer ${token}`;
                  }
                  originalRequest._retry = true;
                  resolve(apiClient(originalRequest));
                },
              ]);
            });
          }

          originalRequest._retry = true;
          setIsRefreshing(true);
          setIsLoading(true);

          try {
            console.log("Attempting to refresh token...");
            const newToken = await refreshAccessToken();

            // Process queued requests
            refreshQueue.forEach((cb) => cb(newToken));
            setRefreshQueue([]);

            // Update auth header and retry
            if (originalRequest.headers) {
              originalRequest.headers["Authorization"] = `Bearer ${newToken}`;
            }
            return apiClient(originalRequest);
          } catch (refreshError) {
            console.error("Token refresh failed:", refreshError);
            return Promise.reject(refreshError);
          } finally {
            setIsRefreshing(false);
            setIsLoading(false);
          }
        }

        return Promise.reject(error);
      }
    );

    return () => {
      apiClient.interceptors.response.eject(responseInterceptor);
    };
  }, [accessToken, isRefreshing, refreshQueue, refreshAccessToken, logout]);

  // Modify the initial auth check useEffect
  useEffect(() => {
    const checkAuth = async () => {
      try {
        setIsLoading(true);
        await refreshAccessToken();
      } catch (error) {
        // User is not logged in, that's fine
        console.log("Not authenticated initially, continuing as guest");
      } finally {
        setAuthInitialized(true); // Mark auth as initialized regardless of outcome
        setIsLoading(false);
      }
    };

    if (!authInitialized) {
      checkAuth();
    }
  }, [refreshAccessToken, authInitialized]);

  // Prepare value object for the Context
  const value = {
    accessToken,
    signupError,
    setSignupError,
    isAuthenticated,
    login,
    signup,
    logout,
    refreshAccessToken,
    setAccessToken,
    authInitialized,
    isLoading, // Added isLoading to the context value
  };

  // Provide context to children
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook to consume AuthContext
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

// Export apiClient if someone needs to manually make a request
export { apiClient };
