import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import axios from "axios";
import { Loader2 } from "lucide-react";
import { setAuth } from "@/store/authSlice";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import EmailInput from "./EmailInput";
import PasswordInput from "./PasswordInput";
import UsernameInput from "./UsernameInput";
import { API_URL } from "@/constants/constant";

const SignupForm = () => {
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
    router.prefetch("/home");
  });

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

    if (!formData.username) {
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

        // setTimeout(() => {
        //   router.push("/home");
        // }, 1000);

        const checkCookieInterval = setInterval(() => {
          const cookies = document.cookie;


          if (cookies.includes("token")) {
            clearInterval(checkCookieInterval);
            router.push("/home"); 
          }
        }, 100);

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
    <form onSubmit={signupHandler} className="space-y-4">
      <UsernameInput value={formData.username} onChange={handleChange} />

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
  );
};

export default SignupForm;
