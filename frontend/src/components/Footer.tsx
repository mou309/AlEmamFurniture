import Link from 'next/link';
import { FiInstagram, FiTwitter, FiFacebook, FiMail, FiPhone, FiMapPin } from 'react-icons/fi';

export default function Footer() {
  return (
    <footer className="bg-bark text-beige-200 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="md:col-span-1">
            <span className="font-display text-2xl font-semibold text-cream">Maison</span>
            <p className="mt-3 text-sm text-beige-300 leading-relaxed">
              Thoughtfully crafted furniture for modern living. Quality that endures, design that inspires.
            </p>
            <div className="flex gap-4 mt-5">
              <a href="#" aria-label="Instagram" className="text-beige-300 hover:text-cream transition-colors"><FiInstagram size={20} /></a>
              <a href="#" aria-label="Twitter" className="text-beige-300 hover:text-cream transition-colors"><FiTwitter size={20} /></a>
              <a href="#" aria-label="Facebook" className="text-beige-300 hover:text-cream transition-colors"><FiFacebook size={20} /></a>
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="font-semibold text-cream mb-4">Shop</h4>
            <ul className="space-y-2 text-sm">
              {['Living Room', 'Bedroom', 'Dining Room', 'Office', 'Outdoor'].map((cat) => (
                <li key={cat}>
                  <Link href={`/catalog?category=${cat.toLowerCase().replace(' ', '-')}`} className="text-beige-300 hover:text-cream transition-colors">
                    {cat}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-semibold text-cream mb-4">Company</h4>
            <ul className="space-y-2 text-sm">
              {[{ href: '/portfolio', label: 'Our Portfolio' }, { href: '/virtual-room', label: 'Virtual Room' }, { href: '/about', label: 'About Us' }, { href: '/contact', label: 'Contact' }].map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-beige-300 hover:text-cream transition-colors">{l.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold text-cream mb-4">Contact</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-2 text-beige-300"><FiMapPin size={14} /><span>Cairo, Egypt</span></li>
              <li className="flex items-center gap-2 text-beige-300"><FiPhone size={14} /><a href="tel:+201234567890" className="hover:text-cream transition-colors">+20 123 456 7890</a></li>
              <li className="flex items-center gap-2 text-beige-300"><FiMail size={14} /><a href="mailto:hello@maison.eg" className="hover:text-cream transition-colors">hello@maison.eg</a></li>
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-earth-700 flex flex-col sm:flex-row justify-between items-center gap-3 text-xs text-beige-400">
          <p>© {new Date().getFullYear()} Maison Furniture. All rights reserved.</p>
          <div className="flex gap-4">
            <Link href="/privacy" className="hover:text-cream transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-cream transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
