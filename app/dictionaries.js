/** The languages the docs are written in; the first is the fallback. */
export const LANGS = ['th', 'en'];

/** Interface words per language. Page content lives in content/<lang>/. */
export const DICT = {
  th: {
    siteTitle: 'AR Team Docs',
    section: 'Docs',
    description: 'คู่มือการใช้งานโปรแกรมของ AR Team สำหรับผู้เล่นทุกเซิร์ฟเวอร์',
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
    download: 'ดาวน์โหลด',
    downloadHref: 'https://ar-launcher.wip-town.com/?lang=th',
    switchTo: 'English',
    switchToShort: 'EN',
  },
  en: {
    siteTitle: 'AR Team Docs',
    section: 'Docs',
    description: "Guides to AR Team's programs for players on every server",
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
    download: 'Download',
    downloadHref: 'https://ar-launcher.wip-town.com/?lang=en',
    switchTo: 'ภาษาไทย',
    switchToShort: 'ไทย',
  },
};
