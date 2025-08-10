import { motion } from "framer-motion";
import { Palette, Zap, BookOpen } from "lucide-react";

const Header = () => {
  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="relative py-12 text-center overflow-hidden"
    >
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-primary/5" />
      
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="relative z-10"
      >
        {/* Main Title */}
        <div className="flex items-center justify-center gap-4 mb-6">
          <motion.div
            animate={{ 
              rotate: [0, 5, -5, 0],
              scale: [1, 1.1, 1]
            }}
            transition={{ 
              duration: 3,
              repeat: Infinity,
              repeatType: "reverse"
            }}
          >
            <BookOpen className="w-12 h-12 text-primary neon-glow" />
          </motion.div>
          
          <h1 className="text-6xl font-pixel text-primary neon-glow uppercase tracking-wider">
            Manga Panel Generator
          </h1>
          
          <motion.div
            animate={{ 
              rotate: [0, -5, 5, 0],
              scale: [1, 1.1, 1]
            }}
            transition={{ 
              duration: 3,
              repeat: Infinity,
              repeatType: "reverse",
              delay: 1.5
            }}
          >
            <Palette className="w-12 h-12 text-primary neon-glow" />
          </motion.div>
        </div>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="text-xl text-muted-foreground font-mono mb-4"
        >
          Transform your images into professional manga panels with AI
        </motion.p>

        {/* Feature Tags */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="flex items-center justify-center gap-6 text-sm font-mono"
        >
          <div className="flex items-center gap-2 text-primary">
            <Zap className="w-4 h-4" />
            <span>AI-Powered</span>
          </div>
          <div className="w-px h-4 bg-border" />
          <div className="flex items-center gap-2 text-primary">
            <BookOpen className="w-4 h-4" />
            <span>Manga Style</span>
          </div>
          <div className="w-px h-4 bg-border" />
          <div className="flex items-center gap-2 text-primary">
            <Palette className="w-4 h-4" />
            <span>Black & White</span>
          </div>
        </motion.div>
      </motion.div>

      {/* Decorative Elements */}
      <motion.div
        className="absolute top-0 left-1/4 w-2 h-2 bg-primary rounded-full"
        animate={{ 
          scale: [1, 1.5, 1],
          opacity: [0.5, 1, 0.5]
        }}
        transition={{ 
          duration: 2,
          repeat: Infinity,
          repeatType: "reverse"
        }}
      />
      <motion.div
        className="absolute bottom-0 right-1/4 w-2 h-2 bg-primary rounded-full"
        animate={{ 
          scale: [1, 1.5, 1],
          opacity: [0.5, 1, 0.5]
        }}
        transition={{ 
          duration: 2,
          repeat: Infinity,
          repeatType: "reverse",
          delay: 1
        }}
      />
    </motion.header>
  );
};

export default Header;