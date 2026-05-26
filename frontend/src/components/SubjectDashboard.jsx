import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import { useProgress } from "../context/ProgressContext";
import { useGamification } from "../context/GamificationContext";
import SubjectBackground from "./SubjectBackground";
import ExperimentCard from "./ExperimentCard";

const SubjectDashboard = ({ subject, title, description, experiments, colorTheme }) => {
  const { completedIds, recommendations } = useProgress();
  const { xp } = useGamification();
  const [filterDifficulty, setFilterDifficulty] = useState("All");
  const [filterStatus, setFilterStatus] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const subjectCompletedCount = experiments.filter(e => completedIds.has(e.id)).length;
  const masteryPercentage = experiments.length ? Math.round((subjectCompletedCount / experiments.length) * 100) : 0;

  // Filtered logic
  const filteredExperiments = useMemo(() => {
    return experiments.filter(exp => {
      const matchSearch = exp.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          exp.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchDifficulty = filterDifficulty === "All" || exp.difficulty === filterDifficulty;
      
      let matchStatus = true;
      if (filterStatus === "Completed") matchStatus = completedIds.has(exp.id);
      if (filterStatus === "Pending") matchStatus = !completedIds.has(exp.id);
      
      return matchSearch && matchDifficulty && matchStatus;
    });
  }, [experiments, searchQuery, filterDifficulty, filterStatus, completedIds]);

  const subjectRecs = recommendations?.filter(r => 
    experiments.some(e => e.id === r.experiment_id)
  ) || [];

  return (
    <div className="relative min-h-screen bg-slate-50 dark:bg-slate-950 overflow-hidden pb-20">
      <SubjectBackground subject={subject} />

      <div className="relative z-10 max-w-7xl mx-auto px-6 pt-12">
        {/* HERO SECTION */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`rounded-3xl border border-slate-200 dark:border-slate-800 p-8 shadow-xl mb-12 bg-gradient-to-br ${colorTheme.gradientLight} dark:${colorTheme.gradientDark} backdrop-blur-md`}
        >
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
            <div className="max-w-2xl">
              <h1 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white mb-4">
                {title}
              </h1>
              <p className="text-slate-700 dark:text-slate-300 text-lg font-medium leading-relaxed">
                {description}
              </p>
            </div>
            
            <div className="flex flex-col gap-4 min-w-[200px] bg-white/60 dark:bg-slate-900/60 p-6 rounded-2xl backdrop-blur-md border border-white/20 dark:border-slate-700/50 shadow-inner">
              <div className="flex justify-between items-center border-b border-slate-200/50 dark:border-slate-700/50 pb-3">
                <span className="text-sm font-bold text-slate-500 dark:text-slate-400">Mastery</span>
                <span className="text-xl font-black text-slate-800 dark:text-white">{masteryPercentage}%</span>
              </div>
              <div className="flex justify-between items-center border-b border-slate-200/50 dark:border-slate-700/50 pb-3">
                <span className="text-sm font-bold text-slate-500 dark:text-slate-400">Completed</span>
                <span className="text-xl font-black text-slate-800 dark:text-white">{subjectCompletedCount} / {experiments.length}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-bold text-slate-500 dark:text-slate-400">Total XP</span>
                <span className={`text-xl font-black ${colorTheme.text}`}>{xp}</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* SMART INSIGHTS / RECOMMENDATIONS */}
        {subjectRecs.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-black text-slate-800 dark:text-white mb-6 flex items-center gap-2">
              <span className={`w-2 h-8 rounded-full ${colorTheme.bg}`}></span>
              Recommended Next
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {subjectRecs.map((rec) => {
                const expData = experiments.find(e => e.id === rec.experiment_id);
                if (!expData) return null;
                return (
                  <ExperimentCard 
                    key={`rec-${expData.id}`} 
                    {...expData} 
                    isRecommendation={true}
                    recommendationReason={rec.reason}
                    colorTheme={colorTheme}
                  />
                );
              })}
            </div>
          </div>
        )}

        {/* FILTER TOOLBAR */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8 bg-white dark:bg-slate-900 p-4 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 relative z-20">
          <div className="w-full md:w-1/3">
            <input 
              type="text" 
              placeholder="Search experiments..." 
              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-sm font-medium text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-3 w-full md:w-auto">
            <select 
              className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-sm font-bold text-slate-700 dark:text-slate-300 cursor-pointer outline-none"
              value={filterDifficulty}
              onChange={(e) => setFilterDifficulty(e.target.value)}
            >
              <option value="All">All Difficulties</option>
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
            </select>
            <select 
              className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-sm font-bold text-slate-700 dark:text-slate-300 cursor-pointer outline-none"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="All">All Status</option>
              <option value="Pending">Pending</option>
              <option value="Completed">Completed</option>
            </select>
          </div>
        </div>

        {/* EXPERIMENTS GRID */}
        {filteredExperiments.length === 0 ? (
          <div className="text-center py-20 bg-white/50 dark:bg-slate-900/50 rounded-3xl border border-dashed border-slate-300 dark:border-slate-700">
            <h3 className="text-xl font-bold text-slate-600 dark:text-slate-400">No experiments found matching your filters.</h3>
          </div>
        ) : (
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            initial="hidden"
            animate="visible"
            variants={{
              hidden: { opacity: 0 },
              visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
            }}
          >
            {filteredExperiments.map((exp) => (
              <motion.div key={exp.id} variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 }}}>
                <ExperimentCard {...exp} colorTheme={colorTheme} />
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default SubjectDashboard;
