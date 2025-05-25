import React from 'react';
import logo from '/logo/ExamOrgLogo.png';
import { HeaderProps } from './headerProps.types';

const Header: React.FC<HeaderProps> = ({
  date = '2025/05/20 Tuesday',
  examTime = '7:30am to 8:30 am',
  location = 'Babarmahal, Kathmandu',
  organizer = 'NEPAL HEALTH PROFESSIONAL COUNCIL',
}) => {
  return (
    <header className="bg-blue-900 text-white py-3 px-6 flex justify-between items-center">
      <div className="flex items-center">
        <div className="w-16 h-16 mr-4 rounded-full flex items-center justify-center overflow-hidden">
          <img src={logo} alt="Logo" className="w-full h-full object-cover" />
        </div>
        <div>
          <h1 className="text-xl font-bold m-0">{organizer}</h1>
          <h2 className="text-lg font-normal mt-1 mb-0">
            COMPUTER BASED TEST PLATFORM
          </h2>
        </div>
      </div>
      <div className="text-right">
        <p className="text-sm m-1">
          <strong>Date:</strong> {date}
        </p>
        <p className="text-sm m-1">
          <strong>Exam Time:</strong> {examTime}
        </p>
        <p className="text-sm m-1">
          <strong>Location:</strong> {location}
        </p>
      </div>
    </header>
  );
};

export default Header;
