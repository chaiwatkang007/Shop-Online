import React, { useState } from "react";
import { Alert, Button, Col, Input } from "antd";
import axios from "axios";
import Router from "next/router";
import ReCAPTCHA from "react-google-recaptcha";
import Link from "next/link";
import { EyeInvisibleOutlined, EyeOutlined } from "@ant-design/icons";
import Swal from 'sweetalert2'


export default function Login() {
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [recaptchaResponse, setRecaptchaResponse] = useState<string>("");
  const [isCaptchaVerified, setIsCaptchaVerified] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const handleCaptchaVerify = (token: string | null) => {
    setIsCaptchaVerified(true);
    setRecaptchaResponse(token || "");
  };

  const Toast = Swal.mixin({
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer: 2000,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.onmouseenter = Swal.stopTimer;
      toast.onmouseleave = Swal.resumeTimer;
    }
  });

  const verifyRecaptcha = async (recaptchaResponse: string) => {
    const secretKey = "6Lcoi9onAAAAAJ_rNHdtMM7EGmubvFQC8slUHiTt";
    const verificationUrl = "https://www.google.com/recaptcha/api/siteverify";
    try {
      const response = await axios.post(verificationUrl, null, {
        params: {
          secret: secretKey,
          response: recaptchaResponse,
        },
      });

      const responseData = response.data;
      return responseData.success;
    } catch (error) {
      console.error("Error verifying reCAPTCHA:", error);
      return false;
    }
  };

  const _handleLogin = async () => {
    try {
      if (!username || !password) {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Please enter a username password",
        });
        return;
      }

      if (!isCaptchaVerified) {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Please verify the ReCAPTCHA",
        });
        return;
      }

      const isRecaptchaValid = await verifyRecaptcha(recaptchaResponse);

      const result = await axios({
        method: "post",
        maxBodyLength: Infinity,
        url: "/api/auth/signin",
        headers: {
          "Content-Type": "application/json",
        },
        data: JSON.stringify({
          username: username,
          password: password,
        }),
      });
      if (result?.data?.result?.id) {
        console.log(result?.data?.result?.id);
        console.log("Login successful!");
        localStorage.setItem("usernamelogin", username);
        localStorage.setItem("role", result.data.result.role);
        localStorage.setItem("uuiduser", result.data.result.id);
        Toast.fire({
          icon: "success",
          title: "Signed in successfully"
        });
        setTimeout(() => {
          Router.push(`/dashboard`);
        },2000)
      }
    } catch (errorMessage: any) {
      if (axios.isAxiosError(errorMessage)) {
        if (errorMessage.response) {
          setErrorMessage("Invalid username or password");
        }
      }
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "ไม่มีผู้ใช้งานนี้ในระบบ",
      });
      console.log("err=========>", errorMessage);
    }
  };

  return (
    <main className="bg">
      <title>Sign in to SeniorProject</title>
      <div className="beforelogin">
        <form>
          <div className="container">
            <label className="signin" htmlFor="signin">
              <b>
                <h1>SIGN IN</h1>
              </b>
            </label>
            <label htmlFor="uname">
              <b>Username</b>
            </label>
            <input
              type="text"
              placeholder="Enter Username"
              name="uname"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <label htmlFor="psw">
              <b>Password</b>
            </label>
            <Input
              type={showPassword ? "text" : "password"}
              placeholder="Enter Password"
              name="psw"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              suffix={
                showPassword ? (
                  <EyeInvisibleOutlined
                    onClick={() => setShowPassword(!showPassword)}
                    style={{ cursor: "pointer" }}
                  />
                ) : (
                  <EyeOutlined
                    onClick={() => setShowPassword(!showPassword)}
                    style={{ cursor: "pointer" }}
                  />
                )
              }
            />
            
            <div className="cc">
              <ReCAPTCHA
                sitekey="6Lcoi9onAAAAAMeXsjmOo05DRzAg1g3yuJqx9yqS"
                onChange={handleCaptchaVerify}
              />
            </div>
            <Button
              className="buttonlogin"
              type="primary"
              onClick={_handleLogin}
            >
              Login
            </Button>
          </div>
        </form>
      </div>
    </main>
  );
}
