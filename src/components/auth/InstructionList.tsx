import React from 'react';

interface Instruction {
  text: string;
  imageUrl?: string;
  imageAlt?: string;
}

const instructions: Instruction[] = [
  {
    text: 'Please Check and Enter Your Credentials Correctly',
    imageUrl: '/images/credentials.png',
    imageAlt: 'Credentials input example',
  },
  {
    text: 'Please Select the Answer Correctly and Click on the Next Button',
    imageUrl: '/images/answer.png',
    imageAlt: 'Answer selection example',
  },
  {
    text: 'Your answers are automatically saved as you progress through them.',
    imageUrl: '/images/auto-save.png',
    imageAlt: 'Auto-save indicator',
  },
  {
    text: 'You may flag questions to return to them later.',
    imageUrl: '/images/flag-question.png',
    imageAlt: 'Question flagging example',
  },
  {
    text: 'The exam is timed — keep an eye on the on-screen timer.',
    imageUrl: '/images/timer.png',
    imageAlt: 'Timer display',
  },
  {
    text: 'In case of technical issues, contact support immediately.',
    imageUrl: '/images/support.png',
    imageAlt: 'Support contact information',
  },
];

const Instructions: React.FC = () => (
  <div className="bg-blue-50 rounded-lg shadow-md p-6 w-full max-w-2xl h-[79vh] flex flex-col">
    <h3 className="text-center font-bold text-lg mb-6 text-red-500">
      INSTRUCTION TO TAKE THE EXAM
    </h3>
    <div className="flex-1 overflow-y-auto pr-4 custom-scrollbar">
      <ol className="list-decimal list-inside pl-5 space-y-4 h-full">
        {instructions.map((instruction, index) => (
          <li key={index} className="text-sm font-bold">
            <div className="flex flex-col gap-2">
              <span>{instruction.text}</span>
              {instruction.imageUrl && (
                <img
                  src={instruction.imageUrl}
                  alt={instruction.imageAlt || 'Instruction illustration'}
                  className="w-full max-w-md rounded-lg shadow-sm mt-2"
                />
              )}
            </div>
          </li>
        ))}
      </ol>
    </div>
  </div>
);

export default Instructions;
