'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { FiUser, FiMail, FiLock, FiEye, FiEyeOff } from 'react-icons/fi';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

export default function RegisterPage() {
  const { register } = useAuth();
  const router = useRouter();
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) return toast.error('Passwords do not match');
    if (form.password.length < 6) return toast.error('Password must be at least 6 characters');
    setLoading(true);
    try {
      await register(form.name, form.email, form.password);
      toast.success('Account created! Welcome to Maison.');
      router.push('/');
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-beige-50 px-4 py-10">
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
        <div className="bg-white rounded-3xl shadow-sm p-8 md:p-10">
          <div className="text-center mb-8">
            <Link href="/" className="font-display text-3xl font-semibold text-bark">Maison</Link>
            <h1 className="text-xl font-semibold text-bark mt-4">Create your account</h1>
            <p className="text-earth-500 text-sm mt-1">Join thousands of happy homeowners</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <FiUser className="absolute left-3.5 top-1/2 -translate-y-1/2 text-earth-400" size={16} />
              <input type="text" placeholder="Full name" required value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} className="input-field pl-10" />
            </div>
            <div className="relative">
              <FiMail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-earth-400" size={16} />
              <input type="email" placeholder="Email address" required value={form.email} onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))} className="input-field pl-10" />
            </div>
            <div className="relative">
              <FiLock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-earth-400" size={16} />
              <input type={showPw ? 'text' : 'password'} placeholder="Password (min. 6 characters)" required value={form.password} onChange={(e) => setForm((p) => ({ ...p, password: e.target.value }))} className="input-field pl-10 pr-10" />
              <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-earth-400 hover:text-bark">
                {showPw ? <FiEyeOff size={16} /> : <FiEye size={16} />}
              </button>
            </div>
            <div className="relative">
              <FiLock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-earth-400" size={16} />
              <input type="password" placeholder="Confirm password" required value={form.confirmPassword} onChange={(e) => setForm((p) => ({ ...p, confirmPassword: e.target.value }))} className="input-field pl-10" />
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full mt-2">
              {loading ? <span className="flex items-center gap-2 justify-center"><span className="w-4 h-4 border-2 border-cream/30 border-t-cream rounded-full animate-spin" /> Creating account...</span> : 'Create Account'}
            </button>
          </form>

          <p className="text-center text-sm text-earth-500 mt-6">
            Already have an account?{' '}
            <Link href="/auth/login" className="text-sage-600 hover:text-sage-700 font-medium">Sign in</Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
