/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import { ChevronRight, LayoutDashboard, BarChart3, Globe, CloudSun, Wind, Droplets, Thermometer } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

import screen0 from './assets/screen_0.png';
import screen1 from './assets/screen_1.png';
import screen2 from './assets/screen_2.png';

// Configuration for the display screens categorized as per the reference image
const CATEGORIES = [
  {
    id: 'agri',
    name: '农业',
    items: [
      { id: '1', title: '建阳桔柚', url: screen0, fallback: 'https://picsum.photos/seed/citrus/3840/2160' },
      { id: '2', title: '建瓯玉米', url: screen1, fallback: 'https://picsum.photos/seed/corn/3840/2160' },
      { id: '3', title: '邵武黄精', url: 'https://picsum.photos/seed/huangjing/3840/2160', fallback: 'https://picsum.photos/seed/huangjing/3840/2160' },
      { id: '4', title: '浦城水稻制种', url: 'https://picsum.photos/seed/pucheng-rice/3840/2160', fallback: 'https://picsum.photos/seed/pucheng-rice/3840/2160' },
      { id: '5', title: '光泽稻花鱼', url: screen2, fallback: 'https://picsum.photos/seed/fish/3840/2160' },
      { id: '6', title: '光泽生态农场', url: 'https://picsum.photos/seed/farm/3840/2160', fallback: 'https://picsum.photos/seed/farm/3840/2160' },
    ]
  },
  {
    id: 'tea',
    name: '茶园',
    items: [
      { id: '7', title: '武夷学院智慧茶园', url: 'https://picsum.photos/seed/tea1/3840/2160', fallback: 'https://picsum.photos/seed/tea1/3840/2160' },
      { id: '8', title: '武夷山倾上有机茶园', url: 'https://picsum.photos/seed/tea2/3840/2160', fallback: 'https://picsum.photos/seed/tea2/3840/2160' },
    ]
  },
  {
    id: 'ferry',
    name: '渡运',
    items: [
      { id: '9', title: '邵武卫闽镇渡运', url: 'https://picsum.photos/seed/ferry1/3840/2160', fallback: 'https://picsum.photos/seed/ferry1/3840/2160' },
      { id: '10', title: '武夷山城村村渡运', url: 'https://picsum.photos/seed/ferry2/3840/2160', fallback: 'https://picsum.photos/seed/ferry2/3840/2160' },
    ]
  },
  {
    id: 'tour',
    name: '旅游',
    items: [
      { id: '11', title: '建阳云谷旅游驿站', url: 'https://picsum.photos/seed/tour1/3840/2160', fallback: 'https://picsum.photos/seed/tour1/3840/2160' },
      { id: '12', title: '建阳考亭旅游驿站', url: 'https://picsum.photos/seed/tour2/3840/2160', fallback: 'https://picsum.photos/seed/tour2/3840/2160' },
    ]
  },
  {
    id: 'eco',
    name: '生态',
    items: [
      { id: '13', title: '松溪生态驿站', url: 'https://picsum.photos/seed/eco1/3840/2160', fallback: 'https://picsum.photos/seed/eco1/3840/2160' },
      { id: '14', title: '延平宝珠村生态驿站', url: 'https://picsum.photos/seed/eco2/3840/2160', fallback: 'https://picsum.photos/seed/eco2/3840/2160' },
    ]
  }
];

// Flatten for easier indexing
const ALL_SCREENS = CATEGORIES.flatMap(cat => cat.items);

const CAROUSEL_INTERVAL = 30000; // 30 seconds per screen

