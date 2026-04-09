// ============================================================
//  SANJEEVANI SMART-SHIELD — Internationalization (i18n)
//  All 22 officially recognized languages of India (Eighth Schedule)
//  + English as default
// ============================================================

const LANGUAGES = [
  { code: "en",  name: "English",      native: "English",       rtl: false },
  { code: "hi",  name: "Hindi",        native: "हिन्दी",           rtl: false },
  { code: "bn",  name: "Bengali",      native: "বাংলা",           rtl: false },
  { code: "te",  name: "Telugu",       native: "తెలుగు",          rtl: false },
  { code: "mr",  name: "Marathi",      native: "मराठी",           rtl: false },
  { code: "ta",  name: "Tamil",        native: "தமிழ்",           rtl: false },
  { code: "ur",  name: "Urdu",         native: "اردو",            rtl: true  },
  { code: "gu",  name: "Gujarati",     native: "ગુજરાતી",         rtl: false },
  { code: "kn",  name: "Kannada",      native: "ಕನ್ನಡ",           rtl: false },
  { code: "or",  name: "Odia",         native: "ଓଡ଼ିଆ",           rtl: false },
  { code: "pa",  name: "Punjabi",      native: "ਪੰਜਾਬੀ",          rtl: false },
  { code: "as",  name: "Assamese",     native: "অসমীয়া",          rtl: false },
  { code: "ml",  name: "Malayalam",    native: "മലയാളം",          rtl: false },
  { code: "mai", name: "Maithili",     native: "मैथिली",          rtl: false },
  { code: "sat", name: "Santali",      native: "ᱥᱟᱱᱛᱟᱲᱤ",       rtl: false },
  { code: "ks",  name: "Kashmiri",     native: "کٲشُر",            rtl: true  },
  { code: "ne",  name: "Nepali",       native: "नेपाली",          rtl: false },
  { code: "sd",  name: "Sindhi",       native: "سنڌي",            rtl: true  },
  { code: "kok", name: "Konkani",      native: "कोंकणी",          rtl: false },
  { code: "doi", name: "Dogri",        native: "डोगरी",           rtl: false },
  { code: "mni", name: "Manipuri",     native: "মৈতৈলোন্",        rtl: false },
  { code: "brx", name: "Bodo",         native: "बड़ो",             rtl: false },
  { code: "sa",  name: "Sanskrit",     native: "संस्कृतम्",        rtl: false },
];

