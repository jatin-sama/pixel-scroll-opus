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
        
        <main className="container mx-auto px-4 py-8 space-y-12">
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
