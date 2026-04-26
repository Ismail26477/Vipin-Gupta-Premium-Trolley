import { useState } from "react";
import { X, MessageCircle } from "lucide-react";
import { sendOrderToWhatsApp, OrderDetails } from "@/lib/whatsapp";

interface WhatsAppOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: any;
  quantity: number;
  totalPrice: number;
}

export default function WhatsAppOrderModal({
  isOpen,
  onClose,
  product,
  quantity,
  totalPrice
}: WhatsAppOrderModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    address: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.phone.trim()) newErrors.phone = "Phone number is required";
    if (!/^[6-9]\d{9}$/.test(formData.phone.replace(/\D/g, ""))) {
      newErrors.phone = "Invalid phone number (10 digits required)";
    }
    if (!formData.email.trim()) newErrors.email = "Email is required";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Invalid email address";
    }
    if (!formData.address.trim()) newErrors.address = "Delivery address is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);

    const orderDetails: OrderDetails = {
      productName: product.name,
      productId: product.id,
      quantity,
      price: product.discountPrice || product.price,
      totalPrice,
      customerName: formData.name,
      customerPhone: formData.phone,
      customerEmail: formData.email,
      deliveryAddress: formData.address,
      productLink: `${window.location.origin}/product/${product.id}`
    };

    // Send to WhatsApp
    sendOrderToWhatsApp(orderDetails);

    // Reset and close after a short delay
    setTimeout(() => {
      setFormData({ name: "", phone: "", email: "", address: "" });
      setErrors({});
      setIsSubmitting(false);
      onClose();
    }, 500);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ""
      }));
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-green-500 to-green-600 text-white p-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MessageCircle className="w-5 h-5" />
            <h2 className="text-xl font-bold">Order via WhatsApp</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-white/20 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Product Summary */}
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <h3 className="font-semibold text-sm mb-2">Order Summary</h3>
            <p className="text-sm text-gray-600 mb-1">{product.name}</p>
            <p className="text-sm text-gray-600 mb-2">Qty: {quantity}</p>
            <p className="text-lg font-bold text-primary">₹{totalPrice.toLocaleString('en-IN')}</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Full Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Enter your full name"
                className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${
                  errors.name ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Phone Number *
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                placeholder="10-digit mobile number"
                className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${
                  errors.phone ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Email *
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="your.email@example.com"
                className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${
                  errors.email ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
            </div>

            {/* Address */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Delivery Address *
              </label>
              <textarea
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                placeholder="Enter your complete delivery address (Street, City, State, Pincode)"
                rows={3}
                className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 resize-none ${
                  errors.address ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address}</p>}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white py-3 rounded-lg font-semibold hover:opacity-90 transition-all disabled:opacity-50 flex items-center justify-center gap-2 mt-6"
            >
              <MessageCircle className="w-5 h-5" />
              {isSubmitting ? "Opening WhatsApp..." : "Send Order via WhatsApp"}
            </button>

            <p className="text-xs text-gray-500 text-center mt-4">
              Your information will be sent to our WhatsApp for processing.
              No payment information is shared online.
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
