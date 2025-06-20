"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { useDispatch } from "react-redux";
import { setAuth, setNotRead } from "@/store/authSlice";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import EmailInput from "./EmailInput";
import PasswordInput from "./PasswordInput";
import { API_URL } from "@/constants/constant";

const LoginForm = () => {
  const dispatch = useDispatch();
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({
    email: "",
    password: "",
  });

  useEffect(() => {
    router.prefetch("/home");
  }, [router]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleForgotPassword = () => {
    toast.info("Password reset feature coming soon!");
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      setIsLoading(true);

      const res = await axios.post(`${API_URL}/auth/login`, formData, {
        withCredentials: true,
      });

      if (res.data.success) {
        toast.success(res.data.message);
        dispatch(setAuth(res.data.user));
        dispatch(setNotRead({ type: "set", notRead: res.data.notRead }));

        setTimeout(() => {
          router.push("/home");
        }, 300);

      } else {
        throw new Error(res.data.message || "Login failed");
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || error.message || "Login failed";
      toast.error(errorMessage);

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

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <EmailInput
        value={formData.email}
        onChange={handleChange}
        errors={errors.email}
      />

      <PasswordInput
        value={formData.password}
        onChange={handleChange}
        errors={errors.password}
      />

      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2" />
        <Button
          variant="link"
          type="button"
          className="text-sm h-auto p-0 text-blue-600 hover:text-blue-800"
          onClick={handleForgotPassword}
        >
          Forgot password?
        </Button>
      </div>

      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Logging in...
          </>
        ) : (
          "Log In"
        )}
      </Button>
    </form>
  );
};

export default LoginForm;
