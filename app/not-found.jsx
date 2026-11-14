import Link from 'next/link';

export const metadata = { title: 'ไม่พบหน้านี้' };

export default function NotFound() {
  return (
    <div className="ar-not-found">
      <h1>ไม่พบหน้านี้</h1>
      <p>ลิงก์อาจพิมพ์ผิด หรือหน้านี้ถูกย้ายไปแล้ว</p>
      <Link href="/">กลับหน้าแรก</Link>
    </div>
  );
}
