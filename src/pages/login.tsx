import LoginForm from "@/components/auth/login-form";

const Login = () => {
  return (


    <div className="bg-white min-h-screen lg:h-screen w-full flex flex-col-reverse lg:flex-row lg:overflow-hidden">

      {/* Left Section - Instructions */}
      <section className="w-full lg:w-7/12 flex flex-col bg-white p-6 lg:p-10 h-auto lg:h-full">
        <div className="mb-4">
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-800 flex items-center gap-2">
            Instructions <span className="text-gray-400 font-normal">/</span> <span className="text-gray-800">निर्देशन</span>
          </h1>
          <div className="h-px bg-gray-200 w-full mt-4"></div>
        </div>

        <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar border border-gray-200 rounded-xl p-6 bg-gray-50/30">
          <div className="space-y-8">
            {/* English Instructions */}
            <div className="text-sm leading-relaxed">
              <h3 className="text-lg font-bold mb-4 text-gray-800 border-b border-gray-200 pb-2 inline-block">
                English
              </h3>
              <div className="space-y-3 pl-2">
                <p className="flex items-start">
                  <span className="font-semibold text-gray-700 mr-3 min-w-[20px]">
                    1.
                  </span>
                  <span className="text-gray-600">
                    Please log in to your assigned computer using your username
                    and password.
                  </span>
                </p>
                <p className="flex items-start">
                  <span className="font-semibold text-gray-700 mr-3 min-w-[20px]">
                    2.
                  </span>
                  <span className="text-gray-600">
                    After logging in, carefully read and follow the instructions
                    displayed on the computer screen.
                  </span>
                </p>
                <p className="flex items-start">
                  <span className="font-semibold text-gray-700 mr-3 min-w-[20px]">
                    3.
                  </span>
                  <span className="text-gray-600">
                    Looking around, talking to others, copying, or any form of
                    cheating is strictly prohibited.
                  </span>
                </p>
                <p className="flex items-start">
                  <span className="font-semibold text-gray-700 mr-3 min-w-[20px]">
                    4.
                  </span>
                  <span className="text-gray-600">
                    Mobile phones, notes, calculators, and any kind of
                    electronic gadgets are not allowed inside the examination
                    hall. If such items are brought within the examination
                    center premises, they must be deposited at the designated
                    place for safekeeping and can be collected only after the
                    examination is over.
                  </span>
                </p>
                <p className="flex items-start">
                  <span className="font-semibold text-gray-700 mr-3 min-w-[20px]">
                    5.
                  </span>
                  <span className="text-gray-600">
                    Candidates will not be allowed to use the washroom until one
                    hour after the examination has started.
                  </span>
                </p>
                <p className="flex items-start">
                  <span className="font-semibold text-gray-700 mr-3 min-w-[20px]">
                    6.
                  </span>
                  <span className="text-gray-600">
                    In case of any emergency, please immediately inform or
                    signal the assigned invigilator.
                  </span>
                </p>
                <p className="flex items-start">
                  <span className="font-semibold text-gray-700 mr-3 min-w-[20px]">
                    7.
                  </span>
                  <span className="text-gray-600">
                    If you face any issue related to the question paper or any
                    technical problem, raise your hand to signal the assigned
                    invigilator.
                  </span>
                </p>
                <p className="flex items-start">
                  <span className="font-semibold text-gray-700 mr-3 min-w-[20px]">
                    8.
                  </span>
                  <span className="text-gray-600">
                    Please manage your time carefully by keeping track of the
                    timer displayed on the computer screen.
                  </span>
                </p>
                <p className="flex items-start">
                  <span className="font-semibold text-gray-700 mr-3 min-w-[20px]">
                    9.
                  </span>
                  <span className="text-gray-600">
                    After the examination time is over, or once you have
                    completed your exam, please submit your answers properly
                    before leaving.
                  </span>
                </p>
              </div>
            </div>

            {/* Nepali Instructions */}
            <div className="text-sm leading-relaxed">
              <h3 className="text-lg font-bold mb-4 text-gray-800 border-b border-gray-200 pb-2 inline-block">
                Nepali
              </h3>
              <div className="space-y-3 pl-2">
                <p className="flex items-start">
                  <span className="font-semibold text-gray-700 mr-3 min-w-[20px]">
                    १.
                  </span>
                  <span className="text-gray-600">
                    आफ्नो युजरनेम र पासवर्डको सहायताले आफ्नो सिटको कम्प्यूटर
                    लगइन गर्नुहोस ।
                  </span>
                </p>
                <p className="flex items-start">
                  <span className="font-semibold text-gray-700 mr-3 min-w-[20px]">
                    २.
                  </span>
                  <span className="text-gray-600">
                    लगइन गरिसकेपछी कम्प्यूटरको स्क्रिनमा दिइएको निर्देशनहरु
                    अध्ययन र पालना गर्नुहोस ।
                  </span>
                </p>
                <p className="flex items-start">
                  <span className="font-semibold text-gray-700 mr-3 min-w-[20px]">
                    ३.
                  </span>
                  <span className="text-gray-600">
                    दाँयाबाया हेर्न अरुसंग कुराकानी गर्न कपि गर्न चिटिङ गर्न
                    सख्त मनाई गरिएको छ ।
                  </span>
                </p>
                <p className="flex items-start">
                  <span className="font-semibold text-gray-700 mr-3 min-w-[20px]">
                    ४.
                  </span>
                  <span className="text-gray-600">
                    मोवाईल फोन¸नोट¸क्याल्कुलेटरका साथै कुनैपनि इलेक्ट्रिक
                    ग्याजेटहरु परीक्षा हलमा लान निषेध गरिएको छ।परीक्षा केन्द्रको
                    परिसरमा यस्ता बस्तु लगेमा तोकिएको स्थानमा सुरक्षीत साथ राखि
                    परीक्षा सकिएपछि मात्र लान पाइनेछ।
                  </span>
                </p>
                <p className="flex items-start">
                  <span className="font-semibold text-gray-700 mr-3 min-w-[20px]">
                    ५.
                  </span>
                  <span className="text-gray-600">
                    परीक्षा सुरु भएको १ एक घण्टा नभै वासरुम जान पाइने छैन ।
                  </span>
                </p>
                <p className="flex items-start">
                  <span className="font-semibold text-gray-700 mr-3 min-w-[20px]">
                    ६.
                  </span>
                  <span className="text-gray-600">
                    आपतकालीन अवस्था परेमा तुरुन्त खटिएका निरिक्षकलाई संकेत वा
                    जानकारी गराउनु होला ।
                  </span>
                </p>
                <p className="flex items-start">
                  <span className="font-semibold text-gray-700 mr-3 min-w-[20px]">
                    ७.
                  </span>
                  <span className="text-gray-600">
                    कुनै प्रश्न पत्र सम्बन्धी वा प्राबिधिक समस्या परेमा तोकिएको
                    निरिक्षकलाई हात उठाएर संकेत गर्नुपर्नेछ ।
                  </span>
                </p>
                <p className="flex items-start">
                  <span className="font-semibold text-gray-700 mr-3 min-w-[20px]">
                    ८.
                  </span>
                  <span className="text-gray-600">
                    कम्प्यूटरको स्क्रिनमा टाइमरले देखाएको समयको ख्याल गरी समय
                    व्यवस्थापन गर्नुहोला ।
                  </span>
                </p>
                <p className="flex items-start">
                  <span className="font-semibold text-gray-700 mr-3 min-w-[20px]">
                    ९.
                  </span>
                  <span className="text-gray-600">
                    परीक्षाको समय समाप्त भएपछि वा आफुले परिक्षा सकेपछि सब्मिट
                    गरेर मात्र जानुहोला ।
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Right Section - Login Form */}
      <section className="w-full lg:w-5/12 bg-gradient-to-br from-purple-50 to-blue-50 p-8 lg:p-12 flex flex-col justify-center border-l border-gray-100">
        <LoginForm />
      </section>
    </div>

  );
};

export default Login;
