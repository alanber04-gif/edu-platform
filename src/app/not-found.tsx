import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <h1 className="text-4xl font-bold">404</h1>
      <p className="mt-2 text-muted-foreground">الصفحة غير موجودة</p>
      <Link href="/" className="mt-4 text-primary underline">
        العودة للرئيسية
      </Link>
    </div>
  );
}