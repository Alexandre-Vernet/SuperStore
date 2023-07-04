import { UserDto } from "@superstore/interfaces";

export const sendEmailResetPassword = (user: UserDto, linkResetPassword: string) => {
    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <title>Reset Password</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          background-color: #f6f6f6;
          margin: 0;
          padding: 0;
        }
        .container {
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
          background-color: #ffffff;
          border-radius: 4px;
          box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        }
        .header {
          text-align: center;
          margin-bottom: 20px;
        }
        .title {
          color: #333333;
          font-size: 24px;
          margin-top: 0;
        }
        .description {
          color: #555555;
          font-size: 16px;
          margin-bottom: 0;
        }
        .button {
          display: inline-block;
          padding: 10px 20px;
          background-color: #007bff;
          color: #ffffff;
          text-decoration: none;
          border-radius: 4px;
        }
        .footer {
          margin-top: 20px;
          text-align: center;
        }
        .footer p {
          color: #777777;
          margin-bottom: 5px;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1 class="title">Password Reset</h1>
          <p class="description">Reset your password for SuperStore</p>
        </div>
        <p>Dear ${ user.firstName },</p>
        <p>We have received a request to reset your password for SuperStore. To proceed with the password reset, please click the button below:</p>
        <a class="button" href="${ linkResetPassword }">Reset Password</a>
        <p>If you did not initiate this request, please ignore this email.</p>
        <div class="footer">
          <p>Thank you for using SuperStore.</p>
          <p>Best regards,</p>
          <p>The SuperStore Team</p>
        </div>
      </div>
    </body>
    </html>
  `;
};
