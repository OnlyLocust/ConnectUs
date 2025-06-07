import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import axios from "axios";
import { API_URL } from "@/constants/constant";
import { Mail, Lock, User, Loader2 } from "lucide-react";
import { setAuth } from "@/store/authSlice";
import { toast } from "sonner";
import { Label } from "../ui/label";
import { Separator } from "../ui/separator";

const Signup = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({
    username: "",
      email: "",
      password: "",
    });

    useEffect(() => {
      router.prefetch('/home')
    })

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user types
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForm = () => {
    let valid = true;
    const newErrors = { email: "", password: "" };

    if (!formData.email) {
      newErrors.email = "Email is required";
      valid = false;
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
      valid = false;
    }

    if(!formData.username) {
      newErrors.username = "Username is required";
      valid = false;
    } else if (formData.username.length < 3) {
      newErrors.username = "Username must be at least 3 characters long";
      valid = false;
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
      valid = false;
    } else if (formData.password.length < 4) {
      newErrors.password = "Password must be at least 6 characters";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const signupHandler = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      setIsLoading(true);
      const res = await axios.post(`${API_URL}/auth/signup`, formData);
      
      if (res.data.success) {
        toast.success(res.data.message);
        dispatch(setAuth(res.data.user));
        router.push('/home');
      } else {
        throw new Error(res.data.message || "Login failed");
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || "Login failed";
      toast.error(errorMessage);
      
      // Handle specific API errors
      if (error.response?.data?.error === "Invalid credentials") {
        setErrors({
          email: " ",
          password: "Invalid email or password",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  // const signupHandler = async (e) => {
  //   e.preventDefault();

  //   // Basic validation
  //   if (!username.trim() || !email.trim() || !password) {
  //     toast.error("Please fill in all fields");
  //     return;
  //   }

  //   if (password.length < 6) {
  //     toast.error("Password should be at least 6 characters");
  //     return;
  //   }

  //   try {
  //     setIsLoading(true);
  //     const res = await axios.post(`${API_URL}/auth/signup`, {
  //       username,
  //       email,
  //       password,
  //     });
  //     if (res.data.success) {
  //       toast.success("Sign-up successful! Welcome aboard!");
  //       dispatch(setAuth(res.data.user));
  //       router.push("/home");
  //     } else {
  //       throw new Error(res.data.message || "Signup failed");
  //     }
  //   } catch (error) {
  //     toast.error(
  //       error.response?.data?.message || error.message || "Signup failed"
  //     );
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Logo/App Name */}
        <div className="text-center">
          <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 mb-2">
            SocialConnect
          </h1>
          <p className="text-gray-600">
            Connect with friends and the world around you
          </p>
        </div>

        {/* Login Card */}
        <Card className="shadow-lg">
          <CardHeader className="space-y-1">
            <h2 className="text-2xl font-semibold text-center">Welcome New User</h2>
            <p className="text-sm text-center text-gray-500">
              Create Your Account
            </p>
          </CardHeader>

          <CardContent className="space-y-4">
            <form onSubmit={signupHandler} className="space-y-4">
              
              {/* Username Field */}

              <div className="space-y-2">
                <Label htmlFor="username">Uername</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="username"
                    name="username"
                    type="text"
                    placeholder="username"
                    value={formData.username}
                    onChange={handleChange}
                    className={`pl-10 `}
                  />
                </div>
              </div>

              {/* Email Field */}
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="your@email.com"
                    value={formData.email}
                    onChange={handleChange}
                    className={`pl-10 ${errors.email ? "border-red-500" : ""}`}
                  />
                </div>
                {errors.email && (
                  <p className="text-sm text-red-500">{errors.email}</p>
                )}
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={handleChange}
                    className={`pl-10 ${
                      errors.password ? "border-red-500" : ""
                    }`}
                  />
                </div>
                {errors.password && (
                  <p className="text-sm text-red-500">{errors.password}</p>
                )}
              </div>

              {/* Submit Button */}
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Signing in...
                  </>
                ) : (
                  "Sign up"
                )}
              </Button>
            </form>

            <Separator className="my-6" />

            {/* Social Login Options */}
            <div className="space-y-3">
              <Button variant="outline" className="w-full">
                <svg
                  className="mr-2 h-4 w-4"
                  aria-hidden="true"
                  focusable="false"
                  data-prefix="fab"
                  data-icon="google"
                  role="img"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 488 512"
                >
                  <path
                    fill="currentColor"
                    d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"
                  ></path>
                </svg>
                Continue with Google
              </Button>
            </div>
          </CardContent>

          <CardFooter className="flex justify-center">
            <p className="text-sm text-gray-600">
              Already have an account?{" "}
              <Link
                href="/"
                className="font-medium text-blue-600 hover:text-blue-800 hover:underline"
              >
                Log in
              </Link>
            </p>
          </CardFooter>
        </Card>

        {/* App Info */}
        <div className="text-center text-sm text-gray-500">
          <p>
            © {new Date().getFullYear()} SocialConnect. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
