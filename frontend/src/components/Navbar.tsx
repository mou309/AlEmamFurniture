'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import { FiShoppingCart, FiMenu, FiX, FiUser, FiLogOut } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/catalog', label: 'Shop' },
  { href: '/virtual-room', label: 'Virtual Room' },
  { href: '/portfolio', label: 'Portfolio' },
];

export default function Navbar() {
  const { user, logout } = useAuth();
  const { totalItems, setIsOpen } = useCart();
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-cream/95 backdrop-blur-sm shadow-sm' : 'bg-transparent'}`}>
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="font-display text-2xl font-semibold text-bark hover:text-earth-600 transition-colors">
          Al-Emam
        </Link>

        {/* Desktop nav */}
        <ul className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className={`text-sm font-medium transition-colors duration-200 hover:text-sage-600 ${pathname === link.href ? 'text-sage-600 border-b-2 border-sage-500 pb-0.5' : 'text-bark'}`}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Actions */}
        <div className="flex items-center gap-3">
          {/* Cart */}
          <button
            onClick={() => setIsOpen(true)}
            className="relative p-2 text-bark hover:text-sage-600 transition-colors"
            aria-label="Open cart"
          >
            <FiShoppingCart size={20} />
            {totalItems > 0 && (
              <span className="absolute -top-1 -right-1 bg-sage-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium">
                {totalItems > 9 ? '9+' : totalItems}
              </span>
            )}
          </button>

          {/* User */}
          {user ? (
            <div className="relative">
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="hidden md:flex items-center gap-2 p-2 text-bark hover:text-sage-600 transition-colors"
              >
                <FiUser size={18} />
                <span className="text-sm font-medium">{user.name.split(' ')[0]}</span>
              </button>
              <AnimatePresence>
                {userMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-beige-100 py-1 z-50"
                  >
                    <Link href="/profile" className="flex items-center gap-2 px-4 py-2 text-sm text-bark hover:bg-beige-50" onClick={() => setUserMenuOpen(false)}>
                      <FiUser size={15} /> My Profile
                    </Link>
                    <button
                      onClick={() => { logout(); setUserMenuOpen(false); }}
                      className="flex w-full items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                    >
                      <FiLogOut size={15} /> Sign Out
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <Link href="/auth/login" className="hidden md:block btn-primary py-2 px-4 text-sm">
              Sign In
            </Link>
          )}

          {/* Mobile menu toggle */}
          <button
            className="md:hidden p-2 text-bark"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            {menuOpen ? <FiX size={22} /> : <FiMenu size={22} />}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-cream border-t border-beige-200 overflow-hidden"
          >
            <div className="px-4 py-4 space-y-2">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`block py-2 px-3 rounded-lg font-medium text-sm transition-colors ${pathname === link.href ? 'bg-sage-100 text-sage-700' : 'text-bark hover:bg-beige-100'}`}
                  onClick={() => setMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              {user ? (
                <button
                  onClick={() => { logout(); setMenuOpen(false); }}
                  className="block w-full text-left py-2 px-3 rounded-lg font-medium text-sm text-red-600 hover:bg-red-50"
                >
                  Sign Out
                </button>
              ) : (
                <Link href="/auth/login" className="block btn-primary text-center mt-2" onClick={() => setMenuOpen(false)}>
                  Sign In
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
