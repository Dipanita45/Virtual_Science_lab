import { EXPERIMENT_CATALOG } from "../data/experiments";
import SubjectDashboard from "./SubjectDashboard";

const PhysicsHome = () => {
  const physicsExperiments = EXPERIMENT_CATALOG.filter(
    (experiment) => experiment.subject === "physics"
  );

  return (
    <SubjectDashboard 
      subject="physics"
      title="Physics Virtual Lab"
      description="Dive into interactive 3D simulations of motion, forces, and electromagnetism. Master the fundamental laws of the universe through hands-on experiments."
      experiments={physicsExperiments}
      colorTheme={{
        bg: "bg-blue-500",
        text: "text-blue-500",
        border: "border-blue-500/20",
        hoverBorder: "hover:border-blue-500/50",
        gradientLight: "from-blue-50 to-indigo-50",
        gradientDark: "from-blue-950/40 to-indigo-950/40"
      }}
    />
  );
};

export default PhysicsHome;
