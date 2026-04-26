// WhatsApp order utility - sends order details without login
export const WHATSAPP_NUMBER = "+919151749641"; // Indian format with country code

export interface OrderDetails {
  productName: string;
  productId: string;
  quantity: number;
  price: number;
  totalPrice: number;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  deliveryAddress: string;
  productLink: string;
}

export const sendOrderToWhatsApp = (orderDetails: OrderDetails) => {
  const {
    productName,
    quantity,
    price,
    totalPrice,
    customerName,
    customerPhone,
    customerEmail,
    deliveryAddress,
    productLink
  } = orderDetails;

  // Format the message
  const message = `*New Order Request* 📦\n\n*Customer Details:*\nName: ${customerName}\nPhone: ${customerPhone}\nEmail: ${customerEmail}\nAddress: ${deliveryAddress}\n\n*Product Details:*\nProduct: ${productName}\nQuantity: ${quantity}\nPrice per unit: ₹${price.toLocaleString('en-IN')}\nTotal Amount: ₹${totalPrice.toLocaleString('en-IN')}\n\n*Product Link:*\n${productLink}\n\nPlease confirm this order. Thank you!`;

  // Encode the message for URL
  const encodedMessage = encodeURIComponent(message);

  // Create WhatsApp URL (wa.me format)
  const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER.replace(/[^\d]/g, '')}?text=${encodedMessage}`;

  // Open WhatsApp in new window
  window.open(whatsappUrl, '_blank');
};

export const openWhatsAppChat = () => {
  const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER.replace(/[^\d]/g, '')}`;
  window.open(whatsappUrl, '_blank');
};
