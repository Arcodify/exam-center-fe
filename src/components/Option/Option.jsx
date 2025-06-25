import { Idx } from "../../constant";
import { renderMathText, hasMathExpressions } from "../../utils/mathUtils";

function Option({
  value,
  idx,
  answerNumber,
  handleClick,
  studentAnswer,
  readOnly,
}) {
  const isSelected = studentAnswer === answerNumber;
  const containsMath = hasMathExpressions(value);

  if (readOnly == true) {
    return (
      <div
        style={
          isSelected
            ? {
                background: "rgb(0 200 0 / 0.35)",
                color: "rgb(127 29 29 / 1)",
              }
            : {}
        }
        className="flex items-center space-x-3 mb-5 text-neutral-600 bg-neutral-200/50 rounded-full py-3 px-3 text-lg md:text-lg"
      >
        <input
          type="radio"
          name={`question-${answerNumber}`}
          checked={isSelected}
          readOnly
          disabled
          className="cursor-default"
        />
        <p>{Idx[idx]}.</p>
        <p>
          {containsMath ? (
            <>{renderMathText(value)}</>
          ) : (
            value
          )}
        </p>
      </div>
    );
  } else {
    return (
      <div
        style={
          isSelected
            ? {
                background: "rgb(0 200 0 / 0.35)",
                color: "rgb(127 29 29 / 1)",
              }
            : {}
        }
        className={`flex items-center space-x-3 mb-5 text-neutral-600 bg-neutral-200/50 rounded-full py-3 px-3 text-lg md:text-lg active:text-neutral-50 active:bg-orange-500/90 
      md:hover:bg-red-50 md:hover:text-black-400 cursor-pointer hover:mt-3`}
        onClick={() => !isSelected && handleClick(answerNumber)}
      >
        <input
          type="radio"
          name={`question-${answerNumber}`}
          checked={isSelected}
          onChange={() => !isSelected && handleClick(answerNumber)}
          className="cursor-pointer"
          disabled={isSelected}
          readOnly={readOnly}
        />
        <p>{Idx[idx]}.</p>
        <p>
          {containsMath ? (
            <>{renderMathText(value)}</>
          ) : (
            value
          )}
        </p>
      </div>
    );
  }
}

export default Option;
