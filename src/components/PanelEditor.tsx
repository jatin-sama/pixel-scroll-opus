import { useState } from "react";
import { motion, Reorder } from "framer-motion";
import { X, GripVertical } from "lucide-react";
import { toast } from "sonner";

interface Panel {
  id: string;
  file: File;
  url: string;
}

interface PanelEditorProps {
  panels: Panel[];
  onPanelsReorder: (panels: Panel[]) => void;
  onPanelRemove: (id: string) => void;
}

const PanelEditor = ({ panels, onPanelsReorder, onPanelRemove }: PanelEditorProps) => {
  const [draggedItem, setDraggedItem] = useState<string | null>(null);

  const handleRemove = (id: string) => {
    onPanelRemove(id);
    toast.success("Panel removed");
  };

  if (panels.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center py-12"
      >
        <p className="text-muted-foreground font-mono">No panels uploaded yet</p>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4, duration: 0.5 }}
      className="w-full"
    >
      <h3 className="text-2xl font-pixel text-primary mb-6 uppercase tracking-wider neon-glow">
        Panel Editor
      </h3>
      
      <Reorder.Group
        axis="y"
        values={panels}
        onReorder={onPanelsReorder}
        className="space-y-4"
      >
        {panels.map((panel, index) => (
          <Reorder.Item
            key={panel.id}
            value={panel}
            className="drag-panel relative p-4 bg-dark-surface/50 backdrop-blur-sm"
            whileDrag={{ 
              scale: 1.05, 
              rotateZ: 2,
              boxShadow: "0 0 20px rgba(0, 255, 0, 0.5)"
            }}
            onDragStart={() => setDraggedItem(panel.id)}
            onDragEnd={() => setDraggedItem(null)}
          >
            <div className="flex items-center gap-4">
              {/* Drag Handle */}
              <motion.div 
                className="text-primary cursor-grab active:cursor-grabbing"
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
              >
                <GripVertical className="w-6 h-6" />
              </motion.div>

              {/* Panel Number */}
              <div className="pixel-panel bg-primary/20 px-3 py-1 min-w-12 text-center">
                <span className="text-primary font-pixel font-bold text-sm">
                  {index + 1}
                </span>
              </div>

              {/* Panel Preview */}
              <div className="flex-1 flex items-center gap-4">
                <motion.div 
                  className="relative"
                  whileHover={{ scale: 1.05 }}
                >
                  <img
                    src={panel.url}
                    alt={`Panel ${index + 1}`}
                    className="w-20 h-20 object-cover border-2 border-pixel-border"
                    style={{ imageRendering: 'pixelated' }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-br from-transparent to-primary/10" />
                </motion.div>
                
                <div className="flex-1">
                  <p className="text-foreground font-mono text-sm font-medium">
                    {panel.file.name}
                  </p>
                  <p className="text-muted-foreground font-mono text-xs">
                    {(panel.file.size / 1024).toFixed(1)} KB
                  </p>
                </div>
              </div>

              {/* Remove Button */}
              <motion.button
                onClick={() => handleRemove(panel.id)}
                className="pixel-button secondary p-2"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <X className="w-4 h-4" />
              </motion.button>
            </div>

            {/* Glitch effect when dragging */}
            {draggedItem === panel.id && (
              <motion.div
                className="absolute inset-0 bg-primary/10 pointer-events-none"
                animate={{
                  opacity: [0.1, 0.3, 0.1],
                }}
                transition={{
                  duration: 0.2,
                  repeat: Infinity,
                  repeatType: "reverse"
                }}
              />
            )}
          </Reorder.Item>
        ))}
      </Reorder.Group>
    </motion.div>
  );
};

export default PanelEditor;