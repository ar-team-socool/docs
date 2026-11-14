import { Footer, LastUpdated, Layout, Navbar } from 'nextra-theme-docs';
import { Head, Search } from 'nextra/components';
import { getPageMap } from 'nextra/page-map';
import Image from 'next/image';
import { NavActions } from '../../components/nav-actions';
import { SidebarSearch } from '../../components/sidebar-search';
import logoBlack from '../../assets/logo-black.png';
import logoWhite from '../../assets/logo-white.png';
import { DICT, LANGS } from '../dictionaries';
import { fontClasses } from '../fonts';
import { SITE_URL } from '../site';
import 'nextra-theme-docs/style.css';
import '../globals.css';

export const dynamicParams = false;

export function generateStaticParams() {
  return LANGS.map((lang) => ({ lang }));
}

export async function generateMetadata({ params }) {
  const { lang } = await params;
  const t = DICT[lang];
  return {
    metadataBase: new URL(SITE_URL),
    title: { default: t.siteTitle, template: `%s – ${t.siteTitle}` },
    description: t.description,
  };
}

export default async function RootLayout({ children, params }) {
  const { lang } = await params;
  const t = DICT[lang];
  const other = LANGS.find((l) => l !== lang);

  const search = (
    <Search
      placeholder={t.searchPlaceholder}
      emptyResult={t.searchEmpty}
      errorText={t.searchError}
      loading={t.searchLoading}
    />
  );

  const navbar = (
    <Navbar
      align="left"
      logoLink={`/${lang}`}
      logo={
        <span className="ar-brand">
          <Image src={logoBlack} alt="AR Team" width={24} height={24} className="ar-logo-light" priority />
          <Image src={logoWhite} alt="AR Team" width={24} height={24} className="ar-logo-dark" priority />
          <svg className="ar-slash" width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
            <path d="M5 14.5 11 1.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
          </svg>
          <span className="ar-section">{t.section}</span>
        </span>
      }
    >
      <NavActions
        lang={lang}
        other={other}
        label={t.switchTo}
        shortLabel={t.switchToShort}
        download={t.download}
        downloadHref={t.downloadHref}
      />
      <SidebarSearch>{search}</SidebarSearch>
    </Navbar>
  );

  return (
    <html lang={lang} dir="ltr" suppressHydrationWarning className={fontClasses}>
      <Head
        color={{ hue: 0, saturation: 0, lightness: { light: 9, dark: 98 } }}
        backgroundColor={{ light: 'rgb(250,250,250)', dark: 'rgb(0,0,0)' }}
      />
      <body>
        <Layout
          navbar={navbar}
          footer={<Footer>© {new Date().getFullYear()} AR Team</Footer>}
          pageMap={await getPageMap(`/${lang}`)}
          search={search}
          docsRepositoryBase="https://github.com/ar-team-socool/docs"
          editLink={null}
          feedback={{ content: null }}
          copyPageButton={false}
          toc={{ title: t.toc, backToTop: t.backToTop }}
          themeSwitch={{ dark: t.themeDark, light: t.themeLight, system: t.themeSystem }}
          nextThemes={{ defaultTheme: 'dark' }}
          lastUpdated={<LastUpdated locale={lang}>{t.lastUpdated}</LastUpdated>}
          sidebar={{ defaultMenuCollapseLevel: 1 }}
        >
          {children}
        </Layout>
      </body>
    </html>
  );
}
