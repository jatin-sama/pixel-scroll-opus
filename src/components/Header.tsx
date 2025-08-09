import { motion } from "framer-motion";

const Header = () => {
  return (
    <motion.header 
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="w-full border-b border-pixel-border bg-dark-surface/50 backdrop-blur-sm"
    >
      <div className="container mx-auto px-4 py-6">
        <motion.div 
          className="text-center"
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <h1 className="text-4xl md:text-6xl font-pixel font-black text-primary mb-2 neon-glow animate-glow">
            MANGA ANIMATOR
          </h1>
          <motion.div 
            className="h-1 w-32 bg-gradient-to-r from-neon-green via-neon-cyan to-neon-purple mx-auto mb-4"
            initial={{ width: 0 }}
            animate={{ width: 128 }}
            transition={{ delay: 0.5, duration: 0.8 }}
          />
          <p className="text-lg text-muted-foreground font-mono uppercase tracking-wider">
            Transform static panels into animated stories
          </p>
        </motion.div>
      </div>
    </motion.header>
  );
};

export default Header;