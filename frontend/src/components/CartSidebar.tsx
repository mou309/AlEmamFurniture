'use client';
import { useCart } from '@/context/CartContext';
import { AnimatePresence, motion } from 'framer-motion';
import { FiX, FiTrash2, FiPlus, FiMinus, FiShoppingBag } from 'react-icons/fi';
import Image from 'next/image';
import Link from 'next/link';

export default function CartSidebar() {
  const { items, isOpen, setIsOpen, removeItem, updateQty, totalPrice, totalItems } = useCart();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-bark/40 backdrop-blur-sm z-50"
          />
          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-cream z-50 flex flex-col shadow-2xl"
          >
            <div className="flex items-center justify-between px-6 py-4 border-b border-beige-200">
              <h2 className="font-display text-xl font-semibold text-bark flex items-center gap-2">
                <FiShoppingBag /> Cart ({totalItems})
              </h2>
              <button onClick={() => setIsOpen(false)} className="p-2 text-earth-500 hover:text-bark transition-colors">
                <FiX size={22} />
              </button>
            </div>

            {items.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center gap-4 text-earth-400">
                <FiShoppingBag size={48} />
                <p className="text-lg font-medium">Your cart is empty</p>
                <Link href="/catalog" onClick={() => setIsOpen(false)} className="btn-primary">
                  Start Shopping
                </Link>
              </div>
            ) : (
              <>
                <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
                  {items.map((item) => (
                    <div key={item.item_id} className="flex gap-4 bg-white rounded-xl p-3 shadow-sm">
                      <div className="relative w-20 h-20 rounded-lg overflow-hidden bg-beige-50 flex-shrink-0">
                        <Image src={item.image_url || '/images/placeholder.jpg'} alt={item.name} fill className="object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-bark text-sm line-clamp-1">{item.name}</p>
                        <p className="text-sage-600 font-semibold mt-1">EGP {item.price.toLocaleString()}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <button onClick={() => updateQty(item.item_id, item.quantity - 1)} className="p-1 rounded border border-beige-200 hover:border-bark transition-colors">
                            <FiMinus size={12} />
                          </button>
                          <span className="text-sm font-medium w-6 text-center">{item.quantity}</span>
                          <button onClick={() => updateQty(item.item_id, item.quantity + 1)} className="p-1 rounded border border-beige-200 hover:border-bark transition-colors">
                            <FiPlus size={12} />
                          </button>
                          <button onClick={() => removeItem(item.item_id)} className="ml-auto p-1 text-red-400 hover:text-red-600 transition-colors">
                            <FiTrash2 size={15} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="border-t border-beige-200 px-6 py-4 space-y-3">
                  <div className="flex justify-between font-semibold text-bark">
                    <span>Total</span>
                    <span>EGP {totalPrice.toLocaleString()}</span>
                  </div>
                  <Link
                    href="/checkout"
                    onClick={() => setIsOpen(false)}
                    className="btn-primary w-full text-center"
                  >
                    Proceed to Checkout
                  </Link>
                  <button onClick={() => setIsOpen(false)} className="btn-secondary w-full text-center text-sm">
                    Continue Shopping
                  </button>
                </div>
              </>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
