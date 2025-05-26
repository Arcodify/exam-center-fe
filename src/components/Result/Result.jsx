import React from 'react';

const ReportCard = () => {
  const student = {
    name: 'John Doe',
    grade: 'A',
    subjects: [
      { name: 'Mathematics', score: 92 },
      { name: 'Science', score: 88 },
      { name: 'English', score: 85 },
      { name: 'History', score: 90 },
      { name: 'Geography', score: 87 }
    ],
    remarks: 'Excellent performance, keep it up!'
  };

  return (
    <div className="p-8 max-w-4xl mx-auto bg-white rounded-lg shadow-lg">
      <div className="text-center mb-6">
        <h1 className="text-3xl font-bold">Report Card</h1>
        <h2 className="text-xl text-gray-600">{student.name}</h2>
        <p className="text-lg text-gray-500">Grade: {student.grade}</p>
      </div>

      <table className="min-w-full table-auto text-left mb-6">
        <thead>
          <tr>
            <th className="px-4 py-2 text-gray-600">Subject</th>
            <th className="px-4 py-2 text-gray-600">Score</th>
          </tr>
        </thead>
        <tbody>
          {student.subjects.map((subject, index) => (
            <tr key={index} className="border-b">
              <td className="px-4 py-2">{subject.name}</td>
              <td className="px-4 py-2">{subject.score}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="mt-6 text-center">
        <p className="text-lg font-semibold">Remarks:</p>
        <p className="text-gray-700">{student.remarks}</p>
      </div>
    </div>
  );
};

export default ReportCard;
