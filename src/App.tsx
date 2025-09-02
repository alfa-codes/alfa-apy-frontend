import { Lending, Layout, Swap, Profile, Landing } from "./components";
import { Strategies, StrategyDetail } from "./components/strategies";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ThemeProvider } from "./contexts/ThemeContext";

function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <AnimatePresence mode="wait">
          <Layout>
            <Routes>
              <Route
                path="/"
                element={
                  <motion.div
                    key="landing"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5 }}
                  >
                    <Landing />
                  </motion.div>
                }
              />
              <Route
                path="/strategies"
                element={
                  <motion.div
                    key="strategies"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5 }}
                  >
                    <Strategies />
                  </motion.div>
                }
              />
              <Route
                path="/strategies/:id"
                element={
                  <motion.div
                    key="strategy-detail"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5 }}
                  >
                    <StrategyDetail />
                  </motion.div>
                }
              />
              <Route
                path="/swap"
                element={
                  <motion.div
                    key="swap"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5 }}
                  >
                    <Swap />
                  </motion.div>
                }
              />
              <Route
                path="/profile"
                element={
                  <motion.div
                    key="profile"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5 }}
                  >
                    <Profile />
                  </motion.div>
                }
              />
              <Route
                path="/lending"
                element={
                  <motion.div
                    key="lending"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5 }}
                  >
                    <Lending />
                  </motion.div>
                }
              />
            </Routes>
          </Layout>
        </AnimatePresence>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
