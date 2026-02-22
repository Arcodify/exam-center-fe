import Latex from "react-latex-next";
import "katex/dist/katex.min.css";
import "katex/dist/contrib/mhchem.js";

const LATEX_DELIMITERS = [
  { left: "$$", right: "$$", display: true },
  { left: "$", right: "$", display: false },
  { left: "\\(", right: "\\)", display: false },
  { left: "\\[", right: "\\]", display: true },
];

const toRenderableLatex = (input: string) => {
  const text = input ?? "";
  const trimmed = text.trim();
  if (!trimmed) return text;

  // react-latex-next only renders content between delimiters.
  // If API sends bare LaTeX like "\ce{...}" or "\sin x", wrap it once.
  const alreadyDelimited =
    trimmed.includes("$") || trimmed.includes("\\(") || trimmed.includes("\\[");
  if (alreadyDelimited) return text;

  if (!trimmed.includes("\\")) return text;
  return `\\(${trimmed}\\)`;
};

interface Answer {
  options: string;
  answer_number: string;
}

interface Question {
  id: number;
  question: string;
  answers: Answer[];
  student_answer: string | null;
  is_answered: boolean;
}

interface Props {
  questionIndex: number;
  questionData: Question;
  onSelectAnswer: (id: number, answer: string) => void;
}

const QuestionCard = ({
  questionIndex,
  questionData,
  onSelectAnswer,
}: Props) => {
  return (
    <div className="bg-white/80 ">
      <h2 className="text-lg font-semibold">
        {questionIndex + 1}.{" "}
        <Latex delimiters={LATEX_DELIMITERS}>
          {toRenderableLatex(questionData.question)}
        </Latex>
      </h2>

      <div className="space-y-2 overflow-y-auto max-h-[300px] py-4">
        {questionData.answers.map((ans) => (
          <button
            key={ans.answer_number}
            onClick={() => onSelectAnswer(questionData.id, ans.answer_number)}
            className={`w-full text-left px-4 py-2 rounded-xl border transition-colors duration-200 ${
              questionData.student_answer === ans.answer_number
                ? "bg-blue-100 border-blue-500 text-blue-900"
                : "hover:bg-gray-100 border-gray-300"
            }`}
          >
            <span className="font-bold uppercase mr-2">
              {ans.answer_number}.
            </span>
            <Latex delimiters={LATEX_DELIMITERS}>
              {toRenderableLatex(ans.options)}
            </Latex>
          </button>
        ))}
      </div>
    </div>
  );
};

export default QuestionCard;
