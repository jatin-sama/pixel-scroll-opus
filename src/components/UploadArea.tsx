import { useCallback } from "react";
import { motion } from "framer-motion";
import { Upload, FileImage } from "lucide-react";
import { toast } from "sonner";

interface UploadAreaProps {
  onFilesUploaded: (files: File[]) => void;
}

const UploadArea = ({ onFilesUploaded }: UploadAreaProps) => {
  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files).filter(file => 
      file.type.startsWith('image/')
    );
    
    if (files.length === 0) {
      toast.error("Please upload image files only");
      return;
    }
    
    onFilesUploaded(files);
    toast.success(`Uploaded ${files.length} panel(s)`);
  }, [onFilesUploaded]);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    onFilesUploaded(files);
    toast.success(`Uploaded ${files.length} panel(s)`);
  }, [onFilesUploaded]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3, duration: 0.5 }}
      className="w-full"
    >
      <div
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        onDragEnter={(e) => e.preventDefault()}
        className="upload-zone relative min-h-64 flex flex-col items-center justify-center p-8 group"
      >
        <motion.div
          className="text-center"
          whileHover={{ scale: 1.05 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <motion.div
            animate={{ 
              rotate: [0, 5, -5, 0],
              scale: [1, 1.1, 1]
            }}
            transition={{ 
              duration: 2,
              repeat: Infinity,
              repeatType: "reverse"
            }}
          >
            <FileImage className="w-16 h-16 text-primary mb-4 mx-auto neon-glow" />
          </motion.div>
          
          <h3 className="text-xl font-pixel text-primary mb-2 uppercase tracking-wider">
            Upload Your Image
          </h3>
          
          <p className="text-muted-foreground mb-6 font-mono">
            Upload any image to transform into manga style panels
          </p>
          
          <label className="pixel-button inline-flex items-center gap-2 px-6 py-3 cursor-pointer">
            <Upload className="w-5 h-5" />
            SELECT FILES
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleFileSelect}
              className="hidden"
            />
          </label>
        </motion.div>

        {/* Cyber grid background */}
        <div className="absolute inset-0 cyber-grid pointer-events-none" />
        
        {/* Scanning line effect */}
        <motion.div
          className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-neon-cyan to-transparent"
          initial={{ x: "-100%" }}
          animate={{ x: "100%" }}
          transition={{
            duration: 3,
            repeat: Infinity,
            repeatType: "loop",
            ease: "linear"
          }}
        />
      </div>
    </motion.div>
  );
};

export default UploadArea;