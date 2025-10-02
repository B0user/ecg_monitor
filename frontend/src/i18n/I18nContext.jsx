import React, { createContext, useContext, useMemo, useState, useEffect } from 'react';

const I18nContext = createContext(null);

const DICT = {
  en: {
    'nav.title': 'ECG Outsourcing',
    'nav.dashboard': 'Dashboard',
    'nav.sender': 'Sender',
    'nav.reviewer': 'Reviewer',
    'nav.login': 'Login',
    'nav.register': 'Register',
    'nav.logout': 'Logout',

    'dashboard.title': 'Operations Dashboard',
    'dashboard.subtitle': 'Sample Data',
    'dashboard.cta.sender': 'Send ECG',
    'dashboard.cta.reviewer': 'Review ECGs',

    'sender.upload.title': 'Upload ECG (.pdf, .png, .jpg, .dcm)',
    'sender.myrequests': 'My Requests',
    'table.created': 'Created',
    'table.file': 'File',
    'table.status': 'Status',
    'table.type': 'Type',
    'table.description': 'Description',
    'table.nodata': 'No data',

    'reviewer.pending.title': 'Pending ECGs',
    'reviewer.describe': 'Describe',
    'reviewer.describe.dialog': 'Describe ECG',
    'reviewer.autogen': 'Auto-generate',
    'common.cancel': 'Cancel',
    'common.markDescribed': 'Mark Described',
  },
  ru: {
    'nav.title': 'Аутсорсинг ЭКГ',
    'nav.dashboard': 'Дашборд',
    'nav.sender': 'Отправитель',
    'nav.reviewer': 'Ревьюер',
    'nav.login': 'Вход',
    'nav.register': 'Регистрация',
    'nav.logout': 'Выход',

    'dashboard.title': 'Операционный дашборд',
    'dashboard.subtitle': 'Демонстрационные данные',
    'dashboard.cta.sender': 'Отправить ЭКГ',
    'dashboard.cta.reviewer': 'Проверить ЭКГ',

    'sender.upload.title': 'Загрузка ЭКГ (.pdf, .png, .jpg, .dcm)',
    'sender.myrequests': 'Мои заявки',
    'table.created': 'Создано',
    'table.file': 'Файл',
    'table.status': 'Статус',
    'table.type': 'Тип',
    'table.description': 'Описание',
    'table.nodata': 'Нет данных',

    'reviewer.pending.title': 'Ожидающие ЭКГ',
    'reviewer.describe': 'Описать',
    'reviewer.describe.dialog': 'Описание ЭКГ',
    'reviewer.autogen': 'Сгенерировать',
    'common.cancel': 'Отмена',
    'common.markDescribed': 'Отметить как описано',
  },
};

export function I18nProvider({ children }) {
  const [lang, setLang] = useState(() => localStorage.getItem('ecg_lang') || 'en');

  useEffect(() => {
    localStorage.setItem('ecg_lang', lang);
  }, [lang]);

  const t = (key) => (DICT[lang] && DICT[lang][key]) || DICT.en[key] || key;
  const toggle = () => setLang((l) => (l === 'en' ? 'ru' : 'en'));

  const value = useMemo(() => ({ lang, setLang, toggle, t }), [lang]);
  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  return useContext(I18nContext);
}
