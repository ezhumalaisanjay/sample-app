"use client";

import { useState, useEffect, ChangeEvent, FormEvent } from "react";
import axios from "axios";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff } from "lucide-react";
import Image from "next/image";
import Logo from "../images/squadLogo.png";

interface LoginComponent {
  handleLogin: () => void;
}

export default function Signup({ handleLogin }: LoginComponent) {
  const [form, setForm] = useState({
    tenant_name: "",
    admin_name: "",
    admin_email: "",
    admin_password: "",
    phone_number: "",
  });

  const [message, setMessage] = useState("");
  const [confirmationCode, setConfirmationCode] = useState("");
  const [clientId, setClientId] = useState<string | null>(null);
  const [userPoolId, setUserPoolId] = useState<string | null>(null);
  const [identityPoolId, setIdentityPoolId] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isSignupCompleted, setIsSignupCompleted] = useState(false);

  useEffect(() => {
    setClientId(localStorage.getItem("client_id"));
    setUserPoolId(localStorage.getItem("user_pool_id"));
    setIdentityPoolId(localStorage.getItem("identity_pool_id"));
    setUserId(localStorage.getItem("user_id"));
  }, []);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };




  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const handleSubmitSignUp = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsConfirmed(true);

    try {
      const response = await axios.post("/api/registerTenant", {
        ...form,
        action: "sign_up",
      });

      if (response.data?.data) {
        const parsedData = JSON.parse(response.data.data.body);
        const { client_id, user_pool_id, identity_pool_id, UserId } =
          parsedData;

        if (client_id && user_pool_id && identity_pool_id && UserId) {
          setClientId(client_id);
          setUserPoolId(user_pool_id);
          setIdentityPoolId(identity_pool_id);
          setUserId(UserId);

          localStorage.setItem("client_id", client_id);
          localStorage.setItem("user_pool_id", user_pool_id);
          localStorage.setItem("identity_pool_id", identity_pool_id);
          localStorage.setItem("user_id", UserId);

          setIsSignupCompleted(true);
          setMessage(
            "✅ Sign-up successful! Check your email for the confirmation code."
          );
        } else {
          throw new Error("Missing required response data.");
        }
      }
    } catch (error: any) {
      setMessage("❌ " + (error.response?.data?.message || error.message));
    }
    setIsConfirmed(false);
  };

  const handleConfirmSignup = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsConfirmed(true);

    const storedClientId = localStorage.getItem("client_id") || clientId;
    const storedUserPoolId = localStorage.getItem("user_pool_id") || userPoolId;
    const storedIdentityPoolId =
      localStorage.getItem("identity_pool_id") || identityPoolId;
    const storedUserId = localStorage.getItem("user_id") || userId;


    if (
      !storedClientId ||
      !storedUserPoolId ||
      !storedIdentityPoolId ||
      !storedUserId ||
      !form.admin_email ||
      !confirmationCode
    ) {
      setMessage("❌ Missing required fields. Please sign up again.");
      setIsConfirmed(false);
      return;
    }

    try {
      await axios.post("/api/registerTenant", {
        tenant_name: form.tenant_name,
        admin_name: form.admin_name,
        admin_email: form.admin_email,
        admin_password: form.admin_password,
        phone_number: form.phone_number,
        client_id: storedClientId,
        user_pool_id: storedUserPoolId,
        identity_pool_id: storedIdentityPoolId,
        UserId: storedUserId,
        action: "confirm_sign_up",
        
        
        confirmationCode,
      });

      setMessage("✅ Account confirmed successfully! Redirecting to login...");
      setTimeout(() => handleLogin(), 2000);
    } catch (error: any) {
      setMessage("❌ " + (error.response?.data?.message || error.message));
    }
    setIsConfirmed(false);
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="p-8 rounded-lg shadow-md w-96">
        <div className="flex flex-col items-center text-center mb-4">
          <Image src={Logo} alt="logo" width={200} height={200} />
        </div>
        <h2 className="text-2xl font-bold text-center mb-6">
          {isSignupCompleted ? "Confirm Sign-Up" : "Sign Up"}
        </h2>

        {!isSignupCompleted ? (
          <form onSubmit={handleSubmitSignUp}>
            <div className="grid gap-2">
              <Label>Company Name</Label>
              <Input
                type="text"
                name="tenant_name"
                onChange={handleChange}
                required
              />

              <Label>Full Name</Label>
              <Input
                type="text"
                name="admin_name"
                onChange={handleChange}
                required
              />

              <Label>Email address</Label>
              <Input
                type="email"
                name="admin_email"
                onChange={handleChange}
                required
              />

              <Label>Phone Number</Label>
              <Input
                type="tel"
                name="phone_number"
                onChange={handleChange}
                required
              />

              <Label>Password</Label>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  name="admin_password"
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
                    <EyeOff className="size-5" />
                  )}
                </span>
              </div>
            </div>
            <Button type="submit" className="w-full mt-4">
              {isConfirmed ? "Signing Up..." : "Sign Up"}
            </Button>
          </form>
        ) : (
          <form onSubmit={handleConfirmSignup}>
            <Label>Confirmation Code</Label>
            <Input
              type="text"
              onChange={(e) => setConfirmationCode(e.target.value)}
              required
            />
            <Button type="submit" className="w-full mt-4">
              {isConfirmed ? "Confirming..." : "Confirm Signup"}
            </Button>
          </form>
        )}

        {message && <p className="mt-3 text-center">{message}</p>}
      </div>
    </div>
  );
}
