import { getGradeColor } from "../utils/grades";

function GradeBadge({ grade, size = "sm" }) {
  const colors = getGradeColor(grade);
  const sizeClass = size === "lg" ? "px-4 py-1.5 text-sm" : "px-3 py-1 text-xs";

  return (
    <span
      className={`inline-block rounded-full font-semibold border ${colors.bg} ${colors.text} ${colors.border} ${sizeClass}`}
    >
      {grade}
    </span>
  );
}

export default GradeBadge;
