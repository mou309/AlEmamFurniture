'use client';
import dynamic from 'next/dynamic';
import { useState, useCallback } from 'react';
import { furnitureApi, virtualRoomApi } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { FiSave, FiShare2, FiPlus, FiTrash2, FiMove, FiRotateCw, FiBox, FiCheck } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

// Dynamically import 3D scene to avoid SSR issues with Three.js
const VirtualRoomScene = dynamic(() => import('@/components/VirtualRoomScene'), { ssr: false, loading: () => (
  <div className="flex-1 flex items-center justify-center bg-beige-50 rounded-2xl">
    <div className="text-center text-earth-400">
      <div className="w-12 h-12 border-4 border-beige-200 border-t-sage-500 rounded-full animate-spin mx-auto mb-3" />
      <p>Loading 3D Room...</p>
    </div>
  </div>
)});

export interface RoomDimensions { width: number; length: number; height: number; }
export interface PlacedFurniture {
  id: string;
  item_id: number;
  name: string;
  color: string;
  position: [number, number, number];
  rotation: number;
  scale: number;
  dimensions: { width: number; depth: number; height: number };
}

const ROOM_TEMPLATES = [
  { name: 'Small Bedroom', dimensions: { width: 3, length: 4, height: 2.7 } },
  { name: 'Living Room', dimensions: { width: 5, length: 6, height: 3 } },
  { name: 'Studio Apartment', dimensions: { width: 4, length: 5, height: 2.8 } },
  { name: 'Large Bedroom', dimensions: { width: 5, length: 5.5, height: 3 } },
];

