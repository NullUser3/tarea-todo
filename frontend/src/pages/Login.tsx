import { useEffect } from 'react';
import Logo from '../components/Logo';
import google from '../images/search.png'
import { useState } from 'react';
import { Checkbox } from '@headlessui/react';
import { CheckIcon } from '@heroicons/react/16/solid'
import { useForm} from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';
import toast,{ Toaster } from 'react-hot-toast';
import {z} from 'zod';
import { zodResolver } from "@hookform/resolvers/zod";
import { data,Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
const ABU = process.env.REACT_APP_API;


const userSchema = z.object({
	usernameOrEmail: z.string().min(1,"Username/email is required"),
	password:z.string().min(1,"Password is required"),
})

type LoginFields = z.infer<typeof userSchema>;



  export const Login = () => {
	const [isChecked, setIsChecked] = useState<boolean>(false);
	const {login,accessToken,authInitialized,isLoading,isAuthenticated} = useAuth();
	const [showPassword, setShowPassword] = useState(true);
	  
		const togglePasswordVisibility = () => {
		  setShowPassword(!showPassword);
		};
	const navigate = useNavigate();
	useEffect(() => {
  if (authInitialized && accessToken) {
    navigate("/allTasks", { replace: true });
  }
}, [accessToken, authInitialized]);

	const {register,handleSubmit,formState:{errors},setError,clearErrors} = useForm<LoginFields>({
		resolver:zodResolver(userSchema),
	});

  const loginMutation = useMutation({
	
	mutationFn: async (data:LoginFields)=>{
		await login(data);
	},
	onSuccess: (data)=>{
		console.log("login success: ",data)
		toast.success("Login successful!");
	},
	onError:(e)=>{
		console.error("login failed: ",e);
		setError("root", {
			type: "manual",
			message: "Invalid username or password"
		  });
		toast.error("Invalid username or password");
	}
  })

  const onSubmit = (data:LoginFields)=>{
	loginMutation.mutate(data);
  }

  
	return (
		<>
		{
			!authInitialized || isLoading ? (
  <div className='flex bg-main items-center justify-center h-screen w-full'>
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
) : isAuthenticated ? (
  null
) : (<div className="bg-main sm:bg-main w-screen h-screen overflow-x-hidden ">
		<Toaster position="top-center" />
	  <div className="flex min-h-screen flex-col lg:flex-row">
		{/* Left Column - Image/Branding */}
		<div className="hidden lg:basis-2/3 lg:flex lg:w-1/2 bg-primary flex-col justify-center items-center">
		  <div className="text-center text-white p-8">
			<h1 className="mt-6 text-3xl font-bold">Welcome Back</h1>
			<p className="mt-4 text-lg max-w-md">
			  Manage your tasks efficiently and stay organized with Tarea.
			</p>
		  </div>
		  {/* You could add an illustration or image here */}
		  <div className="p-16">
			<div className="bg-white/10 p-6 rounded-lg">
			  <p className="text-white italic">
				"Tarea has completely transformed how our team manages projects. 
				We've increased productivity by 30% since implementing it."
			  </p>
			  <p className="mt-4 text-white font-semibold">Jane Smith, Product Manager</p>
			</div>
		  </div>
		</div>
  
		{/* Right Column - Login Form */}
		<div className="w-full bg-white sm:bg-main lg:w-1/2 flex items-center justify-center px-4 sm:px-6 py-8">
		  <div className="w-full max-w-md">
			<div className="sm:bg-white sm:p-8 sm:rounded-lg sm:shadow-lg sm:border sm:border-gray-200">
			  <div className="mb-6 flex justify-center">
				<Logo
				  text="Tarea"
				  altText="App Logo"
				/>
			  </div>
			  
			  <div>
				<form className='space-y-5' onSubmit={handleSubmit(onSubmit)}>
				  <div>
					<label htmlFor="email" className="block text-sm font-medium text-gray-900">
					  Username or Email address
					</label>
					<div className="mt-2">
					  <input
					  {...register("usernameOrEmail",{
						onChange: () => {
						  if (errors.root) {
							clearErrors("root"); // Clears the root error
						  }
						}},)} 
						type="text"
						autoComplete='username'
						className={`username  block w-full rounded-md bg-white px-3 py-1.5 text-sm text-gray-900 focus:outline focus:outline-2 focus:-outline-offset-2 outline outline-1 -outline-offset-1 placeholder:text-gray-400 ${errors.usernameOrEmail||errors.root?"outline-red-500 focus:outline-red-500":"outline-gray-300 focus:outline-dmain"}`}
					  />
					  {errors.usernameOrEmail?(
						<p className='text-red-500 text-sm h-4 pt-1'>{errors.usernameOrEmail.message}</p>
					  ):(<div className='h-4 pt-1'></div>)}
					</div>
				  </div>
				  <div>
					<div className="flex items-center justify-between">
					  <label htmlFor="password" className="block text-sm font-medium text-gray-900">
						Password
					  </label>
					  <div className="text-sm">
						<a href="#" className="font-semibold text-indigo-600 hover:text-indigo-500">
						  Forgot your password?
						</a>
					  </div>
					</div>
					<div className="mt-2 relative">
					  <input
					  {...register("password",{
						onChange: () => {
						  if (errors.root) {
							clearErrors("root"); // Clears the root error
						  }
						}},)}
						type={showPassword ?  "password":"text"}
						autoComplete="current-password"
						className={`password  block w-full rounded-md bg-white px-3 py-1.5 text-sm text-gray-900 focus:outline focus:outline-2 focus:-outline-offset-2 outline outline-1 -outline-offset-1 placeholder:text-gray-400 ${errors.password||errors.root?"outline-red-500 focus:outline-red-500":"outline-gray-300 focus:outline-dmain"}`}
					  />
					  {errors.password?(
						<p className='text-red-500 text-sm h-4 pt-1'>{errors.password.message}</p>
					  ):(<div className='h-4 pt-1'></div>)}
					  <button
												type="button"
												onClick={togglePasswordVisibility}
												className="absolute right-0 top-1/2 -translate-y-1/2 -mt-[7px] pr-3 text-gray-500 hover:text-gray-700 focus:outline-none"
												aria-label={showPassword ? "Hide password" : "Show password"} >
												{showPassword ? (
												  <EyeOff className="h-4 w-4" />
												) : (
												  <Eye className="h-4 w-4" />
												)}
											  </button>
					</div>
				  </div>
				  <div className="flex items-center">
				  <Checkbox className='mr-2 group size-[18px] hover:cursor-pointer rounded-md bg-gray/10 ring-1 ring-darko dark:ring-gray-200 ring-inset data-[checked]:ring-transparent'
									  checked={isChecked}
									  onChange={(checked) => setIsChecked(checked)}
									  >
									  <CheckIcon className="opacity-0 rounded-md size-[18px] fill-main dark:fill-gray-700 bg-primary dark:bg-gray-200 group-data-[checked]:opacity-100" />
									  </Checkbox>
					<label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
					  Remember me
					</label>
				  </div>
				  <div>
					<button
					  type="submit"
					  disabled={loginMutation.isPending}
					  className="flex w-full justify-center rounded-md bg-primary px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-color-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
					>
					  {loginMutation.isPending ? (
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
                      "Sign in"
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
				  
				  {/* Google Sign In Button */}
<div>
  <button
    type="button"
    className="flex w-full justify-center items-center gap-2 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-offset-0"
  >
    <img 
      src={google}
      alt="Google logo" 
      className="h-5 w-5" 
    />
    Continue with Google
  </button>
</div>
				</form>
				<p className="mt-6 text-center text-sm text-gray-500">
				you don't have an account?{' '}
				  <Link to={"/register"} className="font-semibold text-indigo-600 hover:text-indigo-500">
					Sign-up now
				  </Link>
				</p>
			  </div>
			</div>
		  </div>
		</div>
	  </div>
	</div>)
		}
	</>
  );
}

