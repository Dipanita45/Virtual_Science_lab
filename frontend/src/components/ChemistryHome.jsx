import { EXPERIMENT_CATALOG } from "../data/experiments";
import SubjectDashboard from "./SubjectDashboard";

const ChemistryHome = () => {
  const chemistryExperiments = EXPERIMENT_CATALOG.filter(
    (experiment) => experiment.subject === "chemistry"
  );

  return (
    <SubjectDashboard 
      subject="chemistry"
      title="Chemistry Virtual Lab"
      description="Mix chemicals, observe reactions, and learn about molecular structures in a completely safe, state-of-the-art virtual environment."
      experiments={chemistryExperiments}
      colorTheme={{
        bg: "bg-emerald-500",
        text: "text-emerald-500",
        border: "border-emerald-500/20",
        hoverBorder: "hover:border-emerald-500/50",
        gradientLight: "from-emerald-50 to-teal-50",
        gradientDark: "from-emerald-950/40 to-teal-950/40"
      }}
    />
  );
};

export default ChemistryHome;
