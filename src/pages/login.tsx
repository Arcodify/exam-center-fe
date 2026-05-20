import LoginForm from "@/components/auth/login-form";
import {
  DEFAULT_ENGLISH_INSTRUCTIONS,
  DEFAULT_NEPALI_INSTRUCTIONS,
  toNepaliNumber,
} from "@/data/default-instructions";
import { useState } from "react";

const Login = () => {
  const [englishInstructions, setEnglishInstructions] = useState<string[]>([]);
  const [nepaliInstructions, setNepaliInstructions] = useState<string[]>([]);

  const english =
    englishInstructions.length > 0
      ? englishInstructions
      : DEFAULT_ENGLISH_INSTRUCTIONS;

  const nepali =
    nepaliInstructions.length > 0
      ? nepaliInstructions
      : DEFAULT_NEPALI_INSTRUCTIONS;

  return (
    <div className="bg-white min-h-screen lg:h-screen w-full flex flex-col-reverse lg:flex-row lg:overflow-hidden">
      {/* LEFT: INSTRUCTIONS */}
      <section className="w-full lg:w-7/12 flex flex-col bg-white p-6 lg:p-10 h-auto lg:h-full">
        <div className="mb-4">
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-800 flex items-center gap-2">
            <span>आचारसंहिता</span>
          </h1>
          <div className="h-px bg-gray-200 w-full mt-4" />
        </div>

        <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar border border-gray-200 rounded-xl p-6 bg-gray-50/30">
          <div className="space-y-8">
            {/* NEPALI */}
            <div className="text-sm leading-relaxed">
              <h3 className="text-lg font-bold mb-4 text-gray-800 border-b border-gray-200 pb-2 inline-block">
                Nepali
              </h3>

              <div className="space-y-3 pl-2">
                {nepali.map((item, i) => (
                  <p key={i} className="flex items-start">
                    <span className="font-semibold text-gray-700 mr-3 min-w-[24px]">
                      {toNepaliNumber(i + 1)}.
                    </span>
                    <span className="text-gray-600">{item}</span>
                  </p>
                ))}
              </div>
            </div>

            {/* ENGLISH */}
            <div className="text-sm leading-relaxed">
              <h3 className="text-lg font-bold mb-4 text-gray-800 border-b border-gray-200 pb-2 inline-block">
                English
              </h3>

              <div className="space-y-3 pl-2">
                {english.map((item, i) => (
                  <p key={i} className="flex items-start">
                    <span className="font-semibold text-gray-700 mr-3 min-w-[20px]">
                      {i + 1}.
                    </span>
                    <span className="text-gray-600">{item}</span>
                  </p>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="w-full lg:w-5/12 bg-gradient-to-br from-purple-50 to-blue-50 p-8 lg:p-12 flex flex-col justify-center border-l border-gray-100">
        <LoginForm
          onEnglishInstructions={setEnglishInstructions}
          onNepaliInstructions={setNepaliInstructions}
        />
      </section>
    </div>
  );
};

export default Login;
