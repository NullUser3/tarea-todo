import Logo from "../components/Logo";
import google from "../images/search.png";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "../context/AuthContext";
import { useMutation } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";

const userSchema = z.object({
  username: z.string().min(1, "username is required"),
  email: z.string().min(1, "email is required"),
  password: z.string().min(1, "Password is required"),
});

type UserTypes = z.infer<typeof userSchema>;

const SignUp = () => {
  const {
    signup,
    accessToken,
    authInitialized,
    isLoading,
    isAuthenticated,
  } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
    clearErrors,
  } = useForm<UserTypes>({
    resolver: zodResolver(userSchema),
  });
  const navigate = useNavigate();
  useEffect(() => {
    if (authInitialized && accessToken) {
      navigate("/allTasks", { replace: true });
    }
  }, [accessToken, authInitialized]);

  const SignupMutation = useMutation({
    mutationFn: async (data: UserTypes) => {
      await signup(data);
    },
    onSuccess: (data) => {
      console.log("signup success", data);
      toast.success("Signup successful!");
    },
    onError: (error) => {
      console.log("signup failed", error);
    },
  });

  const onSubmit = (data: UserTypes) => {
    SignupMutation.mutate(data);
  };

  const [showPassword, setShowPassword] = useState(true);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <>
      <Toaster position="top-center" />
      {!authInitialized || isLoading ? (
        <div className="flex bg-main items-center justify-center h-screen w-full">
          <svg
            aria-hidden="true"
            className="w-10 h-10 mr-2 text-primary animate-spin"
            viewBox="0 0 100 101"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
              fill="currentColor"
            />
            <path
              d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
              fill="currentFill"
            />
          </svg>
        </div>
      ) : isAuthenticated ? null : (
        <div className="w-full sm:bg-main flex items-center justify-center px-4 sm:px-6 py-8">
          <div className="w-full max-w-md">
            <div className="sm:bg-white sm:p-8 sm:rounded-lg sm:shadow-lg sm:border sm:border-gray-200">
              <div className="mb-6 flex justify-center">
                <Logo text="Tarea" altText="App Logo" />
              </div>

              <h2 className="text-base font-bold text-center text-gray-900 mb-6">
                Create your account
              </h2>

              <div>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                  <div>
                    <label
                      htmlFor="username"
                      className="block text-sm font-medium text-gray-900"
                    >
                      Username
                    </label>
                    <div className="mt-1">
                      <input
                        {...register("username", {
                          onChange: () => {
                            if (errors.root) {
                              clearErrors("root"); // Clears the root error
                            }
                          },
                        })}
                        type="text"
                        autoComplete="username"
                        className={`username  block w-full rounded-md bg-white px-3 py-1.5 text-sm text-gray-900 focus:outline focus:outline-2 focus:-outline-offset-2 outline outline-1 -outline-offset-1 placeholder:text-gray-400 ${
                          errors.username || errors.root
                            ? "outline-red-500 focus:outline-red-500"
                            : "outline-gray-300 focus:outline-dmain"
                        }`}
                      />
                      {errors.username ? (
                        <p className="text-red-500 text-sm h-4 pt-1">
                          {errors.username.message}
                        </p>
                      ) : (
                        <div className="h-4 pt-1"></div>
                      )}
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-gray-900"
                    >
                      Email address
                    </label>
                    <div className="mt-1">
                      <input
                        {...register("email", {
                          onChange: () => {
                            if (errors.root) {
                              clearErrors("root"); // Clears the root error
                            }
                          },
                        })}
                        type="email"
                        autoComplete="email"
                        className={`block w-full rounded-md bg-white px-3 py-1.5 text-sm text-gray-900 focus:outline focus:outline-2 focus:-outline-offset-2 outline outline-1 -outline-offset-1 placeholder:text-gray-400 ${
                          errors.email || errors.root
                            ? "outline-red-500 focus:outline-red-500"
                            : "outline-gray-300 focus:outline-dmain"
                        }`}
                      />
                      {errors.email ? (
                        <p className="text-red-500 text-sm h-4 pt-1">
                          {errors.email.message}
                        </p>
                      ) : (
                        <div className="h-4 pt-1"></div>
                      )}
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="password"
                      className="block text-sm font-medium text-gray-900"
                    >
                      Password
                    </label>
                    <div className="mt-1 relative">
                      <input
                        {...register("password", {
                          onChange: () => {
                            if (errors.root) {
                              clearErrors("root"); // Clears the root error
                            }
                          },
                        })}
                        type={showPassword ? "password" : "text"}
                        autoComplete="off"
                        className={` block w-full rounded-md bg-white px-3 py-1.5 text-sm text-gray-900 focus:outline focus:outline-2 focus:-outline-offset-2 outline outline-1 -outline-offset-1 placeholder:text-gray-400 ${
                          errors.password || errors.root
                            ? "outline-red-500 focus:outline-red-500"
                            : "outline-gray-300 focus:outline-dmain"
                        }`}
                      />
                      {errors.password ? (
                        <p className="text-red-500 text-sm h-4 pt-1">
                          {errors.password.message}
                        </p>
                      ) : (
                        <div className="h-4 pt-1"></div>
                      )}
                      <button
                        type="button"
                        onClick={togglePasswordVisibility}
                        className="absolute right-0 top-1/2 -translate-y-1/2 -mt-[7px] pr-3 text-gray-500 hover:text-gray-700 focus:outline-none"
                        aria-label={
                          showPassword ? "Hide password" : "Show password"
                        }
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center mt-2">
                    <input
                      id="terms"
                      name="terms"
                      type="checkbox"
                      required
                      className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                    />
                    <label
                      htmlFor="terms"
                      className="ml-2 block text-sm text-gray-500"
                    >
                      I agree to the terms and services of{" "}
                      <a
                        href="#"
                        className="font-semibold text-indigo-500 hover:text-indigo-600"
                      >
                        Tarea
                      </a>
                    </label>
                  </div>

                  <div className="mt-2">
                    <button
                      type="submit"
                      disabled={SignupMutation.isPending}
                      className="flex w-full justify-center rounded-md bg-primary px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-color-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                    >
                      {SignupMutation.isPending ? (
                        <>
                          <svg
                            aria-hidden="true"
                            className="w-5 h-5 mr-2 text-white animate-spin"
                            viewBox="0 0 100 101"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                              fill="currentColor"
                            />
                            <path
                              d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                              fill="currentFill"
                            />
                          </svg>
                        </>
                      ) : (
                        "Sign up"
                      )}
                    </button>
                  </div>

                  {/* Divider */}
                  <div className="relative py-2">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-300"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="bg-white px-2 text-gray-500">Or</span>
                    </div>
                  </div>

                  {/* Google Sign Up Button */}
                  <div>
                    <button
                      type="button"
                      className="flex w-full justify-center items-center gap-2 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-offset-0"
                    >
                      <img src={google} alt="Google logo" className="h-5 w-5" />
                      Continue with Google
                    </button>
                  </div>
                </form>
                <p className="mt-6 text-center text-sm text-gray-500">
                  Already have an account?{" "}
                  <Link
                    to={"/login"}
                    className="font-semibold text-indigo-500 hover:text-indigo-600"
                  >
                    Sign in
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default SignUp;