// ---- Translation strings ----------------------------------
const TRANSLATIONS = {
  en: {
    emergency_banner:    "Medical Emergency — Scan Verified",
    blood_type_label:    "🩸 Blood Type",
    organ_donor:         "💚 Registered Organ Donor",
    allergy_title:       "⚠ Critical Allergies — Do NOT administer",
    condition_title:     "🏥 Known Medical Conditions",
    ice_title:           "📞 Emergency Contacts — Tap to Call",
    primary_ice:         "Primary ICE Contact",
    backup_ice:          "Backup Contact",
    hospital_title:      "Find Nearest Emergency Hospital",
    hospital_sub:        "Trauma Centers · ICU · Blood Banks",
    blood_bank_title:    "🩸 Blood Bank Availability",
    sos_dispatched:      "SOS Alert Dispatched",
    sos_resend:          "Tap to resend SOS on WhatsApp",
    loading:             "Retrieving medical profile...",
    patient_needs:       "Patient Needs",
    verified:            "✅ Sanjeevani Verified",
    map_title:           "📍 Incident Location",
    map_open:            "Open in Google Maps",
    profile_updated:     "Profile last updated:",
    allergic_prefix:     "⚠ ALLERGIC:",
    powered_by:          "Powered by",
    live:                "Live",
    call:                "📞 Call",
  },
  hi: {
    emergency_banner:    "चिकित्सा आपातकाल — स्कैन सत्यापित",
    blood_type_label:    "🩸 रक्त समूह",
    organ_donor:         "💚 पंजीकृत अंगदाता",
    allergy_title:       "⚠ गंभीर एलर्जी — यह दवाएँ न दें",
    condition_title:     "🏥 ज्ञात चिकित्सीय स्थितियाँ",
    ice_title:           "📞 आपातकालीन संपर्क — कॉल करें",
    primary_ice:         "प्राथमिक ICE संपर्क",
    backup_ice:          "बैकअप संपर्क",
    hospital_title:      "नजदीकी इमरजेंसी अस्पताल खोजें",
    hospital_sub:        "ट्रॉमा सेंटर · ICU · ब्लड बैंक",
    blood_bank_title:    "🩸 ब्लड बैंक उपलब्धता",
    sos_dispatched:      "SOS अलर्ट भेज दिया गया",
    sos_resend:          "WhatsApp पर SOS दोबारा भेजें",
    loading:             "चिकित्सीय प्रोफ़ाइल प्राप्त हो रही है...",
    patient_needs:       "मरीज़ को चाहिए",
    verified:            "✅ संजीवनी सत्यापित",
    map_title:           "📍 घटना स्थान",
    map_open:            "Google Maps में खोलें",
    profile_updated:     "प्रोफ़ाइल अंतिम अपडेट:",
    allergic_prefix:     "⚠ एलर्जी:",
    powered_by:          "द्वारा संचालित",
    live:                "लाइव",
    call:                "📞 कॉल करें",
  },
  bn: {
    emergency_banner:    "চিকিৎসা জরুরি অবস্থা — স্ক্যান যাচাইকৃত",
    blood_type_label:    "🩸 রক্তের গ্রুপ",
    organ_donor:         "💚 নিবন্ধিত অঙ্গদাতা",
    allergy_title:       "⚠ গুরুতর অ্যালার্জি — এই ওষুধ দেবেন না",
    condition_title:     "🏥 পরিচিত চিকিৎসা অবস্থা",
    ice_title:           "📞 জরুরি যোগাযোগ — ট্যাপ করুন",
    primary_ice:         "প্রাথমিক ICE যোগাযোগ",
    backup_ice:          "ব্যাকআপ যোগাযোগ",
    hospital_title:      "নিকটতম জরুরি হাসপাতাল খুঁজুন",
    hospital_sub:        "ট্রমা সেন্টার · ICU · ব্লাড ব্যাংক",
    blood_bank_title:    "🩸 রক্ত ব্যাংক প্রাপ্যতা",
    sos_dispatched:      "SOS সতর্কতা পাঠানো হয়েছে",
    sos_resend:          "WhatsApp-এ SOS পুনরায় পাঠান",
    loading:             "চিকিৎসা প্রোফাইল পুনরুদ্ধার হচ্ছে...",
    patient_needs:       "রোগীর প্রয়োজন",
    verified:            "✅ সঞ্জীবনী যাচাইকৃত",
    map_title:           "📍 ঘটনাস্থল",
    map_open:            "Google Maps-এ খুলুন",
    profile_updated:     "প্রোফাইল শেষ আপডেট:",
    allergic_prefix:     "⚠ অ্যালার্জি:",
    powered_by:          "দ্বারা চালিত",
    live:                "লাইভ",
    call:                "📞 কল করুন",
  },
  te: {
    emergency_banner:    "వైద్య అత్యవసర స్థితి — స్కాన్ ధృవీకరించబడింది",
    blood_type_label:    "🩸 రక్త వర్గం",
    organ_donor:         "💚 నమోదైన అంగదాత",
    allergy_title:       "⚠ తీవ్రమైన అలెర్జీలు — ఇవి ఇవ్వకండి",
    condition_title:     "🏥 తెలిసిన వైద్య పరిస్థితులు",
    ice_title:           "📞 అత్యవసర పరిచయాలు — నొక్కండి",
    primary_ice:         "ప్రాధమిక ICE పరిచయం",
    backup_ice:          "బ్యాకప్ పరిచయం",
    hospital_title:      "సమీప అత్యవసర ఆసుపత్రిని కనుగొనండి",
    hospital_sub:        "ట్రామా సెంటర్లు · ICU · రక్తం బ్యాంక్",
    blood_bank_title:    "🩸 రక్తం బ్యాంక్ లభ్యత",
    sos_dispatched:      "SOS హెచ్చరిక పంపబడింది",
    sos_resend:          "WhatsApp లో SOS మళ్ళీ పంపండి",
    loading:             "వైద్య ప్రొఫైల్ తిరిగి పొందుతున్నాం...",
    patient_needs:       "రోగికి అవసరం",
    verified:            "✅ సంజీవని ధృవీకరించబడింది",
    map_title:           "📍 సంఘటన స్థానం",
    map_open:            "Google Maps లో తెరవండి",
    profile_updated:     "ప్రొఫైల్ చివరగా నవీకరించబడింది:",
    allergic_prefix:     "⚠ అలెర్జీ:",
    powered_by:          "ద్వారా నడపబడింది",
    live:                "లైవ్",
    call:                "📞 కాల్ చేయి",
  },
  mr: {
    emergency_banner:    "वैद्यकीय आणीबाणी — स्कॅन सत्यापित",
    blood_type_label:    "🩸 रक्तगट",
    organ_donor:         "💚 नोंदणीकृत अवयवदाता",
    allergy_title:       "⚠ गंभीर ऍलर्जी — हे देऊ नका",
    condition_title:     "🏥 ज्ञात वैद्यकीय परिस्थिती",
    ice_title:           "📞 आणीबाणी संपर्क — टॅप करा",
    primary_ice:         "प्राथमिक ICE संपर्क",
    backup_ice:          "बॅकअप संपर्क",
    hospital_title:      "जवळचे आणीबाणी रुग्णालय शोधा",
    hospital_sub:        "ट्रामा सेंटर · ICU · ब्लड बँक",
    blood_bank_title:    "🩸 ब्लड बँक उपलब्धता",
    sos_dispatched:      "SOS अलर्ट पाठवला",
    sos_resend:          "WhatsApp वर SOS पुन्हा पाठवा",
    loading:             "वैद्यकीय प्रोफाइल मिळवत आहे...",
    patient_needs:       "रुग्णाला आवश्यक",
    verified:            "✅ संजीवनी सत्यापित",
    map_title:           "📍 घटनेचे ठिकाण",
    map_open:            "Google Maps मध्ये उघडा",
    profile_updated:     "प्रोफाइल शेवटचे अपडेट:",
    allergic_prefix:     "⚠ ऍलर्जी:",
    powered_by:          "द्वारे चालित",
    live:                "थेट",
    call:                "📞 कॉल करा",
  },
  ta: {
    emergency_banner:    "மருத்துவ அவசரநிலை — ஸ்கேன் சரிபார்க்கப்பட்டது",
    blood_type_label:    "🩸 இரத்த வகை",
    organ_donor:         "💚 பதிவு செய்யப்பட்ட உறுப்பு தானியர்",
    allergy_title:       "⚠ தீவிர ஒவ்வாமை — இவற்றை கொடுக்காதீர்கள்",
    condition_title:     "🏥 அறியப்பட்ட மருத்துவ நிலைமைகள்",
    ice_title:           "📞 அவசரகால தொடர்புகள் — தட்டுங்கள்",
    primary_ice:         "முதன்மை ICE தொடர்பு",
    backup_ice:          "பேக்கப் தொடர்பு",
    hospital_title:      "அருகிலுள்ள அவசர மருத்துவமனை",
    hospital_sub:        "டிரோமா செண்டர் · ICU · ரத்த வங்கி",
    blood_bank_title:    "🩸 ரத்த வங்கி கிடைக்கும் தன்மை",
    sos_dispatched:      "SOS எச்சரிக்கை அனுப்பப்பட்டது",
    sos_resend:          "WhatsApp-ல் SOS மீண்டும் அனுப்பு",
    loading:             "மருத்துவ சுயவிவரம் பெறப்படுகிறது...",
    patient_needs:       "நோயாளிக்கு தேவை",
    verified:            "✅ சஞ்சீவனி சரிபார்க்கப்பட்டது",
    map_title:           "📍 சம்பவ இடம்",
    map_open:            "Google Maps-ல் திற",
    profile_updated:     "சுயவிவரம் கடைசியாக புதுப்பிக்கப்பட்டது:",
    allergic_prefix:     "⚠ ஒவ்வாமை:",
    powered_by:          "மூலம் இயக்கப்படுகிறது",
    live:                "நேரடி",
    call:                "📞 அழைக்கவும்",
  },
  ur: {
    emergency_banner:    "طبی ایمرجنسی — اسکین تصدیق شدہ",
    blood_type_label:    "🩸 خون کی قسم",
    organ_donor:         "💚 رجسٹرڈ عضو عطیہ دہندہ",
    allergy_title:       "⚠ شدید الرجی — یہ دوائیں نہ دیں",
    condition_title:     "🏥 معلوم طبی حالات",
    ice_title:           "📞 ایمرجنسی رابطے — ٹیپ کریں",
    primary_ice:         "بنیادی ICE رابطہ",
    backup_ice:          "بیک اپ رابطہ",
    hospital_title:      "قریب ترین ایمرجنسی ہسپتال تلاش کریں",
    hospital_sub:        "ٹراما سینٹر · ICU · بلڈ بینک",
    blood_bank_title:    "🩸 بلڈ بینک دستیابی",
    sos_dispatched:      "SOS الرٹ بھیج دیا گیا",
    sos_resend:          "WhatsApp پر SOS دوبارہ بھیجیں",
    loading:             "طبی پروفائل حاصل ہو رہا ہے...",
    patient_needs:       "مریض کو ضرورت ہے",
    verified:            "✅ سنجیونی تصدیق شدہ",
    map_title:           "📍 واقعہ کی جگہ",
    map_open:            "Google Maps میں کھولیں",
    profile_updated:     "پروفائل آخری بار اپڈیٹ:",
    allergic_prefix:     "⚠ الرجی:",
    powered_by:          "طرف سے چلایا گیا",
    live:                "براہ راست",
    call:                "📞 کال کریں",
  },
  gu: {
    emergency_banner:    "તબીબી કટોકટી — સ્કેન ચકાસાયેલ",
    blood_type_label:    "🩸 રક્ત જૂથ",
    organ_donor:         "💚 નોંધાયેલ અંગ દાતા",
    allergy_title:       "⚠ ગंभीर એલર્જી — આ ન આપો",
    condition_title:     "🏥 જ્ઞાત તબીબી પરિસ્થితિઓ",
    ice_title:           "📞 ઇમર્જન્સી સંપર્ક — ટૅપ કરો",
    primary_ice:         "પ્રાથમિક ICE સંપર્ક",
    backup_ice:          "બેકઅપ સંપર્ક",
    hospital_title:      "નજીકની ઇમર્જન્સી હોસ્પિટલ શોધો",
    hospital_sub:        "ટ્રોમા સેન્ટર · ICU · બ્લડ બેન્ક",
    blood_bank_title:    "🩸 બ્લડ બેન્ક ઉપલબ્ધતા",
    sos_dispatched:      "SOS ચેતવણી મોકલાઈ",
    sos_resend:          "WhatsApp પર SOS ફરી મોકલો",
    loading:             "તબીબી પ્રોફાઇલ મેળવાઈ રહ્યો છે...",
    patient_needs:       "દર્દીને જોઈએ",
    verified:            "✅ સંજીવની ચકાસાયેલ",
    map_title:           "📍 ઘટনાસ્થળ",
    map_open:            "Google Maps માં ખોલો",
    profile_updated:     "પ્રોફાઇલ છેલ્લે અપડેટ:",
    allergic_prefix:     "⚠ એલર્જી:",
    powered_by:          "દ્વારા સંચાલિત",
    live:                "લાઇવ",
    call:                "📞 કૉલ કરો",
  },
  kn: {
    emergency_banner:    "ವೈದ್ಯಕೀಯ ತುರ್ತು ಪರಿಸ್ಥಿತಿ — ಸ್ಕ್ಯಾನ್ ಪರಿಶೀಲನೆ",
    blood_type_label:    "🩸 ರಕ್ತ ಗುಂಪು",
    organ_donor:         "💚 ನೋಂದಾಯಿತ ಅವಯವ ದಾನಿ",
    allergy_title:       "⚠ ತೀವ್ರ ಅಲರ್ಜಿಗಳು — ಇವು ಕೊಡಬೇಡಿ",
    condition_title:     "🏥 ತಿಳಿದಿರುವ ವೈದ್ಯಕೀಯ ಸ್ಥಿತಿಗಳು",
    ice_title:           "📞 ತುರ್ತು ಸಂಪರ್ಕಗಳು — ಟ್ಯಾಪ್ ಮಾಡಿ",
    primary_ice:         "ಪ್ರಾಥಮಿಕ ICE ಸಂಪರ್ಕ",
    backup_ice:          "ಬ್ಯಾಕಪ್ ಸಂಪರ್ಕ",
    hospital_title:      "ಹತ್ತಿರದ ತುರ್ತು ಆಸ್ಪತ್ರೆ ಹುಡುಕಿ",
    hospital_sub:        "ಟ್ರಾಮಾ ಕೇಂದ್ರ · ICU · ರಕ್ತ ಬ್ಯಾಂಕ್",
    blood_bank_title:    "🩸 ರಕ್ತ ಬ್ಯಾಂಕ್ ಲಭ್ಯತೆ",
    sos_dispatched:      "SOS ಎಚ್ಚರಿಕೆ ಕಳುಹಿಸಲಾಗಿದೆ",
    sos_resend:          "WhatsApp ನಲ್ಲಿ SOS ಮತ್ತೆ ಕಳುಹಿಸಿ",
    loading:             "ವೈದ್ಯಕೀಯ ಪ್ರೊಫೈಲ್ ಪಡೆಯಲಾಗುತ್ತಿದೆ...",
    patient_needs:       "ರೋಗಿಗೆ ಬೇಕಾಗಿದೆ",
    verified:            "✅ ಸಂಜೀವನಿ ಪರಿಶೀಲನೆ",
    map_title:           "📍 ಘಟನಾ ಸ್ಥಳ",
    map_open:            "Google Maps ನಲ್ಲಿ ತೆರೆಯಿರಿ",
    profile_updated:     "ಪ್ರೊಫೈಲ್ ಕೊನೆಯ ಬಾರಿ ನವೀಕರಿಸಲಾಯಿತು:",
    allergic_prefix:     "⚠ ಅಲರ್ಜಿ:",
    powered_by:          "ಮೂಲಕ ನಡೆಸಲ್ಪಡುತ್ತದೆ",
    live:                "ನೇರ",
    call:                "📞 ಕರೆ ಮಾಡಿ",
  },
  ml: {
    emergency_banner:    "മെഡിക്കൽ അടിയന്തിരാവസ്ഥ — സ്കാൻ സ്ഥിരീകരിച്ചു",
    blood_type_label:    "🩸 രക്തഗ്രൂപ്പ്",
    organ_donor:         "💚 രജിസ്ടർ ചെയ്ത അവയവദാതാവ്",
    allergy_title:       "⚠ ഗുരുതരമായ അലർജി — ഇവ നൽകരുത്",
    condition_title:     "🏥 അറിയപ്പെടുന്ന വൈദ്യ അവസ്ഥകൾ",
    ice_title:           "📞 അടിയന്തര ബന്ധപ്പെടൽ — ടാപ്പ് ചെയ്യുക",
    primary_ice:         "പ്രാഥമിക ICE ബന്ധം",
    backup_ice:          "ബാക്കപ്പ് ബന്ധം",
    hospital_title:      "അടുത്തുള്ള അടിയന്തര ആശുപത്രി",
    hospital_sub:        "ട്രോമ സെന്റർ · ICU · ബ്ലഡ് ബാങ്ക്",
    blood_bank_title:    "🩸 ബ്ലഡ് ബാങ്ക് ലഭ്യത",
    sos_dispatched:      "SOS അലർട്ട് അയച്ചു",
    sos_resend:          "WhatsApp-ൽ SOS വീണ്ടും അയക്കുക",
    loading:             "മെഡിക്കൽ പ്രൊഫൈൽ ലഭ്യമാക്കുന്നു...",
    patient_needs:       "രോഗിക്ക് ആവശ്യം",
    verified:            "✅ സഞ്ജീവനി സ്ഥിരീകരിച്ചു",
    map_title:           "📍 സംഭവ സ്ഥലം",
    map_open:            "Google Maps-ൽ തുറക്കുക",
    profile_updated:     "പ്രൊഫൈൽ അവസാനം അപ്ഡേറ്റ് ചെയ്തത്:",
    allergic_prefix:     "⚠ അലർജി:",
    powered_by:          "പ്രദർശിപ്പിക്കുന്നത്",
    live:                "തത്സമയം",
    call:                "📞 വിളിക്കൂ",
  },
  pa: {
    emergency_banner:    "ਡਾਕਟਰੀ ਐਮਰਜੈਂਸੀ — ਸਕੈਨ ਤਸਦੀਕ ਕੀਤੀ",
    blood_type_label:    "🩸 ਖੂਨ ਦਾ ਗਰੁੱਪ",
    organ_donor:         "💚 ਰਜਿਸਟਰਡ ਅੰਗ ਦਾਨੀ",
    allergy_title:       "⚠ ਗੰਭੀਰ ਐਲਰਜੀ — ਇਹ ਨਾ ਦਿਓ",
    condition_title:     "🏥 ਜਾਣੀ ਡਾਕਟਰੀ ਸਥਿਤੀਆਂ",
    ice_title:           "📞 ਐਮਰਜੈਂਸੀ ਸੰਪਰਕ — ਟੈਪ ਕਰੋ",
    primary_ice:         "ਮੁੱਖ ICE ਸੰਪਰਕ",
    backup_ice:          "ਬੈਕਅੱਪ ਸੰਪਰਕ",
    hospital_title:      "ਨਜ਼ਦੀਕੀ ਐਮਰਜੈਂਸੀ ਹਸਪਤਾਲ ਲੱਭੋ",
    hospital_sub:        "ਟ੍ਰਾਮਾ ਸੈਂਟਰ · ICU · ਖੂਨ ਬੈਂਕ",
    blood_bank_title:    "🩸 ਖੂਨ ਬੈਂਕ ਦੀ ਉਪਲਬਧਤਾ",
    sos_dispatched:      "SOS ਚੇਤਾਵਨੀ ਭੇਜੀ ਗਈ",
    sos_resend:          "WhatsApp 'ਤੇ SOS ਦੁਬਾਰਾ ਭੇਜੋ",
    loading:             "ਡਾਕਟਰੀ ਪ੍ਰੋਫਾਈਲ ਮਿਲ ਰਿਹਾ ਹੈ...",
    patient_needs:       "ਮਰੀਜ਼ ਨੂੰ ਲੋੜ",
    verified:            "✅ ਸੰਜੀਵਨੀ ਤਸਦੀਕ",
    map_title:           "📍 ਘਟਨਾ ਸਥਾਨ",
    map_open:            "Google Maps ਵਿੱਚ ਖੋਲ੍ਹੋ",
    profile_updated:     "ਪ੍ਰੋਫਾਈਲ ਆਖਰੀ ਵਾਰ ਅੱਪਡੇਟ:",
    allergic_prefix:     "⚠ ਐਲਰਜੀ:",
    powered_by:          "ਦੁਆਰਾ ਸੰਚਾਲਿਤ",
    live:                "ਲਾਈਵ",
    call:                "📞 ਕਾਲ ਕਰੋ",
  },
  or: {
    emergency_banner:    "ଚିକିତ୍ସା ଜରୁରୀ — ସ୍କ୍ୟାନ ଯାଞ୍ଚ ହୋଇଛି",
    blood_type_label:    "🩸 ରକ୍ତ ଗ୍ରୁପ",
    organ_donor:         "💚 ନଥିଭୁକ୍ତ ଅଙ୍ଗ ଦାତା",
    allergy_title:       "⚠ ଗୁରୁତ୍ୱପୂର୍ଣ୍ଣ ଆଲର୍ଜି — ଦେବେ ନାହିଁ",
    condition_title:     "🏥 ଜ୍ଞାତ ଚିକିତ୍ସା ଅବସ୍ଥା",
    ice_title:           "📞 ଜରୁରୀ ଯୋଗାଯୋଗ — ଟ୍ୟାପ୍ କରନ୍ତୁ",
    primary_ice:         "ପ୍ରାଥମିକ ICE ଯୋଗାଯୋଗ",
    backup_ice:          "ବ୍ୟାକଅପ ଯୋଗାଯୋଗ",
    hospital_title:      "ନିକଟ ଜରୁରୀ ଡାଏ ଖୋଜନ୍ତୁ",
    hospital_sub:        "ଟ୍ରୋମା ସେଣ୍ଟର · ICU · ରକ୍ତ ବ୍ୟାଙ୍କ",
    blood_bank_title:    "🩸 ରକ୍ତ ବ୍ୟାଙ୍କ ଉପଲବ୍ଧତା",
    sos_dispatched:      "SOS ସତର୍କ ପ୍ରେରଣ ହୋଇଛି",
    sos_resend:          "WhatsApp ରେ SOS ପୁନଃ ପଠାନ୍ତୁ",
    loading:             "ଚିକିତ୍ସା ପ୍ରୋଫାଇଲ ଆଣୁଛୁ...",
    patient_needs:       "ରୋଗୀ ଆବଶ୍ୟକ",
    verified:            "✅ ସଞ୍ଜୀବନୀ ଯାଞ୍ଚ ହୋଇଛି",
    map_title:           "📍 ଘଟଣା ସ୍ଥାନ",
    map_open:            "Google Maps ରେ ଖୋଲନ୍ତୁ",
    profile_updated:     "ପ୍ରୋଫାଇଲ ଶେଷ ଅପଡେଟ:",
    allergic_prefix:     "⚠ ଆଲର୍ଜି:",
    powered_by:          "ଦ୍ୱାରା ପରିଚାଳିତ",
    live:                "ଲାଇଭ",
    call:                "📞 ଫୋନ କରନ୍ତୁ",
  },
  as: {
    emergency_banner:    "চিকিৎসা জৰুৰীকালীন — স্কেন সঠিক",
    blood_type_label:    "🩸 তেজৰ গ্ৰুপ",
    organ_donor:         "💚 পঞ্জীভুক্ত অংগদাতা",
    allergy_title:       "⚠ গুৰুতৰ এলাৰ্জি — এইবোৰ নিদিব",
    condition_title:     "🏥 জ্ঞাত চিকিৎসা অৱস্থা",
    ice_title:           "📞 জৰুৰীকালীন যোগাযোগ — টেপ কৰক",
    primary_ice:         "প্ৰাথমিক ICE যোগাযোগ",
    backup_ice:          "বেকআপ যোগাযোগ",
    hospital_title:      "ওচৰৰ জৰুৰী চিকিৎসালয়",
    hospital_sub:        "ট্ৰমা চেণ্টাৰ · ICU · তেজ বেংক",
    blood_bank_title:    "🩸 তেজ বেংকৰ উপলব্ধতা",
    sos_dispatched:      "SOS সতৰ্কবাৰ্তা প্ৰেৰণ হৈছে",
    sos_resend:          "WhatsApp-ত SOS পুনৰ পঠাওক",
    loading:             "চিকিৎসা প্ৰ'ফাইল আনা হৈছে...",
    patient_needs:       "ৰোগীৰ প্ৰয়োজন",
    verified:            "✅ সঞ্জীৱনী নিশ্চিত",
    map_title:           "📍 ঘটনাৰ স্থান",
    map_open:            "Google Maps-ত খোলক",
    profile_updated:     "প্ৰ'ফাইল শেষত আপডেট:",
    allergic_prefix:     "⚠ এলাৰ্জি:",
    powered_by:          "দ্বাৰা পৰিচালিত",
    live:                "লাইভ",
    call:                "📞 কল কৰক",
  },
  // Remaining languages use English as graceful fallback
  mai:  null, sat: null, ks: null, ne: null, sd: null,
  kok:  null, doi: null, mni: null, brx: null, sa: null,
};

