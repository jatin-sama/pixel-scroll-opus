import { useState } from "react";
import { motion } from "framer-motion";
import { Wand2 } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

interface SceneInputProps {
  onProcess: (scene: string) => void;
  isProcessing: boolean;
  disabled: boolean;
}

const SceneInput = ({ onProcess, isProcessing, disabled }: SceneInputProps) => {
  const [scene, setScene] = useState("");

  const handleSubmit = () => {
    if (scene.trim()) {
      onProcess(scene.trim());
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5, duration: 0.5 }}
      className="w-full space-y-4"
    >
      <h3 className="text-2xl font-pixel text-primary mb-4 uppercase tracking-wider neon-glow">
        Scene Description
      </h3>
      
      <div className="space-y-4">
        <Textarea
          placeholder="Describe the scene you want to create... (e.g., 'A hero facing a powerful enemy in a dramatic battle')"
          value={scene}
          onChange={(e) => setScene(e.target.value)}
          className="min-h-32 font-mono text-sm pixel-panel"
          disabled={disabled}
        />
        
        <Button
          onClick={handleSubmit}
          disabled={!scene.trim() || disabled || isProcessing}
          className="w-full pixel-button"
        >
          <motion.div
            animate={isProcessing ? { rotate: 360 } : {}}
            transition={{ duration: 1, repeat: isProcessing ? Infinity : 0 }}
          >
            <Wand2 className="w-5 h-5 mr-2" />
          </motion.div>
          {isProcessing ? "Generating Manga Panel..." : "Generate Manga Panel"}
        </Button>
      </div>
      
      {disabled && (
        <p className="text-muted-foreground text-sm font-mono text-center">
          Upload an image first to generate manga panels
        </p>
      )}
    </motion.div>
  );
};

export default SceneInput;