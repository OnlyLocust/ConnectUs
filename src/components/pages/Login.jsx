import React from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import Link from "next/link";

import { Separator } from "@/components/ui/separator";
import AuthPageWrapper from "../common/authPage/AuthPageWrapper";
import LoginForm from "../common/authPage/LoginForm";
import GoogleAuth from "../common/authPage/GoogleAuth";

const Login = () => {
  return (
    <AuthPageWrapper>
      <Card className="shadow-lg">
        <CardHeader className="space-y-1">
          <h2 className="text-2xl font-semibold text-center">Welcome back</h2>
          <p className="text-sm text-center text-gray-500">
            Enter your credentials to access your account
          </p>
        </CardHeader>

        <CardContent className="spac  e-y-4">
          <LoginForm />

          <Separator className="my-6" />

          <GoogleAuth/>
        </CardContent>

        <CardFooter className="flex justify-center">
          <p className="text-sm text-gray-600">
            Don't have an account?{" "}
            <Link
              href="/signup"
              className="font-medium text-blue-600 hover:text-blue-800 hover:underline"
            >
              Sign up
            </Link>
          </p>
        </CardFooter>
      </Card>
    </AuthPageWrapper>
  );
};

export default Login;
