import { useParams, useNavigate } from "react-router-dom";
import { useStrategies } from "../../hooks/strategies";
import { Strategy } from "./strategy";
import { Button } from "../ui";
import { useTheme } from "../../contexts/ThemeContext";
import { motion } from "framer-motion";

export function StrategyDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { theme } = useTheme();
  const { strategies, loading } = useStrategies();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <h3 className="text-xl font-semibold">Loading Strategy...</h3>
        </div>
      </div>
    );
  }

  if (!strategies) {
    return (
      <div className="text-center py-8">
        <h3 className="text-xl font-semibold text-red-600">Failed to load strategies</h3>
        <Button
          onClick={() => navigate('/strategies')}
          className="mt-4"
          bg={theme === 'dark' ? '#a78bfa' : '#3b82f6'}
          textColor={theme === 'dark' ? '#22ff88' : '#ffffff'}
        >
          Back to Strategies
        </Button>
      </div>
    );
  }

  const strategyId = parseInt(id || '0');
  const strategy = strategies.find(s => s.id === strategyId);

  if (!strategy) {
    return (
      <div className="text-center py-8">
        <h3 className="text-xl font-semibold text-red-600">Strategy not found</h3>
        <p className="text-gray-500 mt-2">The strategy with ID {id} does not exist</p>
        <Button
          onClick={() => navigate('/strategies')}
          className="mt-4"
          bg={theme === 'dark' ? '#a78bfa' : '#3b82f6'}
          textColor={theme === 'dark' ? '#22ff88' : '#ffffff'}
        >
          Back to Strategies
        </Button>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Strategy
        value={strategy}
        onBack={() => navigate('/strategies')}
      />
    </motion.div>
  );
}
