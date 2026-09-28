/**
 * Subject → Topic catalogue for the study tutor. Lessons, practice and
 * quizzes for each topic are generated on demand for the learner's level,
 * so the catalogue only needs to carry structure, not content.
 */
export interface Subject {
  slug: string;
  name: string;
  blurb: string;
  groups: { name: string; topics: string[] }[];
}

export const subjects: Subject[] = [
  {
    slug: "mathematics",
    name: "Mathematics",
    blurb: "From arithmetic to calculus — built step by step.",
    groups: [
      { name: "Foundations", topics: ["Fractions & decimals", "Ratios & percentages", "Integers", "Exponents & roots"] },
      { name: "Algebra", topics: ["Linear equations", "Quadratic equations", "Polynomials", "Inequalities", "Functions & graphs"] },
      { name: "Geometry & trigonometry", topics: ["Triangles & congruence", "Circles", "Coordinate geometry", "Trigonometric ratios", "Trigonometric identities"] },
      { name: "Calculus", topics: ["Limits", "Derivatives", "Applications of derivatives", "Integrals", "Differential equations"] },
      { name: "Statistics & probability", topics: ["Mean, median, mode", "Probability basics", "Permutations & combinations", "Distributions"] },
    ],
  },
  {
    slug: "physics",
    name: "Physics",
    blurb: "Understand how the universe moves, glows and holds together.",
    groups: [
      { name: "Mechanics", topics: ["Motion in a straight line", "Newton's laws", "Work, energy & power", "Rotational motion", "Gravitation"] },
      { name: "Waves & thermodynamics", topics: ["Oscillations", "Waves & sound", "Heat & temperature", "Laws of thermodynamics"] },
      { name: "Electricity & magnetism", topics: ["Electric charges & fields", "Current electricity", "Magnetism", "Electromagnetic induction", "Alternating current"] },
      { name: "Optics & modern physics", topics: ["Ray optics", "Wave optics", "Photoelectric effect", "Atoms & nuclei", "Semiconductors"] },
    ],
  },
  {
    slug: "chemistry",
    name: "Chemistry",
    blurb: "Atoms, bonds and reactions — explained with everyday examples.",
    groups: [
      { name: "Physical chemistry", topics: ["Mole concept", "Atomic structure", "Chemical bonding", "Thermodynamics", "Equilibrium", "Electrochemistry", "Chemical kinetics"] },
      { name: "Inorganic chemistry", topics: ["Periodic table trends", "s-block & p-block", "d-block & f-block", "Coordination compounds"] },
      { name: "Organic chemistry", topics: ["Nomenclature", "Hydrocarbons", "Reaction mechanisms", "Alcohols, phenols & ethers", "Aldehydes & ketones", "Biomolecules"] },
    ],
  },
  {
    slug: "biology",
    name: "Biology",
    blurb: "Life from cells to ecosystems.",
    groups: [
      { name: "Cell biology", topics: ["Cell structure", "Cell division", "Biomolecules", "Enzymes"] },
      { name: "Human physiology", topics: ["Digestion", "Respiration", "Circulation", "Nervous system", "Hormones"] },
      { name: "Genetics & evolution", topics: ["Mendelian inheritance", "Molecular basis of inheritance", "Evolution"] },
      { name: "Plants & ecology", topics: ["Photosynthesis", "Plant physiology", "Ecosystems", "Biodiversity"] },
    ],
  },
  {
    slug: "computer-science",
    name: "Computer Science",
    blurb: "Programming, algorithms and how computers really work.",
    groups: [
      { name: "Programming", topics: ["Variables & types", "Control flow", "Functions", "Object-oriented programming", "Recursion"] },
      { name: "Data structures & algorithms", topics: ["Arrays & strings", "Linked lists", "Stacks & queues", "Trees", "Graphs", "Sorting & searching", "Big-O notation"] },
      { name: "Systems", topics: ["How the internet works", "Databases & SQL", "Operating systems basics", "Computer networks"] },
    ],
  },
  {
    slug: "history",
    name: "History",
    blurb: "Understand the past to make sense of the present.",
    groups: [
      { name: "Ancient & medieval", topics: ["Early civilisations", "Classical empires", "Medieval societies", "Trade routes"] },
      { name: "Modern world", topics: ["Industrial Revolution", "Colonialism & independence movements", "World War I", "World War II", "The Cold War"] },
    ],
  },
  {
    slug: "geography",
    name: "Geography",
    blurb: "Landforms, climate, resources and people.",
    groups: [
      { name: "Physical geography", topics: ["Earth's structure", "Landforms", "Climate & weather", "Oceans"] },
      { name: "Human geography", topics: ["Population", "Urbanisation", "Resources & energy", "Agriculture"] },
    ],
  },
  {
    slug: "economics",
    name: "Economics",
    blurb: "How people, businesses and governments make choices.",
    groups: [
      { name: "Microeconomics", topics: ["Supply & demand", "Elasticity", "Market structures", "Consumer behaviour"] },
      { name: "Macroeconomics", topics: ["GDP & growth", "Inflation", "Money & banking", "Fiscal & monetary policy", "International trade"] },
    ],
  },
  {
    slug: "english",
    name: "English",
    blurb: "Read, write and speak with clarity and confidence.",
    groups: [
      { name: "Language", topics: ["Grammar essentials", "Vocabulary building", "Sentence structure", "Punctuation"] },
      { name: "Communication", topics: ["Essay writing", "Reading comprehension", "Formal emails", "Public speaking"] },
    ],
  },
];

export function getSubject(slug: string) {
  return subjects.find((s) => s.slug === slug);
}

export function topicExists(subject: Subject, topic: string) {
  return subject.groups.some((g) => g.topics.includes(topic));
}
