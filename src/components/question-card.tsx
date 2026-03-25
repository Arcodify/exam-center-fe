import Latex from "react-latex-next";
import "katex/dist/katex.min.css";
import "katex/dist/contrib/mhchem.js";
import type { ExamQuestion } from "@/utils/examQuestions";

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

interface Props {
  questionIndex: number;
  questionData: ExamQuestion;
  onSelectAnswer: (id: number, answer: string) => void;
  onClearAnswer: (id: number) => void;
}

const QuestionCard = ({
  questionIndex,
  questionData,
  onSelectAnswer,
  onClearAnswer,
}: Props) => {
  void onClearAnswer;

  return (
    <div className="bg-white/80">
      <h2 className="text-lg font-semibold">
        {questionIndex + 1}.{" "}
        <Latex delimiters={LATEX_DELIMITERS}>
          {toRenderableLatex(questionData.question)}
        </Latex>
      </h2>

      <div className="max-h-[300px] space-y-2 overflow-y-auto py-4">
        {questionData.answers.map((ans) => {
          const isSelected = questionData.student_answers.includes(
            ans.answer_number,
          );

          return (
            <label
              key={ans.answer_number}
              className={`flex w-full cursor-pointer items-start gap-3 rounded-xl border px-4 py-3 text-left transition-colors duration-200 ${
                isSelected
                  ? "border-blue-500 bg-blue-100 text-blue-900"
                  : "border-gray-300 hover:bg-gray-100"
              }`}
            >
              <input
                type={questionData.allows_multiple_answers ? "checkbox" : "radio"}
                name={`question-${questionData.id}`}
                value={ans.answer_number}
                checked={isSelected}
                onChange={() => onSelectAnswer(questionData.id, ans.answer_number)}
                className="mt-1 h-4 w-4 accent-blue-600"
              />
              <span className="mr-2 font-bold uppercase">{ans.answer_number}.</span>
              <span className="flex-1">
                <Latex delimiters={LATEX_DELIMITERS}>
                  {toRenderableLatex(ans.options)}
                </Latex>
              </span>
            </label>
          );
        })}
      </div>

      <div className="flex items-center justify-between gap-3 border-t border-slate-200 pt-4">
        <p className="text-sm text-slate-500">
          {questionData.allows_multiple_answers
            ? "Multiple answers allowed"
            : "Select one answer"}
        </p>
        {/* <button
          type="button"
          onClick={() => onClearAnswer(questionData.id)}
          disabled={questionData.student_answers.length === 0}
          className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Clear answer
        </button> */}
      </div>
    </div>
  );
};

export default QuestionCard;
