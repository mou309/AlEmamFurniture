'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import dynamic from 'next/dynamic';
import { virtualRoomApi } from '@/lib/api';
import { FiHome, FiShare2 } from 'react-icons/fi';
import Link from 'next/link';
import toast from 'react-hot-toast';

const VirtualRoomScene = dynamic(() => import('@/components/VirtualRoomScene'), { ssr: false });

export default function SharedRoomPage() {
  const { token } = useParams<{ token: string }>();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    virtualRoomApi.getShared(token)
      .then((r) => setData(r.data))
      .catch(() => setError('This room layout could not be found or is no longer available.'))
      .finally(() => setLoading(false));
  }, [token]);

  if (loading) return <div className="flex items-center justify-center h-screen"><div className="w-10 h-10 border-4 border-beige-200 border-t-sage-500 rounded-full animate-spin" /></div>;
  if (error) return (
    <div className="flex flex-col items-center justify-center h-screen gap-4 text-center px-4">
      <p className="text-bark font-medium">{error}</p>
      <Link href="/" className="btn-primary">Go Home</Link>
    </div>
  );

  const { room, placedFurniture } = data.room_data;

  return (
    <div className="h-screen flex flex-col">
      <div className="bg-white border-b border-beige-200 px-4 py-3 flex items-center gap-4">
        <Link href="/" className="text-earth-500 hover:text-bark"><FiHome size={20} /></Link>
        <h1 className="font-display text-lg font-medium text-bark">{data.name} — Shared Room View</h1>
        <button
          onClick={() => { navigator.clipboard.writeText(window.location.href); toast.success('Link copied!'); }}
          className="ml-auto flex items-center gap-2 text-sm text-sage-600 hover:text-sage-700"
        >
          <FiShare2 size={15} /> Copy Link
        </button>
      </div>
      <div className="flex-1 pointer-events-auto">
        <VirtualRoomScene
          room={room}
          placedFurniture={placedFurniture}
          selectedId={null}
          onSelect={() => {}}
          onUpdate={() => {}}
        />
      </div>
      <div className="bg-white border-t border-beige-200 px-4 py-3 text-center text-sm text-earth-500">
        Viewing a shared room layout from <Link href="/" className="text-sage-600 hover:underline">Maison Furniture</Link>.
        <Link href="/virtual-room" className="ml-2 text-sage-600 hover:underline">Create your own →</Link>
      </div>
    </div>
  );
}
