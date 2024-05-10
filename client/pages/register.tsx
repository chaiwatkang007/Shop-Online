import React, { useState } from "react";
import { Alert, Button, message } from "antd";
import axios from "axios";
import Router from "next/router";
import Swal from "sweetalert2";
export default function Register() {
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const currenttime = new Date();

  const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@(hotmail|gmail)\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const Toast = Swal.mixin({
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.onmouseenter = Swal.stopTimer;
      toast.onmouseleave = Swal.resumeTimer;
    }
  });

  const passwordStrong = (password) => {
    const strongRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return strongRegex.test(password);
  };

  const _handleRegister = async () => {
    try {
      if (!username || !password || !email) {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Please enter an email, username, and password",
        });
        return;
      }

      if (!isValidEmail(email)) {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Email must end with @hotmail.com or @gmail.com",
        });
        return;
      }

      if (!passwordStrong(password)) {
        Swal.fire({
          icon: "error",
          title: "Error",
          text:
            "Password must contain at least one lowercase letter, one uppercase letter, one digit, one special character, and be at least 8 characters long.",
        });
        return;
      }

      const result = await axios({
        method: "post",
        maxBodyLength: Infinity,
        url: "/api/user/create",
        headers: {
          "Content-Type": "application/json",
        },
        data: JSON.stringify({
          email: email,
          username: username,
          password: password,
          createdDay: currenttime.toISOString().slice(0, 10),
          role: "user",
        }),
      });
      if (result?.data?.result?.id) {
        console.log("Sign Up successful!");
        await axios.post("/api/log/addlog", {
          event_happening: `${username} new user signed up `,
        });
        Toast.fire({
          icon: "success",
          title: "Signed in successfully"
        });
        setTimeout(() => {
          Router.push(`/login`);
        },3000)
      }
    } catch (errorMessage: any) {
      if (axios.isAxiosError(errorMessage)) {
        if (errorMessage.response) {
          setErrorMessage("มีผู้ใช้งานนี้ในระบบแล้ว");
        }
      }
    }
  };

  return (
    <main className="bg">
      <title>Sign up to SeniorProject</title>
      <div className="register">
        <form>
          <div className="container">
            <label className="signup" htmlFor="signup">
              <b>
                <h1>SIGN UP</h1>
              </b>
            </label>
            <label htmlFor="uname">
              <b>Email</b>
            </label>
            <input
              type="text"
              placeholder="Enter Email"
              name="em"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
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
            <input
              type="password"
              placeholder="Enter Password"
              name="psw"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <Button
              className="buttonlogin"
              type="primary"
              onClick={_handleRegister}
            >
              SIGN UP
            </Button>
          </div>
          <div className="err">

          </div>
        </form>
      </div>
    </main>
  );
}
