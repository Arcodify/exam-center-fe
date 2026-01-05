import LoginForm from "@/components/auth/login-form";

const Login = () => {
  return (
    <div className="grid grid-cols-2 h-screen gap-2 p-1">
      <section className="w-full h-auto flex flex-col">
        <section className="text-[13px] w-full p-3 h-full">
          <h3 className="text-2xl mb-4">
            Instructions and Guidelines for Examinees
          </h3>
          <p className="pl-4 mb-1">
            <span className="mr-1">1.</span> Please log in to your assigned
            computer using your username and password.
          </p>
          <p className="pl-4 mb-1">
            <span className="mr-1">2.</span> After logging in, carefully read
            and follow the instructions displayed on the computer screen.
          </p>
          <p className="pl-4 mb-1">
            <span className="mr-1">3.</span> Looking around, talking to others,
            copying, or any form of cheating is strictly prohibited.
          </p>
          <p className="pl-4 mb-1">
            <span className="mr-1">4.</span> Mobile phones, notes, calculators,
            and any kind of electronic gadgets are not allowed inside the
            examination hall. If such items are brought within the examination
            center premises, they must be deposited at the designated place for
            safekeeping and can be collected only after the examination is over.
          </p>
          <p className="pl-4 mb-1">
            <span className="mr-1">5.</span> Candidates will not be allowed to
            use the washroom until one hour after the examination has started.
          </p>
          <p className="pl-4 mb-1">
            <span className="mr-1">6.</span> In case of any emergency, please
            immediately inform or signal the assigned invigilator.
          </p>
          <p className="pl-4 mb-1">
            <span className="mr-1">7.</span> If you face any issue related to
            the question paper or any technical problem, raise your hand to
            signal the assigned invigilator.
          </p>
          <p className="pl-4 mb-1">
            <span className="mr-1">8.</span> Please manage your time carefully
            by keeping track of the timer displayed on the computer screen.
          </p>
          <p className="pl-4 mb-1">
            <span className="mr-1">9.</span> After the examination time is over,
            or once you have completed your exam, please submit your answers
            properly before leaving.
          </p>
          Thank you.
        </section>

        <section className="text-[13px] w-full p-3 h-full">
          <h3 className="text-2xl mb-4">
            परीक्षार्थीहरुको लागि सुझाव तथा निर्देशनहरु
          </h3>
          <p className="pl-4 mb-1">
            <span className="mr-1">१.</span>आफ्नो युजरनेम र पासवर्डको सहायताले
            आफ्नो सिटको कम्प्यूटर लगइन गर्नुहोस ।
          </p>
          <p className="pl-4 mb-1">
            <span className="mr-1">२.</span>लगइन गरिसकेपछी कम्प्यूटरको स्क्रिनमा
            दिइएको निर्देशनहरु अध्ययन र पालना गर्नुहोस ।
          </p>
          <p className="pl-4 mb-1">
            <span className="mr-1">३.</span>दाँयाबाया हेर्न अरुसंग कुराकानी गर्न
            कपि गर्न चिटिङ गर्न सख्त मनाई गरिएको छ ।
          </p>
          <p className="pl-4 mb-1">
            <span className="mr-1">४.</span>मोवाईल फोन¸नोट¸क्याल्कुलेटरका साथै
            कुनैपनि इलेक्ट्रिक ग्याजेटहरु परीक्षा हलमा लान निषेध गरिएको
            छ।परीक्षा केन्द्रको परिसरमा यस्ता बस्तु लगेमा तोकिएको स्थानमा
            सुरक्षीत साथ राखि परीक्षा सकिएपछि मात्र लान पाइनेछ।
          </p>
          <p className="pl-4 mb-1">
            <span className="mr-1">५.</span>परीक्षा सुरु भएको १ एक घण्टा नभै
            वासरुम जान पाइने छैन ।
          </p>
          <p className="pl-4 mb-1">
            <span className="mr-1">६.</span>आपतकालीन अवस्था परेमा तुरुन्त खटिएका
            निरिक्षकलाई संकेत वा जानकारी गराउनु होला ।
          </p>
          <p className="pl-4 mb-1">
            <span className="mr-1">७.</span>कुनै प्रश्न पत्र सम्बन्धी वा
            प्राबिधिक समस्या परेमा तोकिएको निरिक्षकलाई हात उठाएर संकेत
            गर्नुपर्नेछ ।
          </p>
          <p className="pl-4 mb-1">
            <span className="mr-1">८.</span>कम्प्यूटरको स्क्रिनमा टाइमरले
            देखाएको समयको ख्याल गरी समय व्यवस्थापन गर्नुहोला ।
          </p>
          <p className="pl-4 mb-1">
            <span className="mr-1">९.</span>परीक्षाको समय समाप्त भएपछि वा आफुले
            परिक्षा सकेपछि सब्मिट गरेर मात्र जानुहोला ।
          </p>
          धन्यवाद
        </section>
      </section>

      <div className="w-full h-full max-w-md mx-auto pr-2 flex justify-center items-center">
        <LoginForm />
      </div>
    </div>
  );
};

export default Login;
