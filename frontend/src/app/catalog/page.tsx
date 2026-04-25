'use client';
import { useEffect, useState, useCallback, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { furnitureApi, designRequestApi } from '@/lib/api';
import FurnitureCard from '@/components/FurnitureCard';
import { FiSearch, FiFilter, FiX, FiUpload, FiChevronDown } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

const STYLES = ['Scandinavian', 'Modern', 'Contemporary', 'Classic', 'Industrial', 'Bohemian'];
const PRICE_RANGES = [
  { label: 'Under EGP 500', min: 0, max: 500 },
  { label: 'EGP 500 – 1,000', min: 500, max: 1000 },
  { label: 'EGP 1,000 – 2,000', min: 1000, max: 2000 },
  { label: 'Over EGP 2,000', min: 2000, max: 99999 },
];

interface Category { category_id: number; name: string; slug: string; }

function CatalogContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [items, setItems] = useState<any[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [filterOpen, setFilterOpen] = useState(false);

  const [filters, setFilters] = useState({
    category: searchParams.get('category') || '',
    style: '',
    min_price: '',
    max_price: '',
    search: searchParams.get('search') || '',
  });

  const [customRequest, setCustomRequest] = useState({
    name: '',
    phone: '',
    description: '',
    images: [] as File[],
    previews: [] as string[],
    submitting: false,
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    const previews = files.map((f) => URL.createObjectURL(f));
    setCustomRequest((p) => ({ ...p, images: files, previews }));
  };

  const handleCustomSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setCustomRequest((p) => ({ ...p, submitting: true }));
    try {
      const formData = new FormData();
      formData.append('name', customRequest.name);
      formData.append('phone', customRequest.phone);
      formData.append('description', customRequest.description);
      customRequest.images.forEach((img) => formData.append('images', img));

      const res = await fetch('http://localhost:5000/api/design-requests', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed');
      toast.success(data.message || 'تم إرسال الطلب بنجاح!');
      setCustomRequest({ name: '', phone: '', description: '', images: [], previews: [], submitting: false });
    } catch (err: any) {
      toast.error(err.message || 'حدث خطأ، حاول مرة أخرى');
      setCustomRequest((p) => ({ ...p, submitting: false }));
    }
  };

  const fetchItems = useCallback(async () => {
    setLoading(true);
    try {
      const params: Record<string, string | number> = { page, limit: 12 };
      if (filters.category) params.category = filters.category;
      if (filters.style) params.style = filters.style;
      if (filters.min_price) params.min_price = filters.min_price;
      if (filters.max_price) params.max_price = filters.max_price;
      if (filters.search) params.search = filters.search;
      const res = await furnitureApi.list(params);
      setItems(res.data.items || []);
      setTotal(res.data.pagination?.total || 0);
    } catch {
      toast.error('Failed to load items');
    } finally {
      setLoading(false);
    }
  }, [filters, page]);


  useEffect(() => { furnitureApi.categories().then((r) => setCategories(r.data)).catch(() => {}); }, []);
  useEffect(() => { fetchItems(); }, [fetchItems]);

  const setFilter = (key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setPage(1);
  };

  const clearFilters = () => {
    setFilters({ category: '', style: '', min_price: '', max_price: '', search: '' });
    setPage(1);
  };

  const activeFilterCount = Object.values(filters).filter(Boolean).length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="section-title">Furniture Catalog</h1>
          <p className="text-earth-500 mt-1">{total} items available</p>
        </div>
        {/* Search */}
        <div className="relative w-full sm:w-72">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-earth-400" size={16} />
          <input
            type="text"
            placeholder="Search furniture..."
            value={filters.search}
            onChange={(e) => setFilter('search', e.target.value)}
            className="input-field pl-9"
          />
        </div>
      </div>

      <div className="flex gap-6">
        {/* Sidebar filters — desktop */}
        <aside className="hidden lg:block w-56 flex-shrink-0 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-bark">Filters</h3>
            {activeFilterCount > 0 && (
              <button onClick={clearFilters} className="text-xs text-red-500 hover:text-red-700 flex items-center gap-1">
                <FiX size={12} /> Clear all
              </button>
            )}
          </div>

          {/* Category */}
          <div>
            <h4 className="text-sm font-medium text-earth-600 mb-3">Category</h4>
            <ul className="space-y-1">
              <li>
                <button onClick={() => setFilter('category', '')} className={`w-full text-left text-sm py-1.5 px-2 rounded-lg transition-colors ${!filters.category ? 'bg-sage-100 text-sage-700 font-medium' : 'text-earth-600 hover:bg-beige-100'}`}>
                  All Categories
                </button>
              </li>
              {categories.map((cat) => (
                <li key={cat.slug}>
                  <button onClick={() => setFilter('category', cat.slug)} className={`w-full text-left text-sm py-1.5 px-2 rounded-lg transition-colors ${filters.category === cat.slug ? 'bg-sage-100 text-sage-700 font-medium' : 'text-earth-600 hover:bg-beige-100'}`}>
                    {cat.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Style */}
          <div>
            <h4 className="text-sm font-medium text-earth-600 mb-3">Style</h4>
            <ul className="space-y-1">
              {STYLES.map((s) => (
                <li key={s}>
                  <button onClick={() => setFilter('style', filters.style === s ? '' : s)} className={`w-full text-left text-sm py-1.5 px-2 rounded-lg transition-colors ${filters.style === s ? 'bg-sage-100 text-sage-700 font-medium' : 'text-earth-600 hover:bg-beige-100'}`}>
                    {s}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Price */}
          <div>
            <h4 className="text-sm font-medium text-earth-600 mb-3">Price Range</h4>
            <ul className="space-y-1">
              {PRICE_RANGES.map((pr) => {
                const active = filters.min_price === String(pr.min) && filters.max_price === String(pr.max);
                return (
                  <li key={pr.label}>
                    <button
                      onClick={() => {
                        if (active) { setFilter('min_price', ''); setFilter('max_price', ''); }
                        else { setFilter('min_price', String(pr.min)); setFilter('max_price', String(pr.max)); }
                      }}
                      className={`w-full text-left text-sm py-1.5 px-2 rounded-lg transition-colors ${active ? 'bg-sage-100 text-sage-700 font-medium' : 'text-earth-600 hover:bg-beige-100'}`}
                    >
                      {pr.label}
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        </aside>

        {/* Items grid */}
        <div className="flex-1">
          {/* Mobile filter toggle */}
          <div className="lg:hidden mb-4">
            <button
              onClick={() => setFilterOpen(!filterOpen)}
              className="flex items-center gap-2 btn-secondary py-2 text-sm"
            >
              <FiFilter size={15} /> Filters {activeFilterCount > 0 && `(${activeFilterCount})`}
              <FiChevronDown className={`transition-transform ${filterOpen ? 'rotate-180' : ''}`} />
            </button>
            <AnimatePresence>
              {filterOpen && (
                <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} className="overflow-hidden">
                  <div className="pt-4 grid grid-cols-2 gap-3">
                    <select value={filters.category} onChange={(e) => setFilter('category', e.target.value)} className="input-field text-sm">
                      <option value="">All Categories</option>
                      {categories.map((c) => <option key={c.slug} value={c.slug}>{c.name}</option>)}
                    </select>
                    <select value={filters.style} onChange={(e) => setFilter('style', e.target.value)} className="input-field text-sm">
                      <option value="">All Styles</option>
                      {STYLES.map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="card animate-pulse">
                  <div className="aspect-[4/3] bg-beige-100" />
                  <div className="p-4 space-y-2">
                    <div className="h-3 bg-beige-100 rounded w-1/3" />
                    <div className="h-4 bg-beige-100 rounded w-2/3" />
                    <div className="h-8 bg-beige-100 rounded mt-4" />
                  </div>
                </div>
              ))}
            </div>
          ) : items.length > 0 ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {items.map((item) => <FurnitureCard key={item.item_id} item={item} />)}
              </div>
              {/* Pagination */}
              {total > 12 && (
                <div className="flex justify-center gap-2 mt-10">
                  {[...Array(Math.ceil(total / 12))].map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setPage(i + 1)}
                      className={`w-10 h-10 rounded-lg text-sm font-medium transition-colors ${page === i + 1 ? 'bg-bark text-cream' : 'bg-beige-100 text-bark hover:bg-beige-200'}`}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>
              )}
            </>
          ) : (
            <div className="flex flex-col items-center gap-4 py-20 text-earth-400">
              <FiSearch size={48} />
              <p className="text-lg font-medium">No items found</p>
              <button onClick={clearFilters} className="btn-secondary py-2 text-sm">Clear filters</button>
            </div>
          )}
        </div>
      </div>

      {/* Custom Design Request */}
      <section id="custom-request" className="mt-20 bg-beige-50 rounded-3xl p-8 md:p-12">
        <div className="max-w-2xl mx-auto text-center">
          <FiUpload size={36} className="mx-auto text-sage-500 mb-4" />
          <h2 className="section-title">أرسل طلبك المخصص</h2>
          <p className="text-earth-500 mt-3 mb-8">
            ارفع صور التصميم اللي بتحلم بيه وهنتواصل معاك على رقمك في أقرب وقت 🛋️
          </p>
          <form onSubmit={handleCustomSubmit} className="space-y-4 text-left">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="اسمك *"
                required
                value={customRequest.name}
                onChange={(e) => setCustomRequest((p) => ({ ...p, name: e.target.value }))}
                className="input-field"
              />
              <input
                type="tel"
                placeholder="رقم موبايلك *"
                required
                value={customRequest.phone}
                onChange={(e) => setCustomRequest((p) => ({ ...p, phone: e.target.value }))}
                className="input-field"
              />
            </div>
            <textarea
              placeholder="وصف التصميم اللي بتدور عليه — الأبعاد، الخامات، الستايل... *"
              required
              rows={4}
              value={customRequest.description}
              onChange={(e) => setCustomRequest((p) => ({ ...p, description: e.target.value }))}
              className="input-field resize-none"
            />

            {/* Image Upload */}
            <div>
              <label
                htmlFor="req-images"
                className="flex flex-col items-center justify-center gap-2 border-2 border-dashed border-beige-300 rounded-xl p-6 cursor-pointer hover:border-sage-400 hover:bg-sage-50 transition-colors"
              >
                <FiUpload size={28} className="text-earth-400" />
                <span className="text-sm text-earth-500">ارفع صور التصميم (حتى 5 صور)</span>
                <span className="text-xs text-earth-400">JPG, PNG, WEBP — حجم أقصى 10MB</span>
              </label>
              <input
                id="req-images"
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageChange}
                className="hidden"
              />
            </div>

            {/* Image Previews */}
            {customRequest.previews.length > 0 && (
              <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                {customRequest.previews.map((src, i) => (
                  <div key={i} className="aspect-square rounded-lg overflow-hidden border border-beige-200">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={src} alt={`preview-${i}`} className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            )}

            <button
              type="submit"
              disabled={customRequest.submitting}
              className="btn-primary w-full flex items-center justify-center gap-2"
            >
              {customRequest.submitting ? (
                <><span className="animate-spin inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full" /> جاري الإرسال...</>
              ) : (
                <><FiUpload size={16} /> إرسال الطلب</>
              )}
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}

export default function CatalogPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-cream flex items-center justify-center">Loading...</div>}>
      <CatalogContent />
    </Suspense>
  );
}
