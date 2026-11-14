/** The languages the docs are written in; the first is the fallback. */
export const LANGS = ['th', 'en'];

/** Interface words per language. Page content lives in content/<lang>/. */
export const DICT = {
  th: {
    siteTitle: 'AR Team Docs',
    section: 'Docs',
    description: 'เอกสารและคู่มือการใช้งานโปรเจกต์ของ AR Team',
    searchPlaceholder: 'ค้นหาในคู่มือ…',
    searchEmpty: 'ไม่พบหน้าที่ตรงกับคำค้น',
    searchError: 'โหลดตัวค้นหาไม่สำเร็จ',
    searchLoading: 'กำลังโหลด…',
    toc: 'ในหน้านี้',
    backToTop: 'กลับขึ้นด้านบน',
    themeDark: 'มืด',
    themeLight: 'สว่าง',
    themeSystem: 'ตามระบบ',
    lastUpdated: 'อัปเดตล่าสุดเมื่อ',
    copyLink: 'คัดลอกลิงก์หน้านี้',
    linkCopied: 'คัดลอกลิงก์แล้ว',
    switchTo: 'English',
    switchToShort: 'EN',
  },
  en: {
    siteTitle: 'AR Team Docs',
    section: 'Docs',
    description: "Documentation and guides for AR Team's projects",
    searchPlaceholder: 'Search docs…',
    searchEmpty: 'No pages match your search',
    searchError: 'Could not load search',
    searchLoading: 'Loading…',
    toc: 'On this page',
    backToTop: 'Back to top',
    themeDark: 'Dark',
    themeLight: 'Light',
    themeSystem: 'System',
    lastUpdated: 'Last updated',
    copyLink: 'Copy link to this page',
    linkCopied: 'Link copied',
    switchTo: 'ภาษาไทย',
    switchToShort: 'ไทย',
  },
};
