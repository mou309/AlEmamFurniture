'use client';
import { useEffect, useState } from 'react';
import { portfolioApi } from '@/lib/api';
import { motion } from 'framer-motion';
import { FiCalendar, FiUser, FiTag } from 'react-icons/fi';

export default function PortfolioPage() {
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    portfolioApi.list()
      .then((r) => setProjects(r.data || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="text-center mb-12">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="section-title">Our Portfolio</h1>
          <p className="text-earth-500 mt-3 max-w-xl mx-auto leading-relaxed">
            A showcase of completed projects — spaces transformed by thoughtful furniture design and expert craftsmanship.
          </p>
        </motion.div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="card animate-pulse">
              <div className="aspect-[16/9] bg-beige-100" />
              <div className="p-6 space-y-3">
                <div className="h-5 bg-beige-100 rounded w-2/3" />
                <div className="h-4 bg-beige-100 rounded" />
                <div className="h-4 bg-beige-100 rounded w-3/4" />
              </div>
            </div>
          ))}
        </div>
      ) : projects.length === 0 ? (
        <div className="text-center py-20 text-earth-400">
          <p className="text-lg">Portfolio coming soon...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {projects.map((project, i) => (
            <motion.div
              key={project.project_id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="card group"
            >
              {/* Image area */}
              <div className="aspect-[16/9] bg-gradient-to-br from-beige-100 to-sage-50 relative overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center text-beige-300">
                    <p className="font-display text-xl opacity-40">{project.title}</p>
                    <p className="text-xs opacity-30 mt-1">Add project image</p>
                  </div>
                </div>
                {/* Tags overlay */}
                <div className="absolute bottom-3 left-3 flex flex-wrap gap-1">
                  {(project.tags || []).map((tag: string) => (
                    <span key={tag} className="badge bg-bark/70 text-cream backdrop-blur-sm">
                      <FiTag size={10} className="mr-1" />{tag}
                    </span>
                  ))}
                </div>
              </div>

              <div className="p-6">
                <h2 className="font-display text-xl font-semibold text-bark group-hover:text-sage-700 transition-colors">
                  {project.title}
                </h2>
                <p className="text-earth-500 text-sm mt-2 leading-relaxed line-clamp-3">{project.description}</p>

                <div className="flex flex-wrap items-center gap-4 mt-4 text-xs text-earth-400">
                  {project.client_name && (
                    <span className="flex items-center gap-1.5">
                      <FiUser size={12} /> {project.client_name}
                    </span>
                  )}
                  {project.completed_at && (
                    <span className="flex items-center gap-1.5">
                      <FiCalendar size={12} />
                      {new Date(project.completed_at).toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })}
                    </span>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Contact CTA */}
      <div className="mt-16 text-center bg-beige-50 rounded-3xl p-10">
        <h3 className="section-title text-2xl">Ready to Transform Your Space?</h3>
        <p className="text-earth-500 mt-3 mb-6">Let's discuss your vision and create something beautiful together.</p>
        <a href="mailto:hello@alemam.eg" className="btn-primary">Get in Touch</a>
      </div>
    </div>
  );
}
