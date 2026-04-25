'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { furnitureApi, portfolioApi } from '@/lib/api';
import FurnitureCard from '@/components/FurnitureCard';
import { FiArrowRight, FiLayers, FiPackage, FiTruck, FiStar } from 'react-icons/fi';

const features = [
  { icon: FiLayers, title: 'Virtual Room', desc: 'Visualize furniture in your space with our 3D room planner before buying.' },
  { icon: FiPackage, title: 'Custom Orders', desc: "Can't find what you need? Upload your design and we'll craft it for you." },
  { icon: FiTruck, title: 'Free Delivery', desc: 'Complimentary delivery on all orders above EGP 5,000.' },
  { icon: FiStar, title: 'Quality Assured', desc: 'Every piece crafted with premium materials and a 2-year warranty.' },
];

const categories = [
  { name: 'Living Room', slug: 'living-room', emoji: '🛋️', bg: 'bg-beige-100' },
  { name: 'Bedroom', slug: 'bedroom', emoji: '🛏️', bg: 'bg-sage-50' },
  { name: 'Dining Room', slug: 'dining-room', emoji: '🍽️', bg: 'bg-earth-50' },
  { name: 'Office', slug: 'office', emoji: '💼', bg: 'bg-beige-50' },
];

export default function HomePage() {
  const [featuredItems, setFeaturedItems] = useState<any[]>([]);
  const [portfolioItems, setPortfolioItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([furnitureApi.list({ limit: 4 }), portfolioApi.list()])
      .then(([furRes, portRes]) => {
        setFeaturedItems(furRes.data.items || []);
        setPortfolioItems((portRes.data || []).slice(0, 3));
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      {/* Hero */}
      <section className="relative min-h-[90vh] flex items-center bg-gradient-to-br from-beige-100 via-cream to-sage-50 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-72 h-72 rounded-full bg-sage-300 blur-3xl" />
          <div className="absolute bottom-20 right-20 w-96 h-96 rounded-full bg-beige-400 blur-3xl" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div initial={{ opacity: 0, x: -40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7 }}>
            <span className="badge bg-sage-100 text-sage-700 mb-4">New Collection 2025</span>
            <h1 className="font-display text-5xl md:text-6xl font-semibold text-bark leading-tight text-balance">
              Furniture That Tells Your Story
            </h1>
            <p className="mt-6 text-lg text-earth-600 max-w-lg leading-relaxed">
              Discover handcrafted pieces that blend timeless craftsmanship with modern aesthetics. Visualize them in your space before you buy.
            </p>
            <div className="flex flex-wrap gap-4 mt-8">
              <Link href="/catalog" className="btn-primary gap-2">
                Shop Collection <FiArrowRight />
              </Link>
              <Link href="/virtual-room" className="btn-secondary gap-2">
                <FiLayers /> Try Virtual Room
              </Link>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="hidden lg:block"
          >
            <div className="relative aspect-square max-w-lg mx-auto">
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-beige-200 to-sage-100 flex items-center justify-center">
                <div className="text-center text-earth-400">
                  <FiLayers size={80} className="mx-auto mb-4 opacity-30" />
                  <p className="text-sm opacity-50">Hero image placeholder</p>
                  <p className="text-xs opacity-40">Replace with your hero furniture image</p>
                </div>
              </div>
              {/* Floating stat cards */}
              <motion.div
                animate={{ y: [-8, 8, -8] }}
                transition={{ repeat: Infinity, duration: 4 }}
                className="absolute -bottom-4 -left-4 bg-white rounded-2xl shadow-lg p-4 flex items-center gap-3"
              >
                <div className="w-10 h-10 rounded-full bg-sage-100 flex items-center justify-center text-sage-600">
                  <FiStar size={18} />
                </div>
                <div>
                  <p className="font-semibold text-bark text-sm">500+ Projects</p>
                  <p className="text-xs text-earth-500">Delivered</p>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="flex flex-col items-start gap-3"
              >
                <div className="w-12 h-12 rounded-xl bg-sage-100 flex items-center justify-center text-sage-600">
                  <f.icon size={22} />
                </div>
                <h3 className="font-semibold text-bark">{f.title}</h3>
                <p className="text-sm text-earth-500 leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16 bg-beige-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-10">
            <div>
              <h2 className="section-title">Shop by Room</h2>
              <p className="text-earth-500 mt-2">Find the perfect furniture for every space</p>
            </div>
            <Link href="/catalog" className="text-sage-600 hover:text-sage-700 font-medium text-sm flex items-center gap-1">
              View all <FiArrowRight size={14} />
            </Link>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {categories.map((cat, i) => (
              <motion.div
                key={cat.slug}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <Link
                  href={`/catalog?category=${cat.slug}`}
                  className={`${cat.bg} rounded-2xl p-6 flex flex-col items-center gap-3 text-center hover:shadow-md transition-shadow duration-300 group`}
                >
                  <span className="text-4xl">{cat.emoji}</span>
                  <span className="font-medium text-bark group-hover:text-sage-700 transition-colors">{cat.name}</span>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-10">
            <div>
              <h2 className="section-title">Featured Pieces</h2>
              <p className="text-earth-500 mt-2">Handpicked favourites from our latest collection</p>
            </div>
            <Link href="/catalog" className="text-sage-600 hover:text-sage-700 font-medium text-sm flex items-center gap-1">
              Shop all <FiArrowRight size={14} />
            </Link>
          </div>
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="card animate-pulse">
                  <div className="aspect-[4/3] bg-beige-100" />
                  <div className="p-4 space-y-2">
                    <div className="h-3 bg-beige-100 rounded w-1/3" />
                    <div className="h-4 bg-beige-100 rounded w-2/3" />
                    <div className="h-3 bg-beige-100 rounded" />
                    <div className="h-8 bg-beige-100 rounded mt-4" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredItems.map((item) => <FurnitureCard key={item.item_id} item={item} />)}
            </div>
          )}
        </div>
      </section>

      {/* Virtual Room CTA */}
      <section className="py-16 bg-bark text-cream">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="font-display text-4xl font-semibold text-cream">See It In Your Space</h2>
              <p className="mt-4 text-beige-300 leading-relaxed">
                Use our interactive 3D Virtual Room planner to arrange furniture, experiment with layouts, and share your vision with friends and family before making a decision.
              </p>
              <div className="flex flex-wrap justify-center gap-4 mt-8">
                <Link href="/virtual-room" className="btn-sage gap-2">
                  <FiLayers /> Open Virtual Room
                </Link>
                <Link href="/catalog" className="btn-secondary border-beige-400 text-beige-200 hover:bg-beige-200/10 hover:text-cream gap-2">
                  Browse Catalog
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Portfolio Preview */}
      {portfolioItems.length > 0 && (
        <section className="py-16 bg-beige-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-end justify-between mb-10">
              <div>
                <h2 className="section-title">Our Portfolio</h2>
                <p className="text-earth-500 mt-2">Completed projects we're proud of</p>
              </div>
              <Link href="/portfolio" className="text-sage-600 hover:text-sage-700 font-medium text-sm flex items-center gap-1">
                View all <FiArrowRight size={14} />
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {portfolioItems.map((project: any, i: number) => (
                <motion.div
                  key={project.project_id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="card group"
                >
                  <div className="aspect-[16/10] bg-beige-100 relative overflow-hidden">
                    <div className="absolute inset-0 flex items-center justify-center text-beige-300 font-display text-lg">
                      {project.title}
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-bark group-hover:text-sage-700 transition-colors">{project.title}</h3>
                    <p className="text-sm text-earth-500 mt-1 line-clamp-2">{project.description}</p>
                    <div className="flex flex-wrap gap-1 mt-3">
                      {(project.tags || []).slice(0, 3).map((tag: string) => (
                        <span key={tag} className="badge bg-beige-100 text-earth-600">{tag}</span>
                      ))}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Custom Design CTA */}
      <section className="py-16 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="section-title">Have a Custom Design?</h2>
            <p className="text-earth-500 mt-4 leading-relaxed">
              Don't see what you're looking for? Upload your design or describe your vision and our team will bring it to life.
            </p>
            <Link href="/catalog#custom-request" className="btn-primary mt-8 inline-flex">
              Submit a Design Request
            </Link>
          </motion.div>
        </div>
      </section>
    </>
  );
}
