'use client';
import { useCart } from '@/context/CartContext';
import Image from 'next/image';
import Link from 'next/link';
import { FiTrash2, FiPlus, FiMinus, FiShoppingBag, FiArrowRight } from 'react-icons/fi';

export default function CartPage() {
  const { items, removeItem, updateQty, totalPrice, totalItems, clearCart } = useCart();

  if (items.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4 text-earth-400">
        <FiShoppingBag size={64} />
        <h1 className="text-2xl font-semibold text-bark">Your cart is empty</h1>
        <p className="text-earth-500">Discover furniture that speaks to your style</p>
        <Link href="/catalog" className="btn-primary mt-2">Browse Collection</Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex items-center justify-between mb-8">
        <h1 className="section-title">Shopping Cart <span className="text-earth-400 font-sans text-xl">({totalItems})</span></h1>
        <button onClick={clearCart} className="text-sm text-red-500 hover:text-red-700 transition-colors">Clear all</button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Items */}
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <div key={item.item_id} className="card p-4 flex gap-4">
              <div className="relative w-24 h-24 rounded-xl overflow-hidden bg-beige-50 flex-shrink-0">
                <Image src={item.image_url || '/images/placeholder.jpg'} alt={item.name} fill className="object-cover" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-medium text-bark">{item.name}</h3>
                  <button onClick={() => removeItem(item.item_id)} className="text-red-400 hover:text-red-600 flex-shrink-0">
                    <FiTrash2 size={16} />
                  </button>
                </div>
                <p className="text-sage-600 font-semibold mt-1">EGP {item.price.toLocaleString()}</p>
                <div className="flex items-center gap-2 mt-3">
                  <button onClick={() => updateQty(item.item_id, item.quantity - 1)} className="p-1.5 rounded-lg border border-beige-200 hover:border-bark transition-colors">
                    <FiMinus size={13} />
                  </button>
                  <span className="w-8 text-center font-medium">{item.quantity}</span>
                  <button onClick={() => updateQty(item.item_id, item.quantity + 1)} className="p-1.5 rounded-lg border border-beige-200 hover:border-bark transition-colors">
                    <FiPlus size={13} />
                  </button>
                  <span className="ml-auto text-sm text-earth-500">
                    Subtotal: <strong className="text-bark">EGP {(item.price * item.quantity).toLocaleString()}</strong>
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl shadow-sm p-6 sticky top-20">
            <h2 className="font-semibold text-bark text-lg mb-4">Order Summary</h2>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between text-earth-600">
                <span>Subtotal ({totalItems} items)</span>
                <span>EGP {totalPrice.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-earth-600">
                <span>Delivery</span>
                <span className={totalPrice >= 5000 ? 'text-sage-600' : ''}>
                  {totalPrice >= 5000 ? 'Free' : 'EGP 150'}
                </span>
              </div>
              {totalPrice < 5000 && (
                <p className="text-xs text-earth-400">Add EGP {(5000 - totalPrice).toLocaleString()} more for free delivery</p>
              )}
              <div className="border-t border-beige-200 pt-3 mt-3 flex justify-between font-semibold text-bark text-base">
                <span>Total</span>
                <span>EGP {(totalPrice + (totalPrice >= 5000 ? 0 : 150)).toLocaleString()}</span>
              </div>
            </div>
            <Link href="/checkout" className="btn-primary w-full text-center mt-5 flex items-center justify-center gap-2">
              Checkout <FiArrowRight size={16} />
            </Link>
            <Link href="/catalog" className="text-center text-sm text-earth-500 hover:text-bark block mt-3 transition-colors">
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
