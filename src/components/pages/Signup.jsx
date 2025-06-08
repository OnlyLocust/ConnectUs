import React from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import Link from "next/link";
import { Separator } from "../ui/separator";
import AuthPageWrapper from "../common/authPage/AuthPageWrapper";
import SignupForm from "../common/authPage/SignupForm";
import GoogleAuth from "../common/authPage/GoogleAuth";

const Signup = () => {
  return (
    <AuthPageWrapper>
      <Card className="shadow-lg">
        <CardHeader className="space-y-1">
          <h2 className="text-2xl font-semibold text-center">
            Welcome New User
          </h2>
          <p className="text-sm text-center text-gray-500">
            Create Your Account
          </p>
        </CardHeader>

        <CardContent className="space-y-4">
          <SignupForm />

          <Separator className="my-6" />

          {/* Social Login Options */}
          <GoogleAuth/>
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
    </AuthPageWrapper>
  );
};

export default Signup;
