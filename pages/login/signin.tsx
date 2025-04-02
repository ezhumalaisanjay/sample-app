"use client";

import { useState } from "react";
import axios from "axios";
import { signIn } from "../../lib/auth/auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeClosed, Loader } from "lucide-react";
import Logo from "../images/squadLogo.png";
import Image from "next/image";
import { useRouter } from "next/router";

interface TenantResponse {
  UserPoolId: string;
  ClientId: string;
  TenantData: { 
    group_name?: string;
    admin_email?: string;
   };
}

interface LoginFormProps {
  handleLogin: () => void;
}

export default function LoginForm({ handleLogin }: LoginFormProps) {
  const [form, setForm] = useState({ email: "", password: "", mfaCode: "" });
  const [message, setMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [challengeName, setChallengeName] = useState<string | null>(null);
  const [cognitoUser, setCognitoUser] = useState<any>(null);
  const [groupName, setGroupName] = useState<string | null>(null);
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prevState) => !prevState);
  };

  const handleSubmitSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoggingIn(true);
    setMessage("");

    try {
      const { data }: { data: TenantResponse } = await axios.post(
        "/api/getTenantUserPool",
        {
          email: form.email,
        }
      );

      if (!data?.UserPoolId || !data?.ClientId || !data?.TenantData) {
        throw new Error("Tenant authentication failed.");
      }

      localStorage.setItem("email", data?.TenantData.admin_email || "");

      setGroupName(data.TenantData.group_name || "");

      const response = await signIn(
        form.email,
        form.password,
        data.UserPoolId,
        data.ClientId,
        router,
      );

      if (response?.success) {
        setMessage("✅ Sign-in successful!");
        router.push(
          (data.TenantData.group_name || "") === "tenant"
            ? "/tenant/dashboard"
            : "/employee/dashboard"
        );
      } else if (
        response.challengeName === "SMS_MFA" ||
        response.challengeName === "SOFTWARE_TOKEN_MFA"
      ) {
        setChallengeName(response.challengeName);
        setCognitoUser(response.cognitoUser);
      } else {
        setMessage("❌ Sign-in failed!");
      }
    } catch (err: any) {
      console.error("❌ Sign-in error:", err.message);
      setMessage("Sign-in failed: " + err.message);
    }

    setIsLoggingIn(false);
  };

  const handleVerifyMFA = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cognitoUser || !form.mfaCode) {
      setMessage("❌ Please enter the MFA code.");
      return;
    }

    cognitoUser.sendMFACode(
      form.mfaCode,
      {
        onSuccess: (session: any) => {
          // ✅ Ensure session is used inside the callback
          console.log("✅ MFA Verification successful!", session);
          setMessage("✅ Login successful!");
          router.push(
            (groupName || "") === "tenant" ? "/tenant/dashboard" : "/employee/dashboard"
          );
        },
        onFailure: (err: any) => {
          console.error("❌ MFA verification failed:", err.message);
          setMessage("MFA verification failed: " + err.message);
        },
      },
      "SOFTWARE_TOKEN_MFA"
    );
  };

  return (
    <div className="flex min-h-screen w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <Card>
          <CardContent className="grid p-0">
            {challengeName ? (
              <form className="p-6 md:p-8 w-full" onSubmit={handleVerifyMFA}>
                <div className="flex flex-col items-center text-center">
                  <Image src={Logo} alt="logo" width={200} height={200} />
                  <h2 className="mt-3 text-lg font-semibold">Enter MFA Code</h2>
                </div>
                <div className="grid gap-2 mt-4">
                  <Label htmlFor="mfaCode">MFA Code</Label>
                  <Input
                    id="mfaCode"
                    name="mfaCode"
                    type="text"
                    placeholder="Enter the code"
                    value={form.mfaCode}
                    onChange={handleChange}
                    required
                  />
                </div>
                <Button type="submit" className="w-full mt-4">
                  {isLoggingIn ? <Loader className="animate-spin" /> : "Verify"}
                </Button>
                {message && (
                  <p className="mt-3 text-center text-red-500">{message}</p>
                )}
              </form>
            ) : (
              <form className="p-6 md:p-8 w-full" onSubmit={handleSubmitSignIn}>
                <div className="flex flex-col gap-6">
                  <div className="flex flex-col items-center text-center">
                    <Image src={Logo} alt="logo" width={200} height={200} />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="m@example.com"
                      value={form.email}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="password">Password</Label>
                    <div className="relative">
                      <Input
                        id="password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        value={form.password}
                        onChange={handleChange}
                        required
                      />
                      <span
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer"
                        onClick={togglePasswordVisibility}
                      >
                        {showPassword ? (
                          <Eye className="size-5" />
                        ) : (
                          <EyeClosed className="size-5" />
                        )}
                      </span>
                    </div>
                  </div>
                  <Button type="submit" className="w-full">
                    {isLoggingIn ? (
                      <Loader className="animate-spin" />
                    ) : (
                      "Login"
                    )}
                  </Button>
                  {message && (
                    <p
                      className={`mt-3 text-center ${
                        message.includes("successful")
                          ? "text-green-500"
                          : "text-red-500"
                      }`}
                    >
                      {message}
                    </p>
                  )}
                  <div className="text-center text-sm">
                    Don’t have an account?{" "}
                    <span
                      onClick={handleLogin}
                      className="underline cursor-pointer hover:text-primary"
                    >
                      Sign up
                    </span>
                  </div>
                </div>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
