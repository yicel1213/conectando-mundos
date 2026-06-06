/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useRef, useState, useEffect } from 'react';
import { Palette, Trash2, Edit3, Eraser, Download, Check } from 'lucide-react';

export default function DrawingCanvas() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [brushColor, setBrushColor] = useState<string>('#18181b'); // Default dark
  const [brushSize, setBrushSize] = useState<number>(4);
  const [useEraser, setUseEraser] = useState<boolean>(false);
  
  // Available colors
  const colors = [
    { value: '#18181b', label: 'oscuro font-slate' },
    { value: '#ef4444', label: 'rojo' },
    { value: '#3b82f6', label: 'azul' },
    { value: '#10b981', label: 'verde' },
    { value: '#f59e0b', label: 'amarillo/naranja' },
  ];

  // Set up canvas sizing dynamically
  useEffect(() => {
    const handleResize = () => {
      const canvas = canvasRef.current;
      const container = containerRef.current;
      if (!canvas || !container) return;

      // Save drawing data before resize to restore
      const context = canvas.getContext('2d');
      let backup: ImageData | null = null;
      try {
        backup = context ? context.getImageData(0, 0, canvas.width, canvas.height) : null;
      } catch (e) {
        // Safe fail
      }

      const rect = container.getBoundingClientRect();
      const padding = 16; // internal padding
      const targetWidth = rect.width - padding * 2;
      const targetHeight = Math.max(280, rect.height - padding * 2 || 350);

      canvas.width = targetWidth;
      canvas.height = targetHeight;

      if (context) {
        // Redraw backup or set defaults
        context.lineCap = 'round';
        context.lineJoin = 'round';
        if (backup) {
          try {
            context.putImageData(backup, 0, 0);
          } catch (e) {}
        }
      }
    };

    handleResize();
    const observer = new ResizeObserver(handleResize);
    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // Set line props whenever state updates
  const prepareContext = (context: CanvasRenderingContext2D) => {
    context.lineCap = 'round';
    context.lineJoin = 'round';
    context.strokeStyle = useEraser ? '#ffffff' : brushColor;
    context.lineWidth = brushSize;
  };

  const getCoordinates = (e: React.MouseEvent | React.TouchEvent): { x: number; y: number } | null => {
    const canvas = canvasRef.current;
    if (!canvas) return null;

    const rect = canvas.getBoundingClientRect();
    let clientX = 0;
    let clientY = 0;

    if (e.nativeEvent instanceof TouchEvent) {
      if (e.nativeEvent.touches.length === 0) return null;
      clientX = e.nativeEvent.touches[0].clientX;
      clientY = e.nativeEvent.touches[0].clientY;
    } else if (e.nativeEvent instanceof MouseEvent) {
      clientX = e.nativeEvent.clientX;
      clientY = e.nativeEvent.clientY;
    } else {
      // General fallback
      const touchEv = e as React.TouchEvent;
      if (touchEv.touches && touchEv.touches.length > 0) {
        clientX = touchEv.touches[0].clientX;
        clientY = touchEv.touches[0].clientY;
      } else {
        const mouseEv = e as React.MouseEvent;
        clientX = mouseEv.clientX;
        clientY = mouseEv.clientY;
      }
    }

    // Scale coordination in canvas coordinates
    return {
      x: ((clientX - rect.left) / rect.width) * canvas.width,
      y: ((clientY - rect.top) / rect.height) * canvas.height,
    };
  };

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const coords = getCoordinates(e);
    if (!coords) return;

    // Prevent default scrolling on mobile touch
    if (e.nativeEvent instanceof TouchEvent) {
      e.preventDefault();
    }

    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext('2d');
    if (!context) return;

    context.beginPath();
    context.moveTo(coords.x, coords.y);
    setIsDrawing(true);
    prepareContext(context);
    
    // Draw single point
    context.lineTo(coords.x, coords.y);
    context.stroke();
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;

    const coords = getCoordinates(e);
    if (!coords) return;

    if (e.nativeEvent instanceof TouchEvent) {
      e.preventDefault();
    }

    const canvas = canvasRef.current;
    const context = canvas?.getContext('2d');
    if (!canvas || !context) return;

    prepareContext(context);
    context.lineTo(coords.x, coords.y);
    context.stroke();
  };

  const stopDrawing = () => {
    if (isDrawing) {
      const canvas = canvasRef.current;
      const context = canvas?.getContext('2d');
      if (context) {
        context.closePath();
      }
      setIsDrawing(false);
    }
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext('2d');
    if (canvas && context) {
      context.clearRect(0, 0, canvas.width, canvas.height);
    }
  };

  const downloadCanvasImage = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dataUrl = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.download = `pizarra-asistente-${Date.now()}.png`;
    link.href = dataUrl;
    link.click();
  };

  return (
    <div 
      id="drawing-canvas-section" 
      className="flex flex-col h-full bg-white/10 dark:bg-black/30 backdrop-blur-xl border border-white/25 dark:border-white/10 rounded-[32px] overflow-hidden shadow-2xl text-white animate-fade-in"
    >
      {/* Top brush toolbar controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-5 border-b border-white/20 dark:border-white/10 bg-white/10 dark:bg-black/20">
        <div className="flex items-center gap-4">
          <h2 className="text-sm font-bold text-white flex items-center gap-1.5">
            <Palette className="h-4.5 w-4.5 text-indigo-200" />
            Pizarra de Dibujo Rápido
          </h2>
          
          {/* Tool mode toggle draw/eraser */}
          <div className="flex bg-white/10 border border-white/15 p-0.5 rounded-xl">
            <button
              id="tool-brush-btn"
              onClick={() => setUseEraser(false)}
              className={`p-1.5 rounded-lg transition-all cursor-pointer ${!useEraser ? 'bg-white text-indigo-700 shadow-sm font-bold' : 'text-white/70 hover:text-white'}`}
              title="Pincel para dibujar"
            >
              <Edit3 className="h-4.5 w-4.5" />
            </button>
            <button
              id="tool-eraser-btn"
              onClick={() => setUseEraser(true)}
              className={`p-1.5 rounded-lg transition-all cursor-pointer ${useEraser ? 'bg-white text-indigo-700 shadow-sm font-bold' : 'text-white/70 hover:text-white'}`}
              title="Borrador"
            >
              <Eraser className="h-4.5 w-4.5" />
            </button>
          </div>
        </div>

        {/* Color presets and brush size slider */}
        <div className="flex items-center gap-3">
          {/* Brush color dot selection */}
          {!useEraser && (
            <div className="flex items-center gap-1.5 bg-white/10 p-1.5 rounded-xl border border-white/15">
              {colors.map((color) => (
                <button
                  key={color.value}
                  id={`color-btn-${color.value.replace('#', '')}`}
                  onClick={() => {
                    setBrushColor(color.value);
                    setUseEraser(false);
                  }}
                  className="relative h-5 w-5 rounded-full border border-white/30 flex items-center justify-center transition hover:scale-110 cursor-pointer"
                  style={{ backgroundColor: color.value }}
                  title={`Color ${color.label}`}
                >
                  {brushColor === color.value && !useEraser && (
                    <Check className="h-3 w-3 text-white mix-blend-difference font-black" />
                  )}
                </button>
              ))}
            </div>
          )}

          {/* Weight slider */}
          <div className="flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-xl border border-white/15 text-xs text-white/90">
            <span className="font-mono text-[10px] uppercase font-bold tracking-wider text-white/50">Grosor:</span>
            <input
              id="brush-size-slider"
              type="range"
              min="2"
              max="20"
              step="1"
              value={brushSize}
              onChange={(e) => setBrushSize(parseInt(e.target.value))}
              className="w-16 sm:w-24 h-1.5 bg-white/20 rounded-lg appearance-none cursor-pointer accent-white"
            />
            <span className="font-bold font-mono text-[11px]">{brushSize}px</span>
          </div>
        </div>
      </div>

      {/* Main active canvas drawing area */}
      <div 
        ref={containerRef} 
        id="canvas-draw-container" 
        className="flex-1 min-h-[300px] bg-white/5 p-4 relative flex items-center justify-center cursor-crosshair overflow-hidden"
      >
        <canvas
          ref={canvasRef}
          id="drawing-board-element"
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
          className="bg-white border border-white/25 rounded-2xl max-w-full cursor-pencil shadow-2xl"
        />

        {/* Floating guidance tag */}
        <div className="absolute bottom-6 left-6 bg-black/75 backdrop-blur-md text-white rounded-xl border border-white/15 py-1 px-3 text-[10px] uppercase tracking-wider font-bold font-mono shadow-md flex items-center gap-1.5 select-none">
          <span className="h-1.5 w-1.5 rounded-full bg-indigo-400 animate-ping"></span>
          <span>🖌️ Dibuja o escribe libremente</span>
        </div>
      </div>

      {/* Bottom operations toolbar */}
      <div className="p-4 border-t border-white/20 dark:border-white/10 bg-white/10 dark:bg-black/20 flex justify-between gap-3 flex-wrap">
        <button
          id="canvas-clear-all-btn"
          onClick={clearCanvas}
          className="flex items-center gap-1.5 px-4 py-2.5 text-xs font-bold text-white/80 hover:text-white bg-white/5 hover:bg-white/15 border border-white/10 hover:border-white/25 rounded-xl transition cursor-pointer"
        >
          <Trash2 className="h-4 w-4" />
          <span>Borrar Pizarra</span>
        </button>

        <button
          id="canvas-download-btn"
          onClick={downloadCanvasImage}
          className="flex items-center gap-1.5 px-4 py-2.5 text-xs font-bold text-white hover:text-indigo-100 bg-indigo-600/40 hover:bg-indigo-600/50 border border-white/20 rounded-xl transition cursor-pointer"
        >
          <Download className="h-4 w-4" />
          <span>Guardar Dibujo</span>
        </button>
      </div>
    </div>
  );
}
