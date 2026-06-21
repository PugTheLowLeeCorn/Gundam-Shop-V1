export const GRADES = [
  { id: "HG", label: "High Grade", scale: "1/144", description: "Perfect for beginners" },
  { id: "RG", label: "Real Grade", scale: "1/144", description: "Detailed inner frame" },
  { id: "MG", label: "Master Grade", scale: "1/100", description: "Premium engineering" },
  { id: "PG", label: "Perfect Grade", scale: "1/60", description: "Ultimate build experience" },
  { id: "SD", label: "Super Deformed", scale: "SD", description: "Cute chibi style" },
];

export const GRADE_COLORS = {
  HG: { bg: "bg-blue-500/20", text: "text-blue-400", border: "border-blue-500/40" },
  RG: { bg: "bg-red-500/20", text: "text-red-400", border: "border-red-500/40" },
  MG: { bg: "bg-amber-500/20", text: "text-amber-400", border: "border-amber-500/40" },
  PG: { bg: "bg-purple-500/20", text: "text-purple-400", border: "border-purple-500/40" },
  SD: { bg: "bg-green-500/20", text: "text-green-400", border: "border-green-500/40" },
};

export function getGradeColor(grade) {
  return GRADE_COLORS[grade] || {
    bg: "bg-gray-500/20",
    text: "text-gray-400",
    border: "border-gray-500/40",
  };
}