export default function VirtualRoomPage() {
  const { user } = useAuth();
  const [room, setRoom] = useState<RoomDimensions>({ width: 5, length: 6, height: 3 });
  const [customDims, setCustomDims] = useState({ width: '5', length: '6', height: '3' });
  const [placedFurniture, setPlacedFurniture] = useState<PlacedFurniture[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [panel, setPanel] = useState<'templates' | 'catalog' | 'custom'>('templates');
  const [catalogItems, setCatalogItems] = useState<any[]>([]);
  const [catalogLoaded, setCatalogLoaded] = useState(false);
  const [saving, setSaving] = useState(false);
  const [shareLink, setShareLink] = useState('');
  const [roomName, setRoomName] = useState('My Room');

  const loadCatalog = useCallback(async () => {
    if (catalogLoaded) return;
    try {
      const res = await furnitureApi.list({ limit: 20 });
      setCatalogItems(res.data.items || []);
      setCatalogLoaded(true);
    } catch { toast.error('Failed to load furniture catalog'); }
  }, [catalogLoaded]);

  const applyTemplate = (template: typeof ROOM_TEMPLATES[0]) => {
    setRoom(template.dimensions);
    setCustomDims({ width: String(template.dimensions.width), length: String(template.dimensions.length), height: String(template.dimensions.height) });
    toast.success(`Template "${template.name}" applied`);
  };

  const applyCustomDims = () => {
    const w = parseFloat(customDims.width);
    const l = parseFloat(customDims.length);
    const h = parseFloat(customDims.height);
    if ([w, l, h].some((v) => isNaN(v) || v < 1 || v > 20)) {
      return toast.error('Dimensions must be between 1 and 20 meters');
    }
    setRoom({ width: w, length: l, height: h });
    toast.success('Room dimensions updated');
  };

  const addFurniture = (item: any) => {
    const newPiece: PlacedFurniture = {
      id: `${item.item_id}-${Date.now()}`,
      item_id: item.item_id,
      name: item.name,
      color: '#C4A882',
      position: [0, 0, 0],
      rotation: 0,
      scale: 1,
      dimensions: item.dimensions || { width: 1, depth: 0.8, height: 0.8 },
    };
    setPlacedFurniture((prev) => [...prev, newPiece]);
    setSelectedId(newPiece.id);
    toast.success(`${item.name} added to room`);
  };

  const removeFurniture = (id: string) => {
    setPlacedFurniture((prev) => prev.filter((p) => p.id !== id));
    if (selectedId === id) setSelectedId(null);
  };

  const updateFurniture = (id: string, changes: Partial<PlacedFurniture>) => {
    setPlacedFurniture((prev) => prev.map((p) => p.id === id ? { ...p, ...changes } : p));
  };

  const handleSave = async () => {
    if (!user) return toast.error('Please sign in to save your room');
    setSaving(true);
    try {
      const res = await virtualRoomApi.save({ name: roomName, room_data: { room, placedFurniture } });
      const token = res.data.share_token;
      const link = `${window.location.origin}/virtual-room/share/${token}`;
      setShareLink(link);
      toast.success('Room saved successfully!');
    } catch { toast.error('Failed to save room'); }
    finally { setSaving(false); }
  };

  const handleShare = async () => {
    if (!shareLink) { await handleSave(); return; }
    await navigator.clipboard.writeText(shareLink);
    toast.success('Share link copied to clipboard!');
  };

  const selected = placedFurniture.find((p) => p.id === selectedId);

  return (
    <div className="h-[calc(100vh-64px)] flex flex-col bg-beige-50">
      {/* Top toolbar */}
      <div className="bg-white border-b border-beige-200 px-4 py-3 flex items-center gap-3 flex-wrap">
        <input
          value={roomName}
          onChange={(e) => setRoomName(e.target.value)}
          className="font-display text-lg font-medium text-bark bg-transparent border-b border-transparent hover:border-beige-300 focus:border-sage-400 focus:outline-none px-1 py-0.5 transition-colors"
        />
        <div className="ml-auto flex items-center gap-2">
          <button onClick={handleSave} disabled={saving} className="btn-secondary py-2 px-4 text-sm flex items-center gap-2">
            <FiSave size={14} /> {saving ? 'Saving...' : 'Save'}
          </button>
          <button onClick={handleShare} className="btn-sage py-2 px-4 text-sm flex items-center gap-2">
            <FiShare2 size={14} /> Share
          </button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Left panel */}
        <aside className="w-72 bg-white border-r border-beige-200 flex flex-col overflow-hidden">
          {/* Panel tabs */}
          <div className="flex border-b border-beige-200">
            {(['templates', 'catalog', 'custom'] as const).map((p) => (
              <button
                key={p}
                onClick={() => { setPanel(p); if (p === 'catalog') loadCatalog(); }}
                className={`flex-1 py-2.5 text-xs font-medium capitalize transition-colors ${panel === p ? 'text-sage-700 border-b-2 border-sage-600' : 'text-earth-500 hover:text-bark'}`}
              >
                {p === 'templates' ? 'Templates' : p === 'catalog' ? 'Add Furniture' : 'Custom Dims'}
              </button>
            ))}
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {panel === 'templates' && (
              <>
                <p className="text-xs text-earth-400 mb-2">Select a room template or set custom dimensions</p>
                {ROOM_TEMPLATES.map((t) => (
                  <button
                    key={t.name}
                    onClick={() => applyTemplate(t)}
                    className={`w-full text-left p-3 rounded-xl border-2 transition-all ${room.width === t.dimensions.width && room.length === t.dimensions.length ? 'border-sage-500 bg-sage-50' : 'border-beige-200 hover:border-sage-300'}`}
                  >
                    <div className="font-medium text-sm text-bark">{t.name}</div>
                    <div className="text-xs text-earth-500 mt-0.5">
                      {t.dimensions.width}m × {t.dimensions.length}m × {t.dimensions.height}m
                    </div>
                  </button>
                ))}
              </>
            )}

            {panel === 'custom' && (
              <div className="space-y-3">
                <p className="text-xs text-earth-400">Set room dimensions in meters</p>
                {(['width', 'length', 'height'] as const).map((dim) => (
                  <div key={dim}>
                    <label className="text-xs font-medium text-earth-600 capitalize mb-1 block">{dim} (m)</label>
                    <input
                      type="number"
                      min="1" max="20" step="0.1"
                      value={customDims[dim]}
                      onChange={(e) => setCustomDims((p) => ({ ...p, [dim]: e.target.value }))}
                      className="input-field text-sm"
                    />
                  </div>
                ))}
                <button onClick={applyCustomDims} className="btn-primary w-full py-2 text-sm">Apply Dimensions</button>
              </div>
            )}

            {panel === 'catalog' && (
              <div className="space-y-2">
                <p className="text-xs text-earth-400 mb-2">Click to add furniture to your room</p>
                {!catalogLoaded ? (
                  <div className="flex justify-center py-8">
                    <div className="w-8 h-8 border-2 border-beige-200 border-t-sage-500 rounded-full animate-spin" />
                  </div>
                ) : (
                  catalogItems.map((item) => (
                    <button
                      key={item.item_id}
                      onClick={() => addFurniture(item)}
                      className="w-full text-left p-3 rounded-xl border border-beige-200 hover:border-sage-400 hover:bg-sage-50 transition-all flex items-center gap-3"
                    >
                      <div className="w-10 h-10 rounded-lg bg-beige-100 flex items-center justify-center text-earth-400 flex-shrink-0">
                        <FiBox size={18} />
                      </div>
                      <div className="min-w-0">
                        <div className="font-medium text-xs text-bark line-clamp-1">{item.name}</div>
                        <div className="text-xs text-earth-500">EGP {item.price?.toLocaleString()}</div>
                      </div>
                      <FiPlus size={14} className="ml-auto text-sage-500 flex-shrink-0" />
                    </button>
                  ))
                )}
              </div>
            )}
          </div>

          {/* Placed furniture list */}
          {placedFurniture.length > 0 && (
            <div className="border-t border-beige-200 p-3">
              <p className="text-xs font-medium text-earth-600 mb-2">In Room ({placedFurniture.length})</p>
              <div className="space-y-1 max-h-40 overflow-y-auto">
                {placedFurniture.map((p) => (
                  <div
                    key={p.id}
                    className={`flex items-center gap-2 p-2 rounded-lg cursor-pointer transition-colors ${selectedId === p.id ? 'bg-sage-100' : 'hover:bg-beige-50'}`}
                    onClick={() => setSelectedId(p.id)}
                  >
                    <FiBox size={13} className="text-earth-400 flex-shrink-0" />
                    <span className="text-xs text-bark truncate flex-1">{p.name}</span>
                    <button
                      onClick={(e) => { e.stopPropagation(); removeFurniture(p.id); }}
                      className="text-red-400 hover:text-red-600"
                    >
                      <FiTrash2 size={12} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </aside>

        {/* 3D Canvas */}
        <div className="flex-1 relative overflow-hidden">
          <VirtualRoomScene
            room={room}
            placedFurniture={placedFurniture}
            selectedId={selectedId}
            onSelect={setSelectedId}
            onUpdate={updateFurniture}
          />

          {/* Controls hint */}
          <div className="absolute bottom-4 left-4 bg-bark/70 text-cream text-xs rounded-xl px-3 py-2 backdrop-blur-sm">
            🖱 Left click: select · Right drag: pan · Scroll: zoom · Middle drag: orbit
          </div>
        </div>

        {/* Right panel — selected item controls */}
        <AnimatePresence>
          {selected && (
            <motion.aside
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 220, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              className="bg-white border-l border-beige-200 overflow-hidden flex-shrink-0"
            >
              <div className="p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium text-bark text-sm line-clamp-1">{selected.name}</h3>
                  <button onClick={() => removeFurniture(selected.id)} className="text-red-400 hover:text-red-600">
                    <FiTrash2 size={14} />
                  </button>
                </div>

                <div>
                  <label className="text-xs text-earth-500 block mb-1.5 flex items-center gap-1"><FiRotateCw size={11} /> Rotation</label>
                  <input
                    type="range" min="0" max="360" step="15"
                    value={selected.rotation}
                    onChange={(e) => updateFurniture(selected.id, { rotation: Number(e.target.value) })}
                    className="w-full accent-sage-500"
                  />
                  <span className="text-xs text-earth-400">{selected.rotation}°</span>
                </div>

                <div>
                  <label className="text-xs text-earth-500 block mb-1.5">Scale</label>
                  <input
                    type="range" min="0.5" max="2" step="0.1"
                    value={selected.scale}
                    onChange={(e) => updateFurniture(selected.id, { scale: Number(e.target.value) })}
                    className="w-full accent-sage-500"
                  />
                  <span className="text-xs text-earth-400">{selected.scale}×</span>
                </div>

                <div>
                  <label className="text-xs text-earth-500 block mb-1.5">Color</label>
                  <input
                    type="color"
                    value={selected.color}
                    onChange={(e) => updateFurniture(selected.id, { color: e.target.value })}
                    className="w-full h-10 rounded-lg border border-beige-200 cursor-pointer p-1"
                  />
                </div>

                <div className="text-xs text-earth-400 space-y-1 bg-beige-50 rounded-lg p-3">
                  <p className="font-medium text-earth-600 mb-1">Position (m)</p>
                  {(['x', 'z'] as const).map((axis, i) => (
                    <div key={axis} className="flex items-center gap-2">
                      <span className="w-4 font-mono">{axis.toUpperCase()}</span>
                      <input
                        type="number" step="0.1"
                        value={selected.position[axis === 'x' ? 0 : 2].toFixed(1)}
                        onChange={(e) => {
                          const pos = [...selected.position] as [number, number, number];
                          pos[axis === 'x' ? 0 : 2] = parseFloat(e.target.value) || 0;
                          updateFurniture(selected.id, { position: pos });
                        }}
                        className="input-field text-xs py-1 px-2"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </motion.aside>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
