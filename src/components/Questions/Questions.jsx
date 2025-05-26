import { useState, useEffect } from "react";
import he from "he";
import Option from "../Option/Option";
import katex from 'katex';
import 'katex/dist/katex.min.css'
import { InlineMath } from "react-katex";

function Question({ id, handleClick, singleQuestion , readOnly}) {
  const [userAnswer, setUserAnswer] = useState(singleQuestion.data.student_answer);

  const answers = singleQuestion.data.answers;
  const question = singleQuestion.data.question;

  const InlineMath_1= ({ math }) => {
    const mathRef = useRef(null);
  
    useEffect(() => {
      if (mathRef.current) {
        try {
          katex.render(math, mathRef.current, {
            throwOnError: false, // Do not throw errors on invalid LaTeX
          });
        } catch (error) {
          console.error('KaTeX Error:', error);
        }
      }
    }, [math]); // Re-run whenever `math` changes
  
    return <span ref={mathRef} />;
  };


  useEffect(() => {
    setUserAnswer(singleQuestion.data.student_answer);
  }, [singleQuestion]);

  const handleOptionClick = async (selectedOption) => {
    setUserAnswer(selectedOption);
    handleClick({ questionId: id, answer: selectedOption });
  };

  const handleClearClick = async () => {
    setUserAnswer(null);
    await handleClick({ questionId: id, answer: null });
  };
  return (
    <section>
      <div className="flex items-start space-x-3 text-xl mb-10">
        <h3 className="text-gray-800 font-semibold text-center">{id}.</h3>
        <h3 className="text-gray-800 font-semibold">{he.decode(question)}</h3>
        {/* <h3 className="text-gray-800 font-semibold">
          <InlineMath math={`${question}`}/>
        </h3> */}

      </div>

      {answers.map((opt, i) => (
        <Option
          key={i}
          value={opt.options}            
          idx={i}                        
          answerNumber={opt.answer_number} 
          handleClick={handleOptionClick}  
          studentAnswer={userAnswer}      
          isSelected={userAnswer === opt.answer_number} 
          readOnly ={readOnly}
        />
      ))}

      {/* Render Clear Answer button only if userAnswer is NOT null */}
      {userAnswer !== null && (
        <button
          onClick={handleClearClick}
          className="mt-4 p-2 bg-red-500 text-white rounded-full"
        >
          Clear Answer
        </button>
      )}
    </section>
  );
}

export default Question;