export default function App() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scale, setScale] = useState(0.2); 
  const [loadError, setLoadError] = useState<Record<string, boolean>>({});
  const [useFallback, setUseFallback] = useState<Record<string, boolean>>({});

  // Helper to get absolute URL for images
  const getFullUrl = (url: string) => {
    if (url.startsWith('http')) return url;
    // Standard root-relative path is usually best for SPAs
    const finalUrl = url.startsWith('/') ? url : `/${url}`;
    console.log(`[DEBUG] Final URL for image: ${finalUrl}`);
    return finalUrl;
  };

  // Calculate scale to fit 4K content into current viewport
  const updateScale = useCallback(() => {
    const width = window.innerWidth || 1920;
    const height = window.innerHeight || 1080;
    const targetWidth = 3840;
    const targetHeight = 2160;
    const scaleX = width / targetWidth;
    const scaleY = height / targetHeight;
    const newScale = Math.min(scaleX, scaleY);
    // Ensure scale is never zero and has a reasonable minimum
    setScale(newScale > 0.01 ? newScale : 0.2);
  }, []);

  useEffect(() => {
    updateScale();
    // Re-run after a short delay to ensure window dimensions are ready
    const timer = setTimeout(updateScale, 100);
    const timer2 = setTimeout(updateScale, 500); // Second check for slow loads
    window.addEventListener('resize', updateScale);
    return () => {
      window.removeEventListener('resize', updateScale);
      clearTimeout(timer);
      clearTimeout(timer2);
    };
  }, [updateScale]);

  const handleSwitch = useCallback((index: number) => {
    // Prevent switching if already transitioning or already on that index
    if (index === currentIndex || isTransitioning) return;
    
    setIsMenuOpen(false);
    setIsTransitioning(true);
    setCurrentIndex(index);
  }, [currentIndex, isTransitioning]);

  // Handle transition completion
  useEffect(() => {
    if (isTransitioning) {
      const timer = setTimeout(() => {
        setIsTransitioning(false);
      }, 600);
      return () => clearTimeout(timer);
    }
  }, [isTransitioning]);

  useEffect(() => {
    // Auto-rotation timer
    if (isMenuOpen || isTransitioning) return;
    
    const timer = setTimeout(() => {
      handleSwitch((currentIndex + 1) % ALL_SCREENS.length);
    }, CAROUSEL_INTERVAL);
    
    return () => clearTimeout(timer);
  }, [currentIndex, isMenuOpen, isTransitioning, handleSwitch]);

  const handleImageError = (id: string) => {
    const screen = ALL_SCREENS.find(s => s.id === id);
    console.error(`[DEBUG] Image load failed for ID ${id}. URL: ${screen?.url}`);
    if (!useFallback[id]) {
      setUseFallback(prev => ({ ...prev, [id]: true }));
    } else {
      setLoadError(prev => ({ ...prev, [id]: true }));
    }
  };

  const handleImageLoad = () => {
    // No-op, kept for compatibility if needed
  };

  return (
    <div className="relative w-screen h-screen bg-[#000510] overflow-hidden font-sans select-none">
      {/* 4K Content Wrapper */}
      <div 
        className="screen-container"
        style={{ 
          transform: `translate(-50%, -50%) scale(${scale})`,
          opacity: scale > 0 ? 1 : 0 
        }}
      >
        <AnimatePresence initial={false}>
          <motion.div 
            key={currentIndex}
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
            className="absolute inset-0"
          >
            {useFallback[ALL_SCREENS[currentIndex].id] && (
              <div className="absolute top-4 left-4 z-[200] bg-red-600 text-white px-4 py-2 rounded-full text-sm font-bold animate-pulse shadow-lg">
                正在使用备用演示图片 (资源加载失败)
              </div>
            )}
            {loadError[ALL_SCREENS[currentIndex].id] ? (
              <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-[#001a3d] via-[#000a1a] to-[#001a3d] text-blue-400">
                <div className="absolute inset-0 opacity-20 pointer-events-none">
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] border border-blue-500/30 rounded-full animate-pulse" />
                </div>
                
                <motion.div 
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="relative z-10 flex flex-col items-center"
                >
                  <CloudSun size={180} className="mb-12 text-blue-500/40 animate-bounce" />
                  <div className="text-8xl font-black mb-6 tracking-tighter bg-gradient-to-b from-white to-blue-400 bg-clip-text text-transparent">
                    图片未找到
                  </div>
                  <div className="text-4xl opacity-70 font-light tracking-widest mb-12">
                    系统检测到资源文件缺失: <span className="text-blue-400 font-mono mx-4">{ALL_SCREENS[currentIndex].url}</span>
                  </div>
                </motion.div>
              </div>
            ) : (
              <img
                src={useFallback[ALL_SCREENS[currentIndex].id] ? ALL_SCREENS[currentIndex].fallback : getFullUrl(ALL_SCREENS[currentIndex].url)}
                className="w-full h-full object-cover"
                alt={ALL_SCREENS[currentIndex].title}
                onLoad={handleImageLoad}
                onError={() => handleImageError(ALL_SCREENS[currentIndex].id)}
                referrerPolicy="no-referrer"
              />
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Progress Bar */}
      {!isMenuOpen && (
        <div className="absolute bottom-0 left-0 w-full h-1.5 bg-blue-900/20 z-40">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: '100%' }}
            transition={{ duration: CAROUSEL_INTERVAL / 1000, ease: "linear" }}
            key={currentIndex}
            className="h-full bg-gradient-to-r from-blue-600 to-cyan-400 shadow-[0_0_15px_rgba(59,130,246,0.6)]"
          />
        </div>
      )}

      {/* Side Navigation Handle */}
      <div 
        className="absolute top-1/2 right-0 -translate-y-1/2 w-1.5 h-64 z-[100] cursor-pointer group"
        onMouseEnter={() => setIsMenuOpen(true)}
      >
        <div className="w-full h-full bg-blue-500/20 group-hover:bg-blue-400/40 transition-all duration-300 rounded-l-full" />
      </div>

      {/* Meteorological Sidebar */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMenuOpen(false)}
              className="absolute inset-0 bg-black/20 backdrop-blur-[2px] z-[110]"
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 150 }}
              onMouseLeave={() => setIsMenuOpen(false)}
              className="absolute top-0 right-0 w-[400px] h-full bg-gradient-to-b from-[#001a3d] via-[#00112b] to-[#000a1a] backdrop-blur-3xl border-l border-blue-500/40 z-[120] flex flex-col shadow-[-20px_0_100px_rgba(0,0,0,0.8)] overflow-hidden"
            >
              {/* Integrated Header */}
              <div className="w-full bg-gradient-to-b from-blue-600/20 to-transparent pt-12 pb-8 px-8 border-b border-blue-400/20">
                <div className="flex items-center gap-4">
                  <div className="w-2 h-10 bg-cyan-400 shadow-[0_0_20px_rgba(34,211,238,0.8)]" />
                  <h1 className="text-3xl font-black text-white tracking-[0.2em] uppercase italic drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]">南平气象服务站</h1>
                </div>
              </div>

              {/* Items List */}
              <div className="flex-1 py-6 px-6 flex flex-col gap-2 overflow-y-auto custom-scrollbar">
                {CATEGORIES.map((cat) => (
                  <div key={cat.id} className="mb-8">
                    <div className="flex items-center justify-between mb-4 px-2">
                      <span className="text-sm font-black text-cyan-400/80 uppercase tracking-[0.2em]">{cat.name}系列</span>
                      <div className="flex-1 h-[1px] bg-gradient-to-r from-cyan-500/30 to-transparent ml-4" />
                    </div>
                    <div className="grid grid-cols-1 gap-2">
                      {cat.items.map((item) => {
                        const globalIndex = ALL_SCREENS.findIndex(s => s.id === item.id);
                        const isActive = globalIndex === currentIndex;
                        return (
                          <button
                            key={item.id}
                            onClick={() => handleSwitch(globalIndex)}
                            className={`w-full text-left px-5 py-4 rounded-lg transition-all duration-300 group relative overflow-hidden border ${
                              isActive 
                                ? 'bg-blue-600/20 border-cyan-500/50 text-white shadow-[0_0_20px_rgba(34,211,238,0.15)]' 
                                : 'bg-white/5 border-transparent text-blue-100/40 hover:bg-white/10 hover:text-white hover:border-blue-500/30'
                            }`}
                          >
                            {isActive && (
                              <motion.div 
                                layoutId="item-active-glow"
                                className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-transparent pointer-events-none"
                              />
                            )}
                            <div className="flex items-center justify-between relative z-10">
                              <span className={`text-lg tracking-wide ${isActive ? 'font-bold' : 'font-medium'}`}>
                                {item.title}
                              </span>
                              {isActive && (
                                <motion.div 
                                  animate={{ scale: [1, 1.5, 1] }}
                                  transition={{ repeat: Infinity, duration: 2 }}
                                  className="w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_10px_rgba(34,211,238,1)]" 
                                />
                              )}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Preload images */}
      <div className="hidden">
        {ALL_SCREENS.map(screen => (
          <img 
            key={`preload-${screen.id}`} 
            src={getFullUrl(screen.url)} 
            alt="preload" 
            referrerPolicy="no-referrer"
          />
        ))}
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .clip-path-polygon {
          clip-path: polygon(15% 0, 100% 0, 100% 100%, 0% 100%);
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(34, 211, 238, 0.2);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(34, 211, 238, 0.4);
        }
      `}} />
    </div>
  );
}
