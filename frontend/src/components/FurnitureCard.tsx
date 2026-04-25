'use client';
import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { useCart } from '@/context/CartContext';
import { FiShoppingCart, FiEye, FiLayers } from 'react-icons/fi';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

interface FurnitureItem {
  item_id: number;
  name: string;
  description: string;
  price: number;
  image_url: string;
  category_name?: string;
  style?: string;
  in_stock: boolean;
}

interface Props {
  item: FurnitureItem;
  onAddToRoom?: (item: FurnitureItem) => void;
}

export default function FurnitureCard({ item, onAddToRoom }: Props) {
  const { addItem } = useCart();
  const [imageError, setImageError] = useState(false);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    addItem({
      item_id: item.item_id,
      name: item.name,
      price: item.price,
      image_url: item.image_url,
    });
    toast.success(`${item.name} added to cart!`);
  };

  return (
    <motion.div
      className="card group"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.3 }}
    >
      <Link href={`/catalog/${item.item_id}`}>
        <div className="relative aspect-[4/3] bg-beige-50 overflow-hidden">
          {imageError ? (
            <div className="absolute inset-0 flex items-center justify-center bg-beige-100 text-beige-400">
              <FiLayers size={40} />
            </div>
          ) : (
            <Image
              src={item.image_url || '/images/placeholder.jpg'}
              alt={item.name}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              onError={() => setImageError(true)}
            />
          )}
          {!item.in_stock && (
            <div className="absolute inset-0 bg-bark/50 flex items-center justify-center">
              <span className="badge bg-white text-bark">Out of Stock</span>
            </div>
          )}
          {/* Quick actions */}
          <div className="absolute bottom-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            {onAddToRoom && (
              <button
                onClick={(e) => { e.preventDefault(); onAddToRoom(item); }}
                className="p-2 bg-white rounded-full shadow-md text-sage-600 hover:bg-sage-600 hover:text-white transition-colors"
                title="Add to Virtual Room"
              >
                <FiLayers size={15} />
              </button>
            )}
          </div>
        </div>

        <div className="p-4">
          {item.category_name && (
            <span className="badge bg-beige-100 text-earth-600 mb-2">{item.category_name}</span>
          )}
          <h3 className="font-medium text-bark mt-1 group-hover:text-sage-700 transition-colors line-clamp-1">
            {item.name}
          </h3>
          <p className="text-sm text-earth-500 mt-1 line-clamp-2">{item.description}</p>
          <div className="flex items-center justify-between mt-4">
            <span className="text-lg font-semibold text-bark">
              EGP {item.price.toLocaleString()}
            </span>
            <button
              onClick={handleAddToCart}
              disabled={!item.in_stock}
              className="flex items-center gap-1.5 btn-sage py-2 px-3 text-sm disabled:opacity-40"
            >
              <FiShoppingCart size={15} />
              Add
            </button>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
