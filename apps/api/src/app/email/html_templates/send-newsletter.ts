export const sendNewsletter = (title: string, description: string) => {
    return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${ title } - Don't Miss the Latest News!</title>
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
      <h1 class="title">${ title }</h1>
      <p class="description">${ description }</p>
    </div>
    <p>Dear Reader,</p>
    <p>I hope this email finds you well and ready to explore the latest exciting news from SuperStore. We are delighted to present our new newsletter, which contains exclusive information, updates, and special offers.</p>
    <p>We look forward to sharing with you the latest trends, helpful tips, and upcoming events. Stay up-to-date and don't miss any opportunities by subscribing to our newsletter now!</p>
    <div class="footer">
      <p>Thank you for your trust and being a part of our community.</p>
      <p>Best regards,</p>
      <p>The SuperStore Team</p>
    </div>
  </div>
</body>
</html>
`;
};
