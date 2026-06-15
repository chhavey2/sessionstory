import React, { useRef, useEffect, useState } from "react";
import simpleheat from "simpleheat";

const Heatmaps = () => {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const wrapperRef = useRef(null);
  const [url, setUrl] = useState("https://www.sessionstory.co/"); // Default or empty
  const [loading, setLoading] = useState(false);
  const [scrollHeight, setScrollHeight] = useState(2000);

  const fetchHeatmapData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token"); // Assuming auth token is here
      const res = await fetch(`${import.meta.env.VITE_API_URL}/session/heatmap?url=${encodeURIComponent(url)}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      if (res.ok) {
        const data = await res.json();
        
        // Find the maximum Y coordinate in the data to set the scroll height
        let maxY = 1000; // minimum height
        if (data && data.length > 0) {
          data.forEach(point => {
            if (point[1] > maxY) {
              maxY = point[1];
            }
          });
        }
        
        // Add padding to the bottom
        setScrollHeight(maxY + 300);
        
        // Draw the heatmap after state updates height (using setTimeout to ensure DOM is updated)
        setTimeout(() => {
          drawHeatmap(data.slice(0, 200));
        }, 50);
      }
    } catch (error) {
      console.error("Failed to fetch heatmap data", error);
    } finally {
      setLoading(false);
    }
  };

  const drawHeatmap = (data) => {
    console.log(data)
    if (!canvasRef.current || !wrapperRef.current) return;

    // Use the inner wrapper's dimensions which spans the full scroll height
    const width = wrapperRef.current.clientWidth;
    const height = wrapperRef.current.clientHeight;
    
    canvasRef.current.width = width;
    canvasRef.current.height = height;

    const heat = simpleheat(canvasRef.current);
    
    heat.data(data);
    heat.max(10); // Adjust max intensity based on your typical data density
    heat.radius(25, 15);
    heat.draw();
  };

  useEffect(() => {
    fetchHeatmapData();
    
    const handleResize = () => {
      fetchHeatmapData(); // Redraw on resize (could just call heat.draw if data is cached)
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [url]);

  return (
    <div className="flex flex-col h-screen w-full bg-slate-100">
      <div className="p-4 bg-white shadow-sm z-10 flex items-center gap-4">
        <h1 className="text-xl font-bold text-slate-800">Heatmaps</h1>
        <input 
          type="text" 
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Enter tracked URL (e.g. http://localhost:5173/)"
          className="border border-slate-300 rounded px-3 py-2 w-96 text-sm"
        />
        <button 
          onClick={fetchHeatmapData}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm font-medium transition-colors"
        >
          {loading ? "Loading..." : "Refresh"}
        </button>
      </div>

      {/* Container with overflow-y-auto to allow scrolling */}
      <div ref={containerRef} className="relative flex-1 w-full overflow-y-auto overflow-x-hidden">
        
        {/* Inner wrapper that forces the height based on data */}
        <div ref={wrapperRef} className="relative w-full" style={{ height: `2000px` }}>
          
          {/* Background iframe */}
          <iframe 
            src={url} 
            className="absolute inset-0 w-full h-full border-none pointer-events-none"
            title="Heatmap Background"
          />
          
          {/* Heatmap overlay */}
          <canvas 
            ref={canvasRef} 
            className="absolute inset-0 w-full h-full pointer-events-none"
            style={{ opacity: 0.7 }}
          />
        </div>
      </div>
    </div>
  );
};

export default Heatmaps;
