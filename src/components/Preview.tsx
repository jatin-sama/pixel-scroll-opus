import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Pause, RotateCcw, Download } from "lucide-react";
import { toast } from "sonner";

interface Panel {
  id: string;
  file: File;
  url: string;
}

interface PreviewProps {
  panels: Panel[];
}

const Preview = ({ panels }: PreviewProps) => {
  const [currentPanel, setCurrentPanel] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);

  useEffect(() => {
    if (!isPlaying || panels.length === 0) return;

    const interval = setInterval(() => {
      setCurrentPanel((prev) => {
        const next = prev + 1;
        if (next >= panels.length) {
          setIsPlaying(false);
          return 0;
        }
        return next;
      });
    }, 2000); // 2 seconds per panel

    return () => clearInterval(interval);
  }, [isPlaying, panels.length]);

  const handlePlay = () => {
    if (panels.length === 0) {
      toast.error("Please upload some panels first");
      return;
    }
    
    setIsPlaying(!isPlaying);
    setHasStarted(true);
  };

  const handleReset = () => {
    setIsPlaying(false);
    setCurrentPanel(0);
    setHasStarted(false);
  };

  const handleExport = () => {
    toast.success("Download feature coming soon!", {
      description: "Export functionality will be available in the next update"
    });
  };

  if (panels.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.5 }}
        className="w-full pixel-panel p-8 bg-dark-surface/30"
      >
        <div className="text-center">
          <motion.div
            className="w-32 h-32 mx-auto mb-6 border-2 border-dashed border-pixel-border flex items-center justify-center"
            animate={{
              borderColor: ["hsl(var(--pixel-border))", "hsl(var(--primary))", "hsl(var(--pixel-border))"]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              repeatType: "reverse"
            }}
          >
            <Play className="w-12 h-12 text-muted-foreground" />
          </motion.div>
          
          <h3 className="text-xl font-pixel text-muted-foreground mb-2 uppercase">
            Preview Panel
          </h3>
          <p className="text-muted-foreground font-mono text-sm">
            Upload panels to see the animation preview
          </p>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5, duration: 0.5 }}
      className="w-full"
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-2xl font-pixel text-primary uppercase tracking-wider neon-glow">
          Animation Preview
        </h3>
        
        <div className="flex items-center gap-3">
          <motion.button
            onClick={handlePlay}
            className={`pixel-button ${isPlaying ? 'secondary' : ''} px-6 py-2`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {isPlaying ? (
              <>
                <Pause className="w-4 h-4 mr-2" />
                PAUSE
              </>
            ) : (
              <>
                <Play className="w-4 h-4 mr-2" />
                PLAY
              </>
            )}
          </motion.button>
          
          <motion.button
            onClick={handleReset}
            className="pixel-button accent px-4 py-2"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <RotateCcw className="w-4 h-4" />
          </motion.button>
          
          <motion.button
            onClick={handleExport}
            className="pixel-button secondary px-6 py-2"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Download className="w-4 h-4 mr-2" />
            EXPORT
          </motion.button>
        </div>
      </div>

      {/* Preview Container */}
      <div className="pixel-panel bg-dark-bg/50 p-6 min-h-96 flex items-center justify-center relative overflow-hidden">
        {/* Panel Progress Indicator */}
        <div className="absolute top-4 left-4 pixel-panel bg-primary/20 px-3 py-1">
          <span className="text-primary font-pixel text-sm font-bold">
            {currentPanel + 1} / {panels.length}
          </span>
        </div>

        {/* Progress Bar */}
        <div className="absolute top-4 right-4 w-32">
          <div className="h-2 bg-pixel-border">
            <motion.div
              className="h-full bg-gradient-to-r from-neon-green to-neon-cyan"
              initial={{ width: "0%" }}
              animate={{ 
                width: `${((currentPanel + (isPlaying ? 1 : 0)) / panels.length) * 100}%` 
              }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>

        {/* Panel Animation */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentPanel}
            initial={{ 
              opacity: 0, 
              scale: 0.8,
              x: 100,
              rotateY: -15
            }}
            animate={{ 
              opacity: 1, 
              scale: 1,
              x: 0,
              rotateY: 0
            }}
            exit={{ 
              opacity: 0, 
              scale: 1.1,
              x: -100,
              rotateY: 15
            }}
            transition={{ 
              duration: 0.8,
              ease: "easeInOut"
            }}
            className="max-w-full max-h-full flex items-center justify-center"
          >
            <motion.img
              src={panels[currentPanel]?.url}
              alt={`Panel ${currentPanel + 1}`}
              className="max-w-full max-h-80 object-contain border-2 border-primary/50 shadow-2xl"
              style={{ imageRendering: 'pixelated' }}
              whileHover={{ scale: 1.02 }}
              animate={isPlaying ? {
                boxShadow: [
                  "0 0 20px rgba(0, 255, 0, 0.5)",
                  "0 0 40px rgba(0, 255, 255, 0.8)",
                  "0 0 20px rgba(0, 255, 0, 0.5)"
                ]
              } : {}}
              transition={isPlaying ? {
                duration: 1,
                repeat: Infinity,
                repeatType: "reverse"
              } : {}}
            />
          </motion.div>
        </AnimatePresence>

        {/* Cyber effects */}
        {isPlaying && (
          <>
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-neon-cyan/10 to-transparent"
              animate={{ x: ["-100%", "100%"] }}
              transition={{
                duration: 2,
                repeat: Infinity,
                repeatType: "loop",
                ease: "linear"
              }}
            />
            
            <div className="absolute inset-0 cyber-grid animate-pulse" />
          </>
        )}
      </div>

      {/* Panel Thumbnails */}
      <div className="mt-6 flex gap-2 overflow-x-auto pb-2">
        {panels.map((panel, index) => (
          <motion.button
            key={panel.id}
            onClick={() => setCurrentPanel(index)}
            className={`
              flex-shrink-0 w-16 h-16 border-2 transition-all duration-300
              ${index === currentPanel 
                ? 'border-primary shadow-lg shadow-primary/50' 
                : 'border-pixel-border hover:border-secondary'
              }
            `}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <img
              src={panel.url}
              alt={`Thumbnail ${index + 1}`}
              className="w-full h-full object-cover"
              style={{ imageRendering: 'pixelated' }}
            />
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
};

export default Preview;