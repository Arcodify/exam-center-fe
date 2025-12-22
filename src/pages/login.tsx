import LoginForm from "@/components/auth/login-form";

const Login = () => {
  return (
    <div className="grid grid-cols-3 min-h-screen gap-2 p-1">
      <div className="grid place-content-center">
        <section className="text-[12px]  w-full shadow rounded-lg p-3 ">
          <div className="mb-2">
            <p className="font-bold">Exam Instructions for Students</p>
            <p className="mb-2 font-bold">(English Version)</p>
            <p className="mb-2 font-bold">Dear Students,</p>
            <p className="mb-2">
              Please read and follow these instructions carefully before and
              during the online exam:
            </p>
          </div>

          <div className="mb-2">
            <p className="font-bold">1. Preparation</p>
            <ul className="list-disc pl-6 mt-1">
              <li>
                Ensure you have a stable internet connection and a quiet,
                distraction-free environment.
              </li>
              <li>
                Use a supported browser (latest Chrome, Firefox, or Edge).
              </li>
              <li>
                Log in to the exam portal at least 10 minutes before the
                scheduled start time.
              </li>
            </ul>
          </div>

          <div className="mb-2">
            <p className="font-bold">2. During the Exam</p>
            <ul className="list-disc pl-6 mt-1">
              <li>
                A timer will be displayed. Complete and submit within the given
                time limit.
              </li>
              <li>Read each question carefully before answering.</li>
              <li>You may navigate between questions until submission.</li>
              <li>
                You will be warned about unanswered questions before final
                submission.
              </li>
            </ul>
          </div>

          <div className="mb-2">
            <p className="font-bold">3. Submission Rules</p>
            <ul className="list-disc pl-6 mt-1">
              <li>Submission is final and cannot be reversed.</li>
              <li>You cannot view or modify answers after submission.</li>
              <li>Review all answers carefully before submitting.</li>
            </ul>
          </div>

          <div className="mb-2">
            <p className="font-bold">4. Technical Guidelines</p>
            <ul className="list-disc pl-6 mt-1">
              <li>Do not refresh or close the browser during the exam.</li>
              <li>
                Contact the exam helpline immediately in case of technical
                issues.
              </li>
              <li>Use only one device and one browser tab.</li>
            </ul>
          </div>

          <div className="mb-2">
            <p className="font-bold">5. Academic Integrity</p>
            <ul className="list-disc pl-6 mt-1">
              <li>This is a closed-book exam. No external help is allowed.</li>
              <li>Any form of cheating results in disqualification.</li>
            </ul>
          </div>

          <div className="">
            <p className="font-bold">
              We wish you the best of luck. Focus calmly and give your best
              effort.
            </p>
          </div>
        </section>
      </div>

      <div className="flex items-center justify-center">
        <LoginForm />
      </div>

      <div className="grid place-content-center">
        <section className="text-[12px]  w-full shadow rounded-lg p-3 ">
          <div className="mb-4">
            <p className="font-bold text-lg mb-2">
              परीक्षा निर्देशिकाहरू: विद्यार्थीहरूका लागि
            </p>
            <p className="mb-4">
              प्रिय विद्यार्थीहरू, कृपया अनलाइन परीक्षा सुरु गर्नुअघि र परीक्षा
              चलिरहेको बेला यी निर्देशनहरूलाई ध्यानपूर्वक पढ्नुहोस् र पालना
              गर्नुहोस्:
            </p>

            <div className="mb-2">
              <p className="font-bold">१. तयारी</p>
              <ul className="list-disc pl-6 mt-1">
                <li>
                  स्थिर इन्टरनेट जडान र शान्त, विक्षेप-रहित वातावरण सुनिश्चित
                  गर्नुहोस्।
                </li>
                <li>
                  समर्थित ब्राउजर (जस्तै: Chrome, Firefox वा Edge को नवीनतम
                  संस्करण) प्रयोग गर्नुहोस् र यसलाई अद्यावधिक राख्नुहोस्।
                </li>
                <li>
                  निर्धारित सुरु समयभन्दा कम्तीमा १० मिनेट अघि परीक्षा पोर्टलमा
                  लगइन गर्नुहोस्।
                </li>
              </ul>
            </div>

            <div className="mb-2">
              <p className="font-bold">२. परीक्षा चलिरहेको बेला</p>
              <ul className="list-disc pl-6 mt-1">
                <li>
                  परीक्षा सुरु भएपछि टाइमर देखाइनेछ। तोकिएको समयभित्रै उत्तर
                  बुझाउनुपर्नेछ।
                </li>
                <li>
                  प्रत्येक प्रश्नलाई ध्यानपूर्वक पढेर मात्र उत्तर दिनुहोस्।
                </li>
                <li>
                  अन्तिम बुझाउनु अघिसम्म प्रश्नहरू बीच आवतजावत गरेर उत्तरहरू
                  जाँच्न वा परिवर्तन गर्न सकिन्छ।
                </li>
                <li>
                  केही प्रश्नहरू अनुत्तरित रहन सक्छन् – अन्तिम बुझाउने समयमा
                  प्रणालीले तपाईंलाई सम्झना गराउनेछ।
                </li>
              </ul>
            </div>

            <div className="mb-2">
              <p className="font-bold">३. बुझाउने नियमहरू</p>
              <ul className="list-disc pl-6 mt-1">
                <li>बुझाउने कार्य अन्तिम हो र यसलाई उल्टाउन सकिँदैन।</li>
                <li>
                  बुझाएपछि तपाईंले आफ्ना उत्तरहरू हेर्न वा परिवर्तन गर्न
                  सक्नुहुने छैन।
                </li>
                <li>
                  कृपया सबै उत्तरहरू राम्ररी जाँच गर्नुहोस्। यदि कुनै प्रश्न
                  अनुत्तरित छन् भने चेतावनी देखाइनेछ।
                </li>
              </ul>
            </div>

            <div className="mb-2">
              <p className="font-bold">४. प्राविधिक निर्देशनहरू</p>
              <ul className="list-disc pl-6 mt-1">
                <li>
                  परीक्षा चलिरहेको बेला पेज रिफ्रेस नगर्नुहोस् वा ब्राउजर बन्द
                  नगर्नुहोस् – यसले प्रगति गुम्न सक्छ।
                </li>
                <li>
                  प्राविधिक समस्या भएमा तुरुन्तै उपलब्ध परीक्षा सहायता/सम्पर्क
                  नम्बरमा सम्पर्क गर्नुहोस्।
                </li>
                <li>
                  परीक्षाका लागि एउटा मात्र यन्त्र र एउटा मात्र ब्राउजर ट्याब
                  प्रयोग गर्नुहोस्। धेरै ट्याब वा यन्त्रहरूलाई दुरुपयोगको रूपमा
                  गणना गर्न सकिन्छ।
                </li>
              </ul>
            </div>

            <div className="mb-2">
              <p className="font-bold">५. शैक्षिक इमानदारी</p>
              <ul className="list-disc pl-6 mt-1">
                <li>
                  यो बन्द-पुस्तक परीक्षा हो। कुनै बाह्य सहायता, किताब, नोट्स वा
                  अरूसँग संवाद गर्न पाइने छैन।
                </li>
                <li>कुनै पनि प्रकारको चिट वा दुरुपयोग भएमा अयोग्य ठहरिनेछ।</li>
              </ul>
            </div>

            <p className="mt-4 font-bold italic">
              तपाईंहरूलाई शुभकामना! शान्त रहनुहोस् र आफ्नो उत्कृष्ट प्रयास
              गर्नुहोस्।
            </p>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Login;
