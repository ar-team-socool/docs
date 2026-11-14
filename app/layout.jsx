import { Footer, LastUpdated, Layout, Navbar } from 'nextra-theme-docs';
import { Head, Search } from 'nextra/components';
import { getPageMap } from 'nextra/page-map';
import { Geist, Geist_Mono, Noto_Sans_Thai } from 'next/font/google';
import Image from 'next/image';
import logoBlack from '../assets/logo-black.png';
import logoWhite from '../assets/logo-white.png';
import 'nextra-theme-docs/style.css';
import './globals.css';

const geist = Geist({ subsets: ['latin'], variable: '--font-geist' });
const geistMono = Geist_Mono({ subsets: ['latin'], variable: '--font-geist-mono' });
const notoThai = Noto_Sans_Thai({ subsets: ['thai'], variable: '--font-thai' });

export const metadata = {
  title: { default: 'คู่มือ AR Team', template: '%s – คู่มือ AR Team' },
  description: 'คู่มือการใช้งานโปรแกรมของ AR Team สำหรับผู้เล่นทุกเซิร์ฟเวอร์',
};

const navbar = (
  <Navbar
    logo={
      <span className="ar-brand">
        <Image src={logoBlack} alt="" width={28} height={28} className="ar-logo-light" priority />
        <Image src={logoWhite} alt="" width={28} height={28} className="ar-logo-dark" priority />
        <span>คู่มือ AR Team</span>
      </span>
    }
  />
);

const footer = <Footer>© {new Date().getFullYear()} AR Team</Footer>;

export default async function RootLayout({ children }) {
  return (
    <html
      lang="th"
      dir="ltr"
      suppressHydrationWarning
      className={`${geist.variable} ${geistMono.variable} ${notoThai.variable}`}
    >
      <Head
        color={{ hue: 0, saturation: 0, lightness: { light: 9, dark: 98 } }}
        backgroundColor={{ light: 'rgb(250,250,250)', dark: 'rgb(0,0,0)' }}
      />
      <body>
        <Layout
          navbar={navbar}
          footer={footer}
          pageMap={await getPageMap()}
          search={
            <Search
              placeholder="ค้นหาในคู่มือ…"
              emptyResult="ไม่พบหน้าที่ตรงกับคำค้น"
              errorText="โหลดตัวค้นหาไม่สำเร็จ"
              loading="กำลังโหลด…"
            />
          }
          docsRepositoryBase="https://github.com/ar-team-socool/docs"
          editLink={null}
          feedback={{ content: null }}
          copyPageButton={false}
          toc={{ title: 'ในหน้านี้', backToTop: 'กลับขึ้นด้านบน' }}
          themeSwitch={{ dark: 'มืด', light: 'สว่าง', system: 'ตามระบบ' }}
          lastUpdated={<LastUpdated locale="th">อัปเดตล่าสุดเมื่อ</LastUpdated>}
          sidebar={{ defaultMenuCollapseLevel: 1 }}
        >
          {children}
        </Layout>
      </body>
    </html>
  );
}
