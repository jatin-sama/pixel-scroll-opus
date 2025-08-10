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
      
      <p className="text-muted-foreground font-mono text-sm mb-6 text-center">
        Describe the manga scene you want to create. Be specific about characters, actions, and emotions.
      </p>
      
      <div className="space-y-4">
        <Textarea
          placeholder="Example: 'A determined warrior stands on a cliff facing a massive dragon. The wind blows their cape dramatically as they raise their sword, ready for battle. Show intense emotion in their eyes.'"
          value={scene}
          onChange={(e) => setScene(e.target.value)}
          className="min-h-32 font-mono text-sm pixel-panel resize-none"
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
        <div className="text-center py-4 pixel-panel bg-muted/20 backdrop-blur-sm">
          <p className="text-muted-foreground text-sm font-mono">
            👆 Upload an image first, then describe your manga scene above
          </p>
        </div>
      )}
    </motion.div>
  );
};

export default SceneInput;