import { OrderDto, UserDto } from "@superstore/interfaces";

export const confirmOrder = (order: OrderDto, user: UserDto) => {
    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <title>Order Confirmation</title>
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

        .order-details {
            margin-top: 20px;
            font-size: 16px;
            color: #666666;
        }

        .order-info {
            margin-bottom: 10px;
        }

        .order-number {
            font-weight: bold;
            color: #333333;
        }

        .thank-you {
            font-weight: bold;
            text-align: center;
            margin-top: 30px;
            font-size: 18px;
            color: #333333;
        }
    </style>
</head>
<body>
    <div class="section">
        <h2 class="section-title">Order Confirmation</h2>
        <div class="order-details">
            <p class="order-info">Dear ${ user.firstName },</p>
            <p class="order-info">Thank you for placing your order on our e-commerce website. We are delighted to have you as our customer and would like to inform you that your order has been successfully confirmed.</p>
            <p class="order-info">Here are the details of your order:</p>
            <p class="order-info">Order Number: <span class="order-number">${ order.id }</span></p>
            <p class="order-info">Order Total: ${ order.totalPrice } €</p>
        </div>
    </div>
    <p class="thank-you">Thank you for your trust!</p>
</body>
</html>
`
};
