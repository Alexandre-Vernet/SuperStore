export const sendContactEmail = (email, firstName, lastName, phone, subject, message) => {
    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <title>Contact Form Submission</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            background-color: #f5f5f5;
            padding: 20px;
        }

        .section {
            margin-bottom: 30px;
            padding: 20px;
            background-color: #ffffff;
            border-radius: 4px;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }

        .section-title {
            font-size: 24px;
            font-weight: bold;
            margin-bottom: 10px;
            color: #333333;
        }

        .contact-details {
            margin-top: 20px;
            font-size: 16px;
            color: #666666;
        }

        .contact-info {
            margin-bottom: 10px;
        }

        .contact-name {
            font-weight: bold;
            color: #333333;
        }

        .message {
            margin-top: 10px;
        }
    </style>
</head>
<body>
    <div class="section">
        <h2 class="section-title">Contact Form Submission</h2>
        <div class="contact-details">
            <p class="contact-info"><strong>Email:</strong> ${ email }</p>
            <p class="contact-info"><strong>Name:</strong> ${ firstName } ${ lastName }</p>
            <p class="contact-info"><strong>Phone:</strong> ${ phone }</p>
            <p class="contact-info"><strong>Subject:</strong> ${ subject }</p>
            <p class="message"><strong>Message:</strong></p>
            <p>${ message }</p>
        </div>
    </div>
</body>
</html>
`;
};
