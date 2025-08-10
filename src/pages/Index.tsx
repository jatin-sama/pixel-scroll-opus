import { useState } from "react";
import { motion } from "framer-motion";
import Header from "@/components/Header";
import UploadArea from "@/components/UploadArea";
import PanelEditor from "@/components/PanelEditor";
import Preview from "@/components/Preview";
import SceneInput from "@/components/SceneInput";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface Panel {
  id: string;
  file: File;
  url: string;
  mangaUrl?: string;
}

const Index = () => {
  const [panels, setPanels] = useState<Panel[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleFilesUploaded = (files: File[]) => {
    const newPanels: Panel[] = files.map(file => ({
      id: crypto.randomUUID(),
      file,
      url: URL.createObjectURL(file)
    }));
    
    setPanels(prev => [...prev, ...newPanels]);
  };

  const handlePanelsReorder = (reorderedPanels: Panel[]) => {
    setPanels(reorderedPanels);
  };

  const handlePanelRemove = (id: string) => {
    setPanels(prev => {
      const panel = prev.find(p => p.id === id);
      if (panel) {
        URL.revokeObjectURL(panel.url);
      }
      return prev.filter(p => p.id !== id);
    });
  };

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const result = reader.result as string;
        resolve(result.split(',')[1]); // Remove data:image/jpeg;base64, prefix
      };
      reader.onerror = error => reject(error);
    });
  };

  const handleProcessScene = async (scene: string) => {
    if (panels.length === 0) {
      toast.error("Please upload an image first");
      return;
    }

    setIsProcessing(true);
    try {
      // Process the first panel for now
      const panel = panels[0];
      const imageBase64 = await fileToBase64(panel.file);

      const { data, error } = await supabase.functions.invoke('process-manga-panel', {
        body: {
          imageBase64,
          scene
        }
      });

      if (error) {
        console.error('Error processing manga panel:', error);
        toast.error('Failed to generate manga panel');
        return;
      }

      // Update the panel with the generated manga URL
      setPanels(prev => prev.map(p => 
        p.id === panel.id ? { ...p, mangaUrl: data.mangaPanelUrl } : p
      ));

      toast.success('Manga panel generated successfully!');
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to generate manga panel');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Cyber grid background */}
      <div className="fixed inset-0 cyber-grid pointer-events-none opacity-20" />
      
      {/* Animated background gradients */}
      <div className="fixed inset-0 pointer-events-none">
        <motion.div
          className="absolute top-0 left-0 w-96 h-96 bg-gradient-radial from-neon-green/20 to-transparent rounded-full blur-3xl"
          animate={{
            x: [0, 100, 0],
            y: [0, 50, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            repeatType: "reverse"
          }}
        />
        <motion.div
          className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-radial from-neon-purple/20 to-transparent rounded-full blur-3xl"
          animate={{
            x: [0, -100, 0],
            y: [0, -50, 0],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            repeatType: "reverse"
          }}
        />
      </div>

      <div className="relative z-10">
        <Header />
        
        <main className="container mx-auto px-4 py-8 space-y-8">
          {/* Instructions */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="text-center py-6"
          >
            <h2 className="text-2xl font-pixel text-primary mb-4 uppercase tracking-wider">
              How It Works
            </h2>
            <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              <div className="pixel-panel p-4 bg-dark-surface/20 backdrop-blur-sm">
                <div className="text-3xl font-pixel text-primary mb-2">01</div>
                <h3 className="font-pixel text-lg mb-2">Upload Image</h3>
                <p className="text-sm text-muted-foreground font-mono">
                  Upload your base image or artwork
                </p>
              </div>
              <div className="pixel-panel p-4 bg-dark-surface/20 backdrop-blur-sm">
                <div className="text-3xl font-pixel text-primary mb-2">02</div>
                <h3 className="font-pixel text-lg mb-2">Describe Scene</h3>
                <p className="text-sm text-muted-foreground font-mono">
                  Write your scene description and story
                </p>
              </div>
              <div className="pixel-panel p-4 bg-dark-surface/20 backdrop-blur-sm">
                <div className="text-3xl font-pixel text-primary mb-2">03</div>
                <h3 className="font-pixel text-lg mb-2">Generate Panel</h3>
                <p className="text-sm text-muted-foreground font-mono">
                  AI transforms it into manga style
                </p>
              </div>
            </div>
          </motion.section>

          {/* Upload Section */}
          <section>
            <UploadArea onFilesUploaded={handleFilesUploaded} />
          </section>

          {/* Scene Input Section */}
          <section className="pixel-panel p-6 bg-dark-surface/30 backdrop-blur-sm">
            <SceneInput 
              onProcess={handleProcessScene}
              isProcessing={isProcessing}
              disabled={panels.length === 0}
            />
          </section>

          {/* Main Content Grid */}
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Panel Editor */}
            <section className="pixel-panel p-6 bg-dark-surface/30 backdrop-blur-sm">
              <PanelEditor
                panels={panels}
                onPanelsReorder={handlePanelsReorder}
                onPanelRemove={handlePanelRemove}
              />
            </section>

            {/* Preview */}
            <section className="pixel-panel p-6 bg-dark-surface/30 backdrop-blur-sm">
              <Preview panels={panels} />
            </section>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Index;
