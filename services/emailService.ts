
import { Order, User, Product } from '../types';

// This is a mock email service. In a real application, this would use a service like SendGrid, Nodemailer, etc.
// For this app, it will log the email content to the developer console.

// In a real app, products would be fetched from a DB, but here we just need to find them in a passed list if available.
// NOTE: This is a simplified approach. In production, you'd likely pass hydrated item details to this function.
const getProductName = (itemId: number, order: Order): string => {
    // This function is now simplified as product details should ideally be part of the order object sent here
    // However, if not, we rely on the `productDetails` which are added in the DataContext
    const item = order.items.find(i => i.product_id === itemId);
    return item?.productDetails?.name || 'Unknown Product';
}

export const sendOrderConfirmationEmail = (user: User, order: Order) => {
    const subject = `✅ Order Confirmed: Your STAY RAW Order #${order.id}`;

    const itemsHtml = order.items.map(item => {
        // Assuming productDetails are populated on the order items
        const productName = item.productDetails?.name || 'Unknown Product';
        return `
            <tr>
                <td style="padding: 10px; border-bottom: 1px solid #eee;">${productName}</td>
                <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: center;">${item.quantity}</td>
                <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">₹${(item.price * item.quantity).toLocaleString('en-IN')}</td>
            </tr>
        `;
    }).join('');

    const discountHtml = order.discount_amount && order.discount_amount > 0 
        ? `<p style="margin: 5px 0; color: #16a34a;">Discount (${order.discount_code}): - ₹${order.discount_amount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>`
        : '';

    const body = `
        <div style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: auto; border: 1px solid #ddd; padding: 20px;">
            <h2 style="color: #000;">Hi ${user.name},</h2>
            <p>Thank you for your order! We've received it and are getting it ready for shipment.</p>
            <h3 style="border-bottom: 2px solid #eee; padding-bottom: 10px;">Order Summary (ID: ${order.id})</h3>
            <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
                <thead>
                    <tr>
                        <th style="padding: 10px; border-bottom: 2px solid #ddd; text-align: left;">Product</th>
                        <th style="padding: 10px; border-bottom: 2px solid #ddd; text-align: center;">Quantity</th>
                        <th style="padding: 10px; border-bottom: 2px solid #ddd; text-align: right;">Price</th>
                    </tr>
                </thead>
                <tbody>
                    ${itemsHtml}
                </tbody>
            </table>
            <div style="text-align: right;">
                <p style="margin: 5px 0;">Subtotal: ₹${order.subtotal.toLocaleString('en-IN')}</p>
                ${discountHtml}
                <p style="margin: 5px 0;">GST (5%): ₹${order.gst_amount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                <p style="margin: 5px 0;">Delivery Fee: ₹${order.delivery_charge.toLocaleString('en-IN')}</p>
                <h3 style="margin-top: 10px;">Total: ₹${order.total_amount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</h3>
            </div>
            <h4>Shipping to:</h4>
            <div style="background: #f9f9f9; padding: 15px; border-radius: 5px;">
                <p>${order.userName}<br>${order.address}<br>${order.phone}</p>
            </div>
            <p style="margin-top: 20px;">We'll notify you again once your order has been shipped.</p>
            <p>Thanks for shopping with <strong>STAY RAW</strong>!</p>
        </div>
    `;

    console.log("--- MOCK EMAIL SENT ---");
    console.log(`To: ${user.email}`);
    console.log(`Subject: ${subject}`);
    console.log("Body (HTML structure):");
    console.log(body);
    console.log("-----------------------");
};

export const sendShippingUpdateEmail = (user: User, order: Order) => {
    let subject = '';
    let message = '';

    switch(order.status) {
        case 'Dispatched':
            subject = `🚚 Your STAY RAW Order #${order.id} has been Dispatched!`;
            message = `Your order is on its way! You can expect it to arrive soon.`;
            break;
        case 'Delivered':
            subject = `📦 Your STAY RAW Order #${order.id} has been Delivered!`;
            message = `Your order has been delivered. We hope you enjoy your products! You can track your next purchase or write a review on our site.`;
            break;
        case 'Cancelled':
            subject = `❌ Your STAY RAW Order #${order.id} has been Cancelled.`;
            message = `Your order has been cancelled as per your request. If this was a mistake, please contact our support.`;
            break;
        case 'Returned':
            subject = `✅ Your Return for Order #${order.id} is Complete.`;
            message = `We have successfully processed the return for your order. Your refund will be initiated shortly.`;
            break;
        default:
            return; // Don't send emails for 'Placed' or 'Return Requested' status here.
    }
    
    const body = `
        <div style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: auto; border: 1px solid #ddd; padding: 20px;">
            <h2 style="color: #000;">Hi ${user.name},</h2>
            <p>We have an update on your order #${order.id}.</p>
            <div style="background: #f9f9f9; padding: 15px; border-radius: 5px; text-align: center; margin: 20px 0;">
                <h3 style="margin: 0;">New Status: ${order.status.toUpperCase()}</h3>
            </div>
            <p>${message}</p>
            <p>Thanks for shopping with <strong>STAY RAW</strong>!</p>
        </div>
    `;

    console.log("--- MOCK EMAIL SENT ---");
    console.log(`To: ${user.email}`);
    console.log(`Subject: ${subject}`);
    console.log("Body (HTML structure):");
    console.log(body);
    console.log("-----------------------");
};


export const sendReturnRequestConfirmationEmail = (user: User, order: Order) => {
    const subject = `↩️ Return Request Received for Order #${order.id}`;
    const message = `We have received your return request for order #${order.id}. Our team will review it and get back to you with the next steps within 2 business days.`;
    
    const reasonHtml = order.return_reason 
        ? `
        <div style="background: #f0f0f0; padding: 10px; border-left: 3px solid #ccc; margin-top: 15px;">
            <p style="margin: 0; font-style: italic;"><strong>Your reason for return:</strong> "${order.return_reason}"</p>
        </div>
        `
        : '';
        
    const body = `
        <div style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: auto; border: 1px solid #ddd; padding: 20px;">
            <h2 style="color: #000;">Hi ${user.name},</h2>
            <p>${message}</p>
            ${reasonHtml}
            <div style="background: #f9f9f9; padding: 15px; border-radius: 5px; text-align: center; margin: 20px 0;">
                <h3 style="margin: 0;">Status: ${order.status.toUpperCase()}</h3>
            </div>
            <p>Thank you for your patience.</p>
            <p>The <strong>STAY RAW</strong> Team</p>
        </div>
    `;

    console.log("--- MOCK EMAIL SENT ---");
    console.log(`To: ${user.email}`);
    console.log(`Subject: ${subject}`);
    console.log("Body (HTML structure):");
    console.log(body);
    console.log("-----------------------");
};
