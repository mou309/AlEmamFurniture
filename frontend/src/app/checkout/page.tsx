'use client';
import { useState } from 'react';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { ordersApi } from '@/lib/api';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { FiArrowLeft, FiCheck, FiShoppingBag } from 'react-icons/fi';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

interface ShippingForm {
  fullName: string; phone: string; street: string; city: string; governorate: string; postalCode: string;
}

export default function CheckoutPage() {
  const { items, totalPrice, clearCart } = useCart();
  const { user } = useAuth();
  const router = useRouter();
  const [step, setStep] = useState<'shipping' | 'review' | 'success'>('shipping');
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState<ShippingForm>({
    fullName: user?.name || '', phone: '', street: '', city: '', governorate: 'Cairo', postalCode: '',
  });

  const delivery = totalPrice >= 5000 ? 0 : 150;
  const grandTotal = totalPrice + delivery;

  const handleOrder = async () => {
    if (!user) { toast.error('Please sign in to place an order'); router.push('/auth/login'); return; }
    setSubmitting(true);
    try {
      await ordersApi.create({
        items: items.map((i) => ({ item_id: i.item_id, quantity: i.quantity, unit_price: i.price })),
        shipping_address: form,
      });
      clearCart();
      setStep('success');
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Order failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (items.length === 0 && step !== 'success') {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
        <FiShoppingBag size={48} className="text-earth-300" />
        <p className="text-bark font-medium">Your cart is empty</p>
        <Link href="/catalog" className="btn-primary">Browse Furniture</Link>
      </div>
    );
  }

  if (step === 'success') {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center gap-5 px-4 text-center">
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="w-20 h-20 rounded-full bg-sage-100 flex items-center justify-center">
          <FiCheck size={36} className="text-sage-600" />
        </motion.div>
        <h1 className="font-display text-3xl font-semibold text-bark">Order Confirmed!</h1>
        <p className="text-earth-500 max-w-md">
          Thank you for your order. We'll contact you within 24 hours to confirm delivery details and payment.
        </p>
        <div className="flex gap-3 mt-2">
          <Link href="/catalog" className="btn-primary">Continue Shopping</Link>
          <Link href="/" className="btn-secondary">Go Home</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <Link href="/cart" className="inline-flex items-center gap-2 text-earth-500 hover:text-bark text-sm mb-6 transition-colors">
        <FiArrowLeft size={15} /> Back to Cart
      </Link>

      <h1 className="section-title mb-8">Checkout</h1>

      {/* Steps */}
      <div className="flex items-center gap-2 mb-8">
        {['Shipping', 'Review'].map((s, i) => (
          <div key={s} className="flex items-center gap-2">
            <div className={`w-7 h-7 rounded-full text-xs font-medium flex items-center justify-center ${i === 0 && step === 'shipping' || i === 1 && step === 'review' ? 'bg-bark text-cream' : i === 0 && step === 'review' ? 'bg-sage-500 text-white' : 'bg-beige-200 text-earth-500'}`}>
              {i === 0 && step === 'review' ? <FiCheck size={13} /> : i + 1}
            </div>
            <span className="text-sm font-medium text-bark">{s}</span>
            {i === 0 && <div className="w-12 h-px bg-beige-300 mx-1" />}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          {step === 'shipping' && (
            <div className="bg-white rounded-2xl shadow-sm p-6 space-y-4">
              <h2 className="font-semibold text-bark text-lg">Shipping Details</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="text-sm font-medium text-earth-600 block mb-1">Full Name *</label>
                  <input required className="input-field" value={form.fullName} onChange={(e) => setForm((p) => ({ ...p, fullName: e.target.value }))} />
                </div>
                <div>
                  <label className="text-sm font-medium text-earth-600 block mb-1">Phone *</label>
                  <input required className="input-field" value={form.phone} onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))} />
                </div>
                <div>
                  <label className="text-sm font-medium text-earth-600 block mb-1">Governorate *</label>
                  <select className="input-field" value={form.governorate} onChange={(e) => setForm((p) => ({ ...p, governorate: e.target.value }))}>
                    {['Cairo', 'Giza', 'Alexandria', 'Sharm El Sheikh', 'Hurghada', 'Other'].map((g) => <option key={g}>{g}</option>)}
                  </select>
                </div>
                <div className="sm:col-span-2">
                  <label className="text-sm font-medium text-earth-600 block mb-1">Street Address *</label>
                  <input required className="input-field" value={form.street} onChange={(e) => setForm((p) => ({ ...p, street: e.target.value }))} />
                </div>
                <div>
                  <label className="text-sm font-medium text-earth-600 block mb-1">City *</label>
                  <input required className="input-field" value={form.city} onChange={(e) => setForm((p) => ({ ...p, city: e.target.value }))} />
                </div>
                <div>
                  <label className="text-sm font-medium text-earth-600 block mb-1">Postal Code</label>
                  <input className="input-field" value={form.postalCode} onChange={(e) => setForm((p) => ({ ...p, postalCode: e.target.value }))} />
                </div>
              </div>
              <button
                onClick={() => { if (!form.fullName || !form.phone || !form.street || !form.city) return toast.error('Please fill required fields'); setStep('review'); }}
                className="btn-primary w-full mt-2"
              >
                Continue to Review
              </button>
            </div>
          )}

          {step === 'review' && (
            <div className="space-y-4">
              <div className="bg-white rounded-2xl shadow-sm p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-semibold text-bark">Shipping To</h2>
                  <button onClick={() => setStep('shipping')} className="text-sage-600 text-sm hover:underline">Edit</button>
                </div>
                <p className="text-sm text-earth-600">{form.fullName} · {form.phone}</p>
                <p className="text-sm text-earth-600">{form.street}, {form.city}, {form.governorate}</p>
              </div>
              <div className="bg-white rounded-2xl shadow-sm p-6">
                <h2 className="font-semibold text-bark mb-4">Order Items</h2>
                <div className="space-y-3">
                  {items.map((item) => (
                    <div key={item.item_id} className="flex items-center gap-3">
                      <div className="relative w-14 h-14 rounded-lg overflow-hidden bg-beige-50 flex-shrink-0">
                        <Image src={item.image_url || '/images/placeholder.jpg'} alt={item.name} fill className="object-cover" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-bark">{item.name}</p>
                        <p className="text-xs text-earth-500">Qty: {item.quantity}</p>
                      </div>
                      <p className="text-sm font-semibold text-bark">EGP {(item.price * item.quantity).toLocaleString()}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 text-sm text-amber-800">
                💳 Payment is collected upon delivery (Cash on Delivery). Our team will contact you to confirm your order.
              </div>
              <button onClick={handleOrder} disabled={submitting} className="btn-primary w-full">
                {submitting ? 'Placing Order...' : `Place Order · EGP ${grandTotal.toLocaleString()}`}
              </button>
            </div>
          )}
        </div>

        {/* Summary sidebar */}
        <div>
          <div className="bg-white rounded-2xl shadow-sm p-5 sticky top-20">
            <h2 className="font-semibold text-bark mb-4">Summary</h2>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between text-earth-600"><span>Subtotal</span><span>EGP {totalPrice.toLocaleString()}</span></div>
              <div className="flex justify-between text-earth-600"><span>Delivery</span><span className={delivery === 0 ? 'text-sage-600' : ''}>{delivery === 0 ? 'Free' : `EGP ${delivery}`}</span></div>
              <div className="border-t border-beige-200 pt-2 mt-2 flex justify-between font-semibold text-bark">
                <span>Total</span><span>EGP {grandTotal.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
