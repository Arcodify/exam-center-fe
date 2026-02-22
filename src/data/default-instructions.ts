export const DEFAULT_ENGLISH_INSTRUCTIONS: string[] = [
  "Please log in to your assigned computer using your username and password.",
  "After logging in, carefully read and follow the instructions displayed on the computer screen.",
  "Looking around, talking to others, copying, or any form of cheating is strictly prohibited.",
  "Mobile phones, notes, calculators, and any kind of electronic gadgets are not allowed inside the examination hall. If such items are brought within the examination center premises, they must be deposited at the designated place for safekeeping and can be collected only after the examination is over.",
  "Candidates will not be allowed to use the washroom until one hour after the examination has started.",
  "In case of any emergency, please immediately inform or signal the assigned invigilator.",
  "If you face any issue related to the question paper or any technical problem, raise your hand to signal the assigned invigilator.",
  "Please manage your time carefully by keeping track of the timer displayed on the computer screen.",
  "After the examination time is over, or once you have completed your exam, please submit your answers properly before leaving.",
];

export const DEFAULT_NEPALI_INSTRUCTIONS: string[] = [
  "आफ्नो युजरनेम र पासवर्डको सहायताले आफ्नो सिटको कम्प्यूटर लगइन गर्नुहोस ।",
  "लगइन गरिसकेपछी कम्प्यूटरको स्क्रिनमा दिइएको निर्देशनहरु अध्ययन र पालना गर्नुहोस ।",
  "दाँयाबाया हेर्न अरुसंग कुराकानी गर्न कपि गर्न चिटिङ गर्न सख्त मनाई गरिएको छ ।",
  "मोवाईल फोन¸नोट¸क्याल्कुलेटरका साथै कुनैपनि इलेक्ट्रिक ग्याजेटहरु परीक्षा हलमा लान निषेध गरिएको छ। परीक्षा केन्द्रको परिसरमा यस्ता बस्तु लगेमा तोकिएको स्थानमा सुरक्षीत साथ राखि परीक्षा सकिएपछि मात्र लान पाइनेछ।",
  "परीक्षा सुरु भएको १ एक घण्टा नभै वासरुम जान पाइने छैन ।",
  "आपतकालीन अवस्था परेमा तुरुन्त खटिएका निरिक्षकलाई संकेत वा जानकारी गराउनु होला ।",
  "कुनै प्रश्न पत्र सम्बन्धी वा प्राबिधिक समस्या परेमा तोकिएको निरिक्षकलाई हात उठाएर संकेत गर्नुपर्नेछ ।",
  "कम्प्यूटरको स्क्रिनमा टाइमरले देखाएको समयको ख्याल गरी समय व्यवस्थापन गर्नुहोला ।",
  "परीक्षाको समय समाप्त भएपछि वा आफुले परिक्षा सकेपछि सब्मिट गरेर मात्र जानुहोला ।",
];

const NEPALI_NUM_MAP: Record<string, string> = {
  "0": "०",
  "1": "१",
  "2": "२",
  "3": "३",
  "4": "४",
  "5": "५",
  "6": "६",
  "7": "७",
  "8": "८",
  "9": "९",
};

export const toNepaliNumber = (num: number) =>
  String(num)
    .split("")
    .map((d) => NEPALI_NUM_MAP[d] ?? d)
    .join("");