// For languages without translation yet, fall back to Hindi (closest)
const FALLBACK_MAP = { mai: "hi", sat: "en", ks: "ur", ne: "hi", sd: "ur", kok: "mr", doi: "hi", mni: "bn", brx: "en", sa: "hi" };

// ---- i18n API -------------------------------------------

let currentLang = localStorage.getItem("ssw_lang") || "en";

function t(key) {
  const lang = currentLang;
  const dict = TRANSLATIONS[lang] || TRANSLATIONS[FALLBACK_MAP[lang]] || TRANSLATIONS["en"];
  return (dict && dict[key]) ? dict[key] : (TRANSLATIONS["en"][key] || key);
}

function setLanguage(code) {
  currentLang = code;
  localStorage.setItem("ssw_lang", code);

  const lang = LANGUAGES.find(l => l.code === code);
  document.documentElement.lang = code;
  document.documentElement.dir  = lang?.rtl ? "rtl" : "ltr";

  applyTranslations();
}

function applyTranslations() {
  document.querySelectorAll("[data-i18n]").forEach(el => {
    const key = el.getAttribute("data-i18n");
    el.textContent = t(key);
  });
  document.querySelectorAll("[data-i18n-placeholder]").forEach(el => {
    el.placeholder = t(el.getAttribute("data-i18n-placeholder"));
  });
}

function buildLanguagePicker(containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;

  const select = document.createElement("select");
  select.className = "lang-picker";
  select.id = "lang-select-" + containerId;
  select.setAttribute("aria-label", "Select Language");

  LANGUAGES.forEach(lang => {
    const opt = document.createElement("option");
    opt.value = lang.code;
    opt.textContent = lang.native;
    opt.selected = lang.code === currentLang;
    select.appendChild(opt);
  });

  select.addEventListener("change", e => setLanguage(e.target.value));
  container.appendChild(select);
}

// Apply language on page load
document.addEventListener("DOMContentLoaded", () => {
  applyTranslations();
  const lang = LANGUAGES.find(l => l.code === currentLang);
  if (lang?.rtl) { document.documentElement.dir = "rtl"; }
});
