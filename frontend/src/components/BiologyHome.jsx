import { EXPERIMENT_CATALOG } from "../data/experiments";
import SubjectDashboard from "./SubjectDashboard";

const BiologyHome = () => {
  const biologyExperiments = EXPERIMENT_CATALOG.filter(
    (experiment) => experiment.subject === "biology"
  );

  return (
    <SubjectDashboard 
      subject="biology"
      title="Biology Virtual Lab"
      description="Explore the anatomy of living organisms, cells, and organs in stunning 3D. Discover the building blocks of life through interactive exploration."
      experiments={biologyExperiments}
      colorTheme={{
        bg: "bg-rose-500",
        text: "text-rose-500",
        border: "border-rose-500/20",
        hoverBorder: "hover:border-rose-500/50",
        gradientLight: "from-rose-50 to-pink-50",
        gradientDark: "from-rose-950/40 to-pink-950/40"
      }}
    />
  );
};

export default BiologyHome;
