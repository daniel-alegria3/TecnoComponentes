import { STEP_CONFIG } from "../../constants/buildSteps";

export default function StepHeader({ step, subStep }) {
  const stepConfig = STEP_CONFIG[step];
  const subStepConfig = stepConfig?.subSteps[subStep];

  if (!stepConfig || !subStepConfig) {
    return null;
  }

  return (
    <div className="flex items-center space-x-3 mb-6">
      <div className={`flex items-center justify-center w-12 h-12 bg-gradient-to-br ${subStepConfig.gradient} rounded-xl text-white text-2xl`}>
        {subStepConfig.icon}
      </div>
      <div>
        <h2 className="text-3xl font-bold text-gray-800">
          {subStepConfig.title}
        </h2>
        <p className="text-gray-600 mt-1">
          {subStepConfig.description}
        </p>
      </div>
    </div>
  );
}
