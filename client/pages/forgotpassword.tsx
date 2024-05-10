import React, { useState } from "react";
import { Alert, Button, message } from "antd";
import axios from "axios";
import ReCAPTCHA from "react-google-recaptcha";
import Router from "next/router";


export default function Forgotpassword() {
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [recaptchaResponse, setRecaptchaResponse] = useState<string>("");
  const [isCaptchaVerified, setIsCaptchaVerified] = useState<boolean>(false);

  //ReCapcha
  const handleCaptchaVerify = (token: string | null) => {
    setIsCaptchaVerified(true);
    setRecaptchaResponse(token || "");
  };

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

  //สุ่มรหัสยืนยันเก็บไว้ใน database
  function generateVerificationCode(length: number): string {
    const characters = "0123456789";
    let code = "";
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      code += characters.charAt(randomIndex);
    }
    return code;
  }

  const _handleForgorpassword = async () => {
    try {
      if (!email) {
        setErrorMessage("Please enter your email");
        return;
      }

      if (!isCaptchaVerified) {
        setErrorMessage("Please verify the ReCAPTCHA");
        return;
      }

      const isRecaptchaValid = await verifyRecaptcha(recaptchaResponse);
      const verificationCode = generateVerificationCode(6);

      const result = await axios({
        method: "post",
        maxBodyLength: Infinity,
        url: "/api/user/sendmail",
        headers: {
          "Content-Type": "application/json",
        },
        data: JSON.stringify({
          email: email,
          verify: verificationCode,
        }),
      });

      let isVerificationCodeMatched = false;

      while (!isVerificationCodeMatched) {
        const enteredVerificationCode = prompt(
          "Please enter the verification code from the email:"
        );

        if (enteredVerificationCode === verificationCode) {
          console.log("Verification code matched!");
          isVerificationCodeMatched = true;
          //Router.push(`/resetpassword?email=${email}`);
          Router.push(`/resetpassword?email=${email}`);
        } else {
          setErrorMessage("รหัสยืนยันไม่ถูกต้อง");
        }
      }
    } catch (errorMessage: any) {
      if (axios.isAxiosError(errorMessage)) {
        if (errorMessage.response) {
          setErrorMessage("ไม่พบ Email นี้อยู่ในระบบ");
        }
      }
    }
  };

  return (
    <main className="bg">
      <title>Forgot Password</title>
      <div className="register">
        <form>
          <div className="container">
            <label className="signup" htmlFor="signup">
              <b>
                <h1>Forgot Password</h1>
              </b>
            </label>
            <label htmlFor="uemail">
              <b>Email</b>
            </label>
            <input
              type="text"
              placeholder="Enter your Email"
              name="uemail"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
              onClick={_handleForgorpassword}
            >
              SEND ME
            </Button>
          </div>
          <div className="err">
          {errorMessage && (
            <Alert message={errorMessage} type="error" showIcon />
          )}
          </div>
        </form>
      </div>
    </main>
  );
}
