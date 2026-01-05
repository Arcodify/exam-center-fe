import LoginForm from "@/components/auth/login-form";

const Login = () => {
  return (
    <div className="h-screen lg:grid lg:grid-cols-5">
      {/* Left Section - Instructions */}
      <section className="lg:col-span-3 flex flex-col bg-gray-50 min-h-screen">
        <div className="h-full lg:overflow-y-auto py-6 px-8">
          {/* Main Header */}
          <div className="mb-8 pb-6 border-b border-gray-200">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Instructions and Guidelines for Examinees
            </h1>
            <h2 className="text-2xl font-semibold text-gray-700">
              परीक्षार्थीहरुको लागि सुझाव तथा निर्देशनहरु
            </h2>
          </div>

          <div className="space-y-10">
            {/* English Instructions */}
            <div className="text-sm leading-relaxed">
              <h3 className="text-xl font-semibold mb-6 text-gray-800 bg-blue-50 px-4 py-2 rounded-lg">
                English
              </h3>
              <div className="space-y-3">
                <p className="flex items-start">
                  <span className="font-medium text-blue-600 mr-3 mt-0.5">
                    1.
                  </span>
                  <span>
                    Please log in to your assigned computer using your username
                    and password.
                  </span>
                </p>
                <p className="flex items-start">
                  <span className="font-medium text-blue-600 mr-3 mt-0.5">
                    2.
                  </span>
                  <span>
                    After logging in, carefully read and follow the instructions
                    displayed on the computer screen.
                  </span>
                </p>
                <p className="flex items-start">
                  <span className="font-medium text-blue-600 mr-3 mt-0.5">
                    3.
                  </span>
                  <span>
                    Looking around, talking to others, copying, or any form of
                    cheating is strictly prohibited.
                  </span>
                </p>
                <p className="flex items-start">
                  <span className="font-medium text-blue-600 mr-3 mt-0.5">
                    4.
                  </span>
                  <span>
                    Mobile phones, notes, calculators, and any kind of
                    electronic gadgets are not allowed inside the examination
                    hall. If such items are brought within the examination
                    center premises, they must be deposited at the designated
                    place for safekeeping and can be collected only after the
                    examination is over.
                  </span>
                </p>
                <p className="flex items-start">
                  <span className="font-medium text-blue-600 mr-3 mt-0.5">
                    5.
                  </span>
                  <span>
                    Candidates will not be allowed to use the washroom until one
                    hour after the examination has started.
                  </span>
                </p>
                <p className="flex items-start">
                  <span className="font-medium text-blue-600 mr-3 mt-0.5">
                    6.
                  </span>
                  <span>
                    In case of any emergency, please immediately inform or
                    signal the assigned invigilator.
                  </span>
                </p>
                <p className="flex items-start">
                  <span className="font-medium text-blue-600 mr-3 mt-0.5">
                    7.
                  </span>
                  <span>
                    If you face any issue related to the question paper or any
                    technical problem, raise your hand to signal the assigned
                    invigilator.
                  </span>
                </p>
                <p className="flex items-start">
                  <span className="font-medium text-blue-600 mr-3 mt-0.5">
                    8.
                  </span>
                  <span>
                    Please manage your time carefully by keeping track of the
                    timer displayed on the computer screen.
                  </span>
                </p>
                <p className="flex items-start">
                  <span className="font-medium text-blue-600 mr-3 mt-0.5">
                    9.
                  </span>
                  <span>
                    After the examination time is over, or once you have
                    completed your exam, please submit your answers properly
                    before leaving.
                  </span>
                </p>
              </div>
            </div>

            {/* Nepali Instructions */}
            <div className="text-sm leading-relaxed">
              <h3 className="text-xl font-semibold mb-6 text-gray-800 bg-blue-50 px-4 py-2 rounded-lg">
                Nepali
              </h3>
              <div className="space-y-3">
                <p className="flex items-start">
                  <span className="font-medium text-blue-600 mr-3 mt-0.5">
                    १.
                  </span>
                  <span>
                    आफ्नो युजरनेम र पासवर्डको सहायताले आफ्नो सिटको कम्प्यूटर
                    लगइन गर्नुहोस ।
                  </span>
                </p>
                <p className="flex items-start">
                  <span className="font-medium text-blue-600 mr-3 mt-0.5">
                    २.
                  </span>
                  <span>
                    लगइन गरिसकेपछी कम्प्यूटरको स्क्रिनमा दिइएको निर्देशनहरु
                    अध्ययन र पालना गर्नुहोस ।
                  </span>
                </p>
                <p className="flex items-start">
                  <span className="font-medium text-blue-600 mr-3 mt-0.5">
                    ३.
                  </span>
                  <span>
                    दाँयाबाया हेर्न अरुसंग कुराकानी गर्न कपि गर्न चिटिङ गर्न
                    सख्त मनाई गरिएको छ ।
                  </span>
                </p>
                <p className="flex items-start">
                  <span className="font-medium text-blue-600 mr-3 mt-0.5">
                    ४.
                  </span>
                  <span>
                    मोवाईल फोन¸नोट¸क्याल्कुलेटरका साथै कुनैपनि इलेक्ट्रिक
                    ग्याजेटहरु परीक्षा हलमा लान निषेध गरिएको छ।परीक्षा केन्द्रको
                    परिसरमा यस्ता बस्तु लगेमा तोकिएको स्थानमा सुरक्षीत साथ राखि
                    परीक्षा सकिएपछि मात्र लान पाइनेछ।
                  </span>
                </p>
                <p className="flex items-start">
                  <span className="font-medium text-blue-600 mr-3 mt-0.5">
                    ५.
                  </span>
                  <span>
                    परीक्षा सुरु भएको १ एक घण्टा नभै वासरुम जान पाइने छैन ।
                  </span>
                </p>
                <p className="flex items-start">
                  <span className="font-medium text-blue-600 mr-3 mt-0.5">
                    ६.
                  </span>
                  <span>
                    आपतकालीन अवस्था परेमा तुरुन्त खटिएका निरिक्षकलाई संकेत वा
                    जानकारी गराउनु होला ।
                  </span>
                </p>
                <p className="flex items-start">
                  <span className="font-medium text-blue-600 mr-3 mt-0.5">
                    ७.
                  </span>
                  <span>
                    कुनै प्रश्न पत्र सम्बन्धी वा प्राबिधिक समस्या परेमा तोकिएको
                    निरिक्षकलाई हात उठाएर संकेत गर्नुपर्नेछ ।
                  </span>
                </p>
                <p className="flex items-start">
                  <span className="font-medium text-blue-600 mr-3 mt-0.5">
                    ८.
                  </span>
                  <span>
                    कम्प्यूटरको स्क्रिनमा टाइमरले देखाएको समयको ख्याल गरी समय
                    व्यवस्थापन गर्नुहोला ।
                  </span>
                </p>
                <p className="flex items-start">
                  <span className="font-medium text-blue-600 mr-3 mt-0.5">
                    ९.
                  </span>
                  <span>
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
      <section className="flex items-start justify-center w-full mx-auto lg:min-h-screen bg-white relative max-w-2xl lg:col-span-2 px-8 py-10 lg:py-4">
        <LoginForm />
      </section>
    </div>
  );
};

export default Login;
