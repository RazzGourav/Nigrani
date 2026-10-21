import React, { createContext, useContext, useState, useEffect } from 'react';

type Language = 'en' | 'hi';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations: Record<Language, Record<string, string>> = {
  en: {
    // Shell & Navigation
    'brand.title': 'NIGRANI',
    'brand.subtitle': 'Approval Workflow & Compliance Monitoring',
    'brand.demo_tag': 'DEMONSTRATION PROTOTYPE • SYNTHETIC DATA',
    'nav.overview': 'Overview',
    'nav.applications': 'Applications',
    'nav.evc': 'EVC Scheduling',
    'nav.compliance': 'Compliance & Undertakings',
    'nav.documents': 'Documents & Renewals',
    'nav.obligations': 'Obligations',
    'nav.notifications': 'Notifications',
    'nav.reports': 'Reports',
    'nav.audit': 'Audit Trail',
    'nav.admin': 'Administration',
    'nav.rulebook': 'Rulebook Configuration',
    'nav.users': 'User Management',
    'nav.settings': 'Settings',
    'nav.help': 'Help & Guidelines',

    // Role switcher
    'role.switch_title': 'Active Role',
    'role.institution': 'Institution User',
    'role.regional_officer': 'Regional Officer',
    'role.bureau_officer': 'Bureau Officer',
    'role.committee_member': 'Committee Member',
    'role.senior_authority': 'Senior Authority',
    'role.admin': 'System Administrator',

    // Common labels
    'common.reset_demo': 'Reset Demo Data',
    'common.search_placeholder': 'Search by ID or institution name...',
    'common.filter': 'Filter',
    'common.clear_all': 'Clear All',
    'common.export_csv': 'Export CSV',
    'common.print': 'Print Report',
    'common.view': 'View',
    'common.actions': 'Actions',
    'common.status': 'Status',
    'common.deadline': 'Deadline',
    'common.owner': 'Owner',
    'common.region': 'Region',
    'common.stage': 'Current Stage',
    'common.days_in_stage': 'Days in Stage',
    'common.next_due': 'Next Due',
    'common.showing': 'Showing',
    'common.of': 'of',
    'common.results': 'results',
    'common.confirm': 'Confirm',
    'common.cancel': 'Cancel',
    'common.close': 'Close',

    // Statuses
    'status.in_progress': 'In Progress',
    'status.due_soon': 'Due Soon',
    'status.overdue': 'Overdue',
    'status.returned': 'Returned for Correction',
    'status.approved': 'Approved',
    'status.rejected': 'Rejected',
    'status.submitted': 'Submitted',
    'status.under_review': 'Under Review',
    'status.accepted': 'Accepted / Complied',
    'status.valid': 'Valid',
    'status.expired': 'Expired',
    'status.awaiting': 'Awaiting Verification',

    // Workflow actions
    'action.complete_scrutiny': 'Complete Scrutiny & Forward',
    'action.return_deficiency': 'Return for Deficiency',
    'action.propose_evc': 'Propose Visit Date',
    'action.confirm_evc': 'Confirm Schedule',
    'action.submit_evidence': 'Submit Evidence',
    'action.review_evidence': 'Verify Evidence',
    'action.record_observation': 'Record Observation',
    'action.create_app': '+ Create Demo Application',
  },
  hi: {
    // Shell & Navigation
    'brand.title': 'निगरानी (NIGRANI)',
    'brand.subtitle': 'अनुमोदन कार्यप्रवाह एवं अनुपालन निगरानी प्रणाली',
    'brand.demo_tag': 'प्रदर्शन प्रोटोटाइप • कृत्रिम डेटा',
    'nav.overview': 'अवलोकन (Overview)',
    'nav.applications': 'आवेदन (Applications)',
    'nav.evc': 'ईवीसी शेड्यूलिंग (EVC)',
    'nav.compliance': 'अनुपालन एवं वचनबद्धता',
    'nav.documents': 'दस्तावेज़ एवं नवीनीकरण',
    'nav.obligations': 'समेकित दायित्व (Obligations)',
    'nav.notifications': 'अधिसूचनाएं (Notifications)',
    'nav.reports': 'रिपोर्ट्स (Reports)',
    'nav.audit': 'ऑडिट ट्रेल (Audit)',
    'nav.admin': 'प्रशासन (Admin)',
    'nav.rulebook': 'नियम पुस्तिका विन्यास',
    'nav.users': 'उपयोगकर्ता प्रबंधन',
    'nav.settings': 'सेटिंग्स',
    'nav.help': 'सहायता एवं दिशानिर्देश',

    // Role switcher
    'role.switch_title': 'सक्रिय भूमिका',
    'role.institution': 'संस्थान उपयोगकर्ता (Institution)',
    'role.regional_officer': 'क्षेत्रीय अधिकारी (Regional Officer)',
    'role.bureau_officer': 'ब्यूरो अधिकारी (Bureau Officer)',
    'role.committee_member': 'समिति सदस्य (Committee Member)',
    'role.senior_authority': 'वरिष्ठ प्राधिकारी (Senior Authority)',
    'role.admin': 'प्रणाली प्रशासक (Administrator)',

    // Common labels
    'common.reset_demo': 'डेमो डेटा रीसेट करें',
    'common.search_placeholder': 'आईडी या संस्थान के नाम से खोजें...',
    'common.filter': 'फ़िल्टर',
    'common.clear_all': 'सभी हटाएं',
    'common.export_csv': 'सीएसवी निर्यात',
    'common.print': 'रिपोर्ट प्रिंट करें',
    'common.view': 'देखें',
    'common.actions': 'कार्रवाई',
    'common.status': 'स्थिति',
    'common.deadline': 'अंतिम तिथि',
    'common.owner': 'प्रभारी',
    'common.region': 'क्षेत्र',
    'common.stage': 'वर्तमान चरण',
    'common.days_in_stage': 'चरण में दिन',
    'common.next_due': 'अगली देय तिथि',
    'common.showing': 'दिखा रहे हैं',
    'common.of': 'कुल',
    'common.results': 'परिणाम',
    'common.confirm': 'पुष्टि करें',
    'common.cancel': 'रद्द करें',
    'common.close': 'बंद करें',

    // Statuses
    'status.in_progress': 'प्रगति पर है',
    'status.due_soon': 'शीघ्र देय',
    'status.overdue': 'समय सीमा पार (Overdue)',
    'status.returned': 'सुधार हेतु वापस (Returned)',
    'status.approved': 'स्वीकृत (Approved)',
    'status.rejected': 'अस्वीकृत (Rejected)',
    'status.submitted': 'जमा किया गया',
    'status.under_review': 'समीक्षाधीन',
    'status.accepted': 'स्वीकृत एवं अनुपालन पूर्ण',
    'status.valid': 'मान्य (Valid)',
    'status.expired': 'समय समाप्त (Expired)',
    'status.awaiting': 'सत्यापन प्रतीक्षित',

    // Workflow actions
    'action.complete_scrutiny': 'जांच पूर्ण कर आगे भेजें',
    'action.return_deficiency': 'कमी हेतु वापस लौटाएं',
    'action.propose_evc': 'दौरे की तिथि प्रस्तावित करें',
    'action.confirm_evc': 'शेड्यूल की पुष्टि करें',
    'action.submit_evidence': 'साक्ष्य प्रस्तुत करें',
    'action.review_evidence': 'साक्ष्य सत्यापित करें',
    'action.record_observation': 'टिप्पणी दर्ज करें',
    'action.create_app': '+ नया डेमो आवेदन बनाएं',
  },
};

const LanguageContext = createContext<LanguageContextType>({
  language: 'en',
  setLanguage: () => {},
  t: (key: string) => key,
});

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    return (localStorage.getItem('nigrani_lang') as Language) || 'en';
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('nigrani_lang', lang);
  };

  const t = (key: string): string => {
    return translations[language][key] || translations.en[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
