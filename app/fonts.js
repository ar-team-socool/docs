import { Geist, Geist_Mono, Noto_Sans_Thai } from 'next/font/google';

const geist = Geist({ subsets: ['latin'], variable: '--font-geist' });
const geistMono = Geist_Mono({ subsets: ['latin'], variable: '--font-geist-mono' });
const notoThai = Noto_Sans_Thai({ subsets: ['thai'], variable: '--font-thai' });

/** The font variables every page's `<html>` carries; globals.css builds the stacks from them. */
export const fontClasses = `${geist.variable} ${geistMono.variable} ${notoThai.variable}`;
