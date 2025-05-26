import React, { useEffect, useRef } from "react";
import katex from "katex";
import "katex/dist/katex.min.css"; // Import KaTeX CSS

const InlineMath = ({ math }) => {
  const mathRef = useRef(null);

  useEffect(() => {
    if (mathRef.current) {
      try {
        katex.render(math, mathRef.current, {
          throwOnError: false,
        });
      } catch (error) {
        console.error("KaTeX Error:", error);
      }
    }
  }, [math]);

  return <span ref={mathRef} />;
};

export default InlineMath;
