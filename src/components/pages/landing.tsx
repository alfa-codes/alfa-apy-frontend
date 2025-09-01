import { motion } from "framer-motion";
import { Button, Card } from "../ui";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../../contexts/ThemeContext";

export function Landing() {
  const navigate = useNavigate();
  const { theme } = useTheme();

  const stats = [
    { label: "Total Value Locked", value: "$2.5M+", change: "+15%" },
    { label: "Active Users", value: "1,200+", change: "+25%" },
    { label: "Average APY", value: "45.2%", change: "+8%" },
    { label: "Strategies", value: "12", change: "+3" },
  ];

  const features = [
    {
      icon: "🚀",
      title: "Highest APY",
      description: "Earn up to 65% APY with our optimized DeFi strategies"
    },
    {
      icon: "🛡️",
      title: "Secure & Audited",
      description: "All smart contracts are audited and battle-tested"
    },
    {
      icon: "⚡",
      title: "Instant Execution",
      description: "No waiting time - strategies execute immediately"
    },
    {
      icon: "📊",
      title: "Real-time Analytics",
      description: "Track your performance with detailed analytics"
    }
  ];

  const steps = [
    {
      number: "01",
      title: "Connect Wallet",
      description: "Connect your Internet Computer wallet securely"
    },
    {
      number: "02", 
      title: "Choose Strategy",
      description: "Select from our curated high-yield strategies"
    },
    {
      number: "03",
      title: "Deposit & Earn",
      description: "Start earning immediately with automated rebalancing"
    }
  ];

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'text-green-400' : 'text-gray-900'}`}>
      {/* Pre-Production Banner */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className={`w-full py-4 px-4 text-center shadow-sm ${
          theme === 'dark' 
            ? 'bg-gradient-to-r from-yellow-600/30 to-orange-600/30 border-b border-yellow-500/50' 
            : 'bg-gradient-to-r from-yellow-100 to-orange-100 border-b border-yellow-300'
        }`}
      >
        <div className="container mx-auto">
          <div className="flex items-center justify-center gap-3">
            <div className={`p-2 rounded-full ${
              theme === 'dark' ? 'bg-yellow-500/20' : 'bg-yellow-200'
            }`}>
              <span className="text-xl">⚠️</span>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center sm:gap-2">
              <span className={`font-bold text-lg ${
                theme === 'dark' ? 'text-yellow-400' : 'text-yellow-700'
              }`}>
                Pre-Production Stage
              </span>
              <span className={`text-sm sm:text-base ${
                theme === 'dark' ? 'text-yellow-300' : 'text-yellow-600'
              }`}>
                Data collection in progress. Statistics in strategies will be updating.
              </span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Hero Section */}
      <section className={`relative overflow-hidden py-20 ${
        theme === 'dark' 
          ? 'bg-gradient-to-br from-black/50 via-purple-900/50 to-black/50' 
          : 'bg-gradient-to-br from-amber-50/50 to-orange-100/50'
      }`}>
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-4xl mx-auto"
          >
            <h1 className={`text-5xl md:text-7xl font-bold mb-6 ${
              theme === 'dark'
                ? 'bg-gradient-to-r from-green-400 to-purple-400 bg-clip-text text-transparent'
                : 'bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent'
            }`}>
              Dominate DeFi
            </h1>
            <p className={`text-xl md:text-2xl mb-8 leading-relaxed ${
              theme === 'dark' ? 'text-green-300' : 'text-gray-700'
            }`}>
              Access the highest APY strategies on Internet Computer. 
              <br />
              <span className="font-semibold">Up to 65% annual returns</span> with automated rebalancing.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button
                onClick={() => navigate("/strategies")}
                className={`px-8 py-4 text-lg font-semibold ${
                  theme === 'dark' 
                    ? 'bg-purple-600 hover:bg-purple-700 text-white' 
                    : 'bg-amber-500 hover:bg-amber-600 text-white'
                }`}
              >
                View Strategies
              </Button>
              <Button
                onClick={() => navigate("/swap")}
                className={`px-8 py-4 text-lg font-semibold border-2 ${
                  theme === 'dark'
                    ? 'bg-transparent text-green-400 border-green-400 hover:bg-green-400 hover:text-black'
                    : 'bg-white text-amber-600 border-amber-600 hover:bg-amber-50'
                }`}
              >
                <span className="mr-2">🔄</span>
                Start Swapping
              </Button>
            </div>
          </motion.div>
        </div>
        
        {/* Floating elements */}
        <div className="absolute top-20 left-10 text-4xl opacity-20 animate-bounce">💰</div>
        <div className="absolute top-40 right-20 text-3xl opacity-20 animate-pulse">📈</div>
        <div className="absolute bottom-20 left-1/4 text-2xl opacity-20 animate-bounce delay-1000">🚀</div>
      </section>

      {/* Stats Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="text-center"
              >
                <div className={`text-3xl md:text-4xl font-bold mb-2 ${
                  theme === 'dark' ? 'text-green-400' : 'text-amber-600'
                }`}>
                  {stat.value}
                </div>
                <div className={`text-sm mb-1 ${
                  theme === 'dark' ? 'text-green-300' : 'text-gray-600'
                }`}>{stat.label}</div>
                <div className="text-xs text-green-600 font-medium">{stat.change}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className={`py-20 ${theme === 'dark' ? 'bg-gray-900/50' : 'bg-gray-50/50'}`}>
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className={`text-4xl md:text-5xl font-bold mb-6 ${
              theme === 'dark' ? 'text-green-400' : 'text-gray-900'
            }`}>
              Why Choose Alfa APY?
            </h2>
            <p className={`text-xl max-w-2xl mx-auto ${
              theme === 'dark' ? 'text-green-300' : 'text-gray-600'
            }`}>
              We combine cutting-edge DeFi strategies with the security of Internet Computer
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className={`p-6 text-center h-full transition-shadow ${
                  theme === 'dark' 
                    ? 'bg-gray-800/80 border-purple-600 hover:shadow-purple-500/20 hover:shadow-lg' 
                    : 'hover:shadow-lg'
                }`}>
                  <div className="text-4xl mb-4">{feature.icon}</div>
                  <h3 className={`text-xl font-semibold mb-3 ${
                    theme === 'dark' ? 'text-green-400' : 'text-gray-900'
                  }`}>
                    {feature.title}
                  </h3>
                  <p className={`leading-relaxed ${
                    theme === 'dark' ? 'text-green-300' : 'text-gray-600'
                  }`}>
                    {feature.description}
                  </p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className={`text-4xl md:text-5xl font-bold mb-6 ${
              theme === 'dark' ? 'text-green-400' : 'text-gray-900'
            }`}>
              How It Works
            </h2>
            <p className={`text-xl max-w-2xl mx-auto ${
              theme === 'dark' ? 'text-green-300' : 'text-gray-600'
            }`}>
              Get started in just 3 simple steps
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.map((step, index) => (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                className="text-center relative"
              >
                {index < steps.length - 1 && (
                  <div className={`hidden md:block absolute top-8 left-full w-full h-0.5 z-0 ${
                    theme === 'dark' ? 'bg-purple-600' : 'bg-amber-200'
                  }`}></div>
                )}
                <div className="relative z-10">
                  <div className={`w-16 h-16 text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-6 ${
                    theme === 'dark' ? 'bg-purple-600' : 'bg-amber-500'
                  }`}>
                    {step.number}
                  </div>
                  <h3 className={`text-xl font-semibold mb-3 ${
                    theme === 'dark' ? 'text-green-400' : 'text-gray-900'
                  }`}>
                    {step.title}
                  </h3>
                  <p className={`leading-relaxed ${
                    theme === 'dark' ? 'text-green-300' : 'text-gray-600'
                  }`}>
                    {step.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className={`py-20 ${
        theme === 'dark' 
          ? 'bg-gradient-to-r from-purple-900/80 to-green-900/80' 
          : 'bg-gradient-to-r from-amber-500 to-orange-500'
      }`}>
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">
              Ready to Start Earning?
            </h2>
            <p className={`text-xl mb-8 max-w-2xl mx-auto ${
              theme === 'dark' ? 'text-green-200' : 'text-amber-100'
            }`}>
              Join thousands of users already earning high yields on their crypto assets
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                onClick={() => navigate("/strategies")}
                className={`px-8 py-4 text-lg font-semibold ${
                  theme === 'dark'
                    ? 'bg-green-400 text-black hover:bg-green-300'
                    : 'bg-white text-amber-600 hover:bg-amber-50'
                }`}
              >
                View Strategies
              </Button>
              <Button
                onClick={() => navigate("/swap")}
                className="px-8 py-4 text-lg font-semibold bg-transparent text-white border-2 border-white hover:bg-white hover:text-black"
              >
                <span className="mr-2">🔄</span>
                Start Swapping
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Documentation Section */}
      <section className={`py-20 ${theme === 'dark' ? 'bg-gray-900/50' : 'bg-gray-50/50'}`}>
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className={`text-4xl md:text-5xl font-bold mb-6 ${
              theme === 'dark' ? 'text-green-400' : 'text-gray-900'
            }`}>
              Still have questions?
            </h2>
            <p className={`text-xl mb-8 max-w-2xl mx-auto ${
              theme === 'dark' ? 'text-green-300' : 'text-gray-600'
            }`}>
              Read our comprehensive documentation to learn more about our DeFi strategies and how to maximize your yields
            </p>
            <div className="flex justify-center">
              <Button
                onClick={() => window.open("https://alfa-codes.github.io/alfa-apy-icp-canisters/", "_blank")}
                className={`px-8 py-4 text-lg font-semibold ${
                  theme === 'dark'
                    ? 'bg-purple-600 text-white hover:bg-purple-700'
                    : 'bg-amber-600 text-white hover:bg-amber-700'
                }`}
              >
                <span className="mr-2">📚</span>
                Read Documentation
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
} 