import type { Metadata } from 'next';
import './globals.css';
import { AuthProvider } from '@/context/AuthContext';
import { CartProvider } from '@/context/CartContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import CartSidebar from '@/components/CartSidebar';
import { Toaster } from 'react-hot-toast';

export const metadata: Metadata = {
  title: { default: 'Al-Emam Furniture', template: '%s | Al-Emam Furniture' },
  description: 'Premium furniture for modern living. Shop ready-made & custom pieces.',
  keywords: ['furniture', 'home decor', 'custom furniture', 'interior design'],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <CartProvider>
            <Navbar />
            <main className="min-h-screen pt-16">{children}</main>
            <Footer />
            <CartSidebar />
            <Toaster
              position="bottom-right"
              toastOptions={{
                style: { background: '#3d2b1f', color: '#faf8f5', borderRadius: '12px' },
                success: { iconTheme: { primary: '#4d7a50', secondary: '#faf8f5' } },
              }}
            />
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
