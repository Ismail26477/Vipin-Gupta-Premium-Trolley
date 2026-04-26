import { useState, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ZoomIn, ZoomOut, ChevronLeft, ChevronRight, X } from "lucide-react";

interface ProductImageGalleryProps {
  images: string[];
  name: string;
  discount?: number;
}

export default function ProductImageGallery({ images, name, discount }: ProductImageGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomPos, setZoomPos] = useState({ x: 50, y: 50 });
  const [fullscreen, setFullscreen] = useState(false);
  const [pinchScale, setPinchScale] = useState(1);
  const lastTouchDist = useRef(0);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!isZoomed) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setZoomPos({ x, y });
  }, [isZoomed]);

  const handleTouchMove = useCallback((e: React.TouchEvent<HTMLDivElement>) => {
    if (e.touches.length === 2) {
      e.preventDefault();
      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (lastTouchDist.current > 0) {
        const scale = dist / lastTouchDist.current;
        setPinchScale(prev => Math.min(4, Math.max(1, prev * scale)));
      }
      lastTouchDist.current = dist;
    }
  }, []);

  const handleTouchEnd = useCallback(() => {
    lastTouchDist.current = 0;
    if (pinchScale <= 1.1) setPinchScale(1);
  }, [pinchScale]);

  const goTo = (index: number) => {
    setActiveIndex(index);
    setIsZoomed(false);
    setPinchScale(1);
  };

  const prev = () => goTo(activeIndex === 0 ? images.length - 1 : activeIndex - 1);
  const next = () => goTo(activeIndex === images.length - 1 ? 0 : activeIndex + 1);

  return (
    <>
      <div className="space-y-3">
        {/* Main image */}
        <div
          className="relative aspect-square rounded-2xl overflow-hidden bg-secondary cursor-crosshair group"
          onMouseMove={handleMouseMove}
          onClick={() => setIsZoomed(!isZoomed)}
          onDoubleClick={() => setFullscreen(true)}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <AnimatePresence mode="wait">
            <motion.img
              key={activeIndex}
              src={images[activeIndex]}
              alt={`${name} - Image ${activeIndex + 1}`}
              className="w-full h-full object-cover select-none"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              style={isZoomed ? {
                transform: `scale(2.5)`,
                transformOrigin: `${zoomPos.x}% ${zoomPos.y}%`,
              } : pinchScale > 1 ? {
                transform: `scale(${pinchScale})`,
              } : undefined}
              draggable={false}
            />
          </AnimatePresence>

          {discount && discount > 0 && (
            <span className="absolute top-4 left-4 bg-destructive text-destructive-foreground text-sm font-bold px-3 py-1 rounded-full z-10">
              -{discount}%
            </span>
          )}

          <div className="absolute top-4 right-4 bg-card/80 backdrop-blur-sm rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
            {isZoomed ? <ZoomOut className="w-4 h-4 text-foreground" /> : <ZoomIn className="w-4 h-4 text-foreground" />}
          </div>

          <p className="absolute bottom-10 left-1/2 -translate-x-1/2 text-[10px] text-primary-foreground/70 bg-black/40 rounded-full px-3 py-1 opacity-0 group-hover:opacity-100 transition-opacity z-10">
            Click to zoom • Double-click for fullscreen
          </p>

          {images.length > 1 && (
            <>
              <button onClick={(e) => { e.stopPropagation(); prev(); }} className="absolute left-2 top-1/2 -translate-y-1/2 bg-card/80 backdrop-blur-sm rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity z-10 hover:bg-card">
                <ChevronLeft className="w-5 h-5 text-foreground" />
              </button>
              <button onClick={(e) => { e.stopPropagation(); next(); }} className="absolute right-2 top-1/2 -translate-y-1/2 bg-card/80 backdrop-blur-sm rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity z-10 hover:bg-card">
                <ChevronRight className="w-5 h-5 text-foreground" />
              </button>
            </>
          )}

          {images.length > 1 && (
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-card/80 backdrop-blur-sm rounded-full px-3 py-1 text-xs font-medium text-foreground z-10">
              {activeIndex + 1} / {images.length}
            </div>
          )}
        </div>

        {/* Thumbnails */}
        {images.length > 1 && (
          <div className="flex gap-2 overflow-x-auto pb-1">
            {images.map((img, i) => (
              <button key={i} onClick={() => goTo(i)} className={`shrink-0 w-16 h-16 md:w-20 md:h-20 rounded-lg overflow-hidden border-2 transition-all ${i === activeIndex ? "border-primary ring-2 ring-primary/20" : "border-border hover:border-muted-foreground/50"}`}>
                <img src={img} alt={`${name} thumbnail ${i + 1}`} className="w-full h-full object-cover" loading="lazy" />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Fullscreen overlay */}
      {fullscreen && (
        <div className="fixed inset-0 z-[100] bg-black flex items-center justify-center" onClick={() => setFullscreen(false)}>
          <button className="absolute top-4 right-4 text-white z-10"><X className="w-8 h-8" /></button>
          <img src={images[activeIndex]} alt={name} className="max-w-full max-h-full object-contain" />
          {images.length > 1 && (
            <>
              <button onClick={(e) => { e.stopPropagation(); prev(); }} className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 rounded-full p-2"><ChevronLeft className="w-6 h-6 text-white" /></button>
              <button onClick={(e) => { e.stopPropagation(); next(); }} className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 rounded-full p-2"><ChevronRight className="w-6 h-6 text-white" /></button>
            </>
          )}
        </div>
      )}
    </>
  );
}
