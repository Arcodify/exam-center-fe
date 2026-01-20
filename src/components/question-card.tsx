import Latex from "react-latex-next";
import "katex/dist/katex.min.css";
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

const QuestionCard = ({ questionIndex, questionData, onSelectAnswer }: Props) => {
  return (
    <div className="bg-white/80 ">
      <h2 className="text-lg font-semibold">
        {questionIndex + 1}. <Latex>{questionData.question}</Latex>
      </h2>

      <div className="space-y-2 overflow-y-auto max-h-[300px] py-4">
        {questionData.answers.map((ans) => (
          <button
            key={ans.answer_number}
            onClick={() => onSelectAnswer(questionData.id, ans.answer_number)}
            className={`w-full text-left px-4 py-2 rounded-xl border transition-colors duration-200 ${questionData.student_answer === ans.answer_number
              ? "bg-blue-100 border-blue-500 text-blue-900"
              : "hover:bg-gray-100 border-gray-300"
              }`}
          >
            <span className="font-bold uppercase mr-2">
              {ans.answer_number}.
            </span>
            <Latex>{ans.options}</Latex>
          </button>
        ))}
      </div>
    </div>
  );
};

export default QuestionCard;
