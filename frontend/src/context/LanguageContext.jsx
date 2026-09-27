import React, { createContext, useContext, useState, useEffect } from 'react';

const LanguageContext = createContext();

export const TRANSLATIONS = {
  en: {
    welcomeTitle: "Welcome to L&T MIVA AI",
    welcomeSubtitle: "Your intelligent shop-floor knowledge partner.",
    getStarted: "Get Started",
    signIn: "Sign In",
    adminLogin: "Admin Login",
    createAccount: "Create your account",
    fullName: "Full Name",
    email: "Email Address",
    password: "Password",
    confirmPassword: "Confirm Password",
    createAccountBtn: "Create Account",
    accountCreated: "Account created successfully.",
    welcomeBack: "Welcome back",
    rememberMe: "Remember session",
    setupProfile: "Set up your profile",
    profilePhoto: "Profile Photo",
    employeeId: "Employee ID",
    role: "Role",
    department: "Department",
    continue: "Continue to MIVA AI",
    newChat: "New Chat",
    library: "Library",
    lines: "Lines",
    aboutMiva: "About MIVA AI",
    settings: "Settings",
    mobileShowcase: "Device Showcase",
    productionLines: "Production Lines",
    logout: "Log Out",
    greeting: "Hello",
    howCanIHelp: "How can I help you today?",
    heroSubtitle: "Ask about machines, procedures, maintenance, safety and shop-floor operations.",
    heroTitlePremium: "Your intelligent shop-floor partner.",
    operationalContext: "Current Operational Context",
    operationalLine: "Valve Manufacturing",
    activeLines: "5 Active Lines",
    knowledgeSynced: "Knowledge Synced",
    knowledgeAssist: "Knowledge Assist",
    knowledgeAssistSub: "Retrieve governed procedures, SOPs and maintenance knowledge.",
    visionAssist: "Vision Assist",
    visionAssistSub: "Analyze equipment images and surface relevant procedures.",
    startAssistant: "Open Assistant",
    analyzeImage: "Analyze Image",
    askQuestion: "Ask a Question",
    askQuestionSub: "Get precise answers from SOPs and manuals",
    uploadImage: "Upload Image",
    uploadImageSub: "Identify and get procedures from images",
    machineProcedure: "Machine procedure",
    maintenance: "Maintenance",
    safety: "Safety",
    inputPlaceholder: "Ask MIVA anything about your shop floor...",
    send: "Send",
    operator: "Operator",
    technician: "Technician",
    engineer: "Engineer",
    supervisor: "Supervisor",
    other: "Other",
    draftBadge: "DRAFT (Pending Approval)",
    camera: "Camera / Upload",
    close: "Close"
  },
  ta: {
    welcomeTitle: "L&T MIVA AI-க்கு வரவேற்கிறோம்",
    welcomeSubtitle: "உங்கள் அறிவார்ந்த பணிமனை அறிவு கூட்டாளி.",
    getStarted: "தொடங்குங்கள்",
    signIn: "உள்நுழைய",
    adminLogin: "நிர்வாகி உள்நுழைவு",
    createAccount: "உங்கள் கணக்கை உருவாக்கவும்",
    fullName: "முழு பெயர்",
    email: "மின்னஞ்சல் முகவரி",
    password: "கடவுச்சொல்",
    confirmPassword: "கடவுச்சொல்லை உறுதிப்படுத்தவும்",
    createAccountBtn: "கணக்கை உருவாக்கு",
    accountCreated: "கணக்கு வெற்றிகரமாக உருவாக்கப்பட்டது.",
    welcomeBack: "மீண்டும் வருக",
    rememberMe: "நினைவில் கொள்க",
    setupProfile: "உங்கள் சுயவிவரத்தை அமைக்கவும்",
    profilePhoto: "சுயவிவரப் படம்",
    employeeId: "பணியாளர் எண்",
    role: "பணி நிலை",
    department: "பிரிவு",
    continue: "MIVA AI-க்கு தொடரவும்",
    newChat: "புதிய உரையாடல்",
    library: "நூலகம்",
    lines: "உற்பத்தி பிரிவுகள்",
    aboutMiva: "MIVA AI பற்றி",
    settings: "அமைப்புகள்",
    mobileShowcase: "மொபைல் காட்சி",
    productionLines: "உற்பத்தி பிரிவுகள்",
    logout: "வெளியேறு",
    greeting: "வணக்கம்",
    howCanIHelp: "இன்று நான் உங்களுக்கு எவ்வாறு உதவ முடியும்?",
    heroSubtitle: "இயந்திரங்கள், நடைமுறைகள், பராமரிப்பு, பாதுகாப்பு மற்றும் பணிமனை செயல்பாடுகள் பற்றி கேளுங்கள்.",
    heroTitlePremium: "உங்கள் அறிவார்ந்த பணிமனை கூட்டாளர்.",
    operationalContext: "தற்போதைய செயல்பாட்டு சூழல்",
    operationalLine: "Valve Manufacturing",
    activeLines: "5 செயல்படும் பிரிவுகள்",
    knowledgeSynced: "அறிவு ஒத்திசைக்கப்பட்டது",
    knowledgeAssist: "Knowledge Assist",
    knowledgeAssistSub: "அங்கீகரிக்கப்பட்ட நடைமுறைகள், SOP மற்றும் பராமரிப்பு அறிவைப் பெறுங்கள்.",
    visionAssist: "Vision Assist",
    visionAssistSub: "உபகரணப் படங்களை ஆய்வு செய்து தொடர்புடைய நடைமுறைகளைப் பெறுங்கள்.",
    startAssistant: "Assistant திறக்கவும்",
    analyzeImage: "படத்தை ஆய்வு செய்க",
    askQuestion: "கேள்வி கேளுங்கள்",
    askQuestionSub: "SOP-கள் மற்றும் கையேடுகளிலிருந்து துல்லியமான பதில்களைப் பெறுங்கள்",
    uploadImage: "படத்தை பதிவேற்றவும்",
    uploadImageSub: "படங்களிலிருந்து பாகங்களை அடையாளம் கண்டு நடைமுறைகளைப் பெறுங்கள்",
    machineProcedure: "இயந்திர நடைமுறை",
    maintenance: "பராமரிப்பு",
    safety: "பாதுகாப்பு",
    inputPlaceholder: "உங்கள் பணிமனை பற்றி MIVA-விடம் எதையும் கேளுங்கள்...",
    send: "அனுப்பு",
    operator: "இயக்குநர் (Operator)",
    technician: "தொழில்நுட்ப வல்லுநர் (Technician)",
    engineer: "பொறியாளர் (Engineer)",
    supervisor: "மேற்பார்வையாளர் (Supervisor)",
    other: "மற்றவை",
    draftBadge: "வரைவு (DRAFT - ஒப்புதல் தேவை)",
    camera: "கேமரா / படம்",
    close: "மூடு"
  }
};

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(() => {
    return localStorage.getItem('miva_language') || 'en';
  });

  useEffect(() => {
    localStorage.setItem('miva_language', language);
  }, [language]);

  const toggleLanguage = (lang) => {
    setLanguage(lang);
  };

  const t = (key) => {
    return TRANSLATIONS[language]?.[key] || TRANSLATIONS.en[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
