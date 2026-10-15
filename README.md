# منصة التعلم الاحترافية (EduPlatform)

منصة تعليمية متكاملة مبنية بـ Next.js و TypeScript و Tailwind CSS و Supabase.

## المميزات

- تسجيل الدخول والخروج الآمن عبر Supabase Auth
- لوحة تحكم شخصية
- إنشاء وإدارة الدورات والوحدات والدروس
- مشغل دروس مع حفظ موضع الفيديو والتقدم
- اختبارات تفاعلية (هيكل جاهز)
- مكتبة شخصية للملاحظات والملفات
- بحث وتصنيف
- نظام تعليقات تحت كل دورة
- إعدادات الحساب والمظهر
- واجهة إدارة المحتوى
- تصميم RTL عربي كامل مع دعم الوضع الداكن/الفاتح
- سياسات Row Level Security كاملة

## التقنيات

- Next.js 16 (App Router)
- TypeScript
- Tailwind CSS v4
- Supabase (Auth + PostgreSQL + Storage)
- next-themes
- Lucide Icons

## التثبيت والتشغيل

1. **إنشاء مشروع Supabase**
   - اذهب إلى [supabase.com](https://supabase.com) وأنشئ مشروعاً جديداً
   - انسخ `Project URL` و `anon key` من Settings > API

2. **إعداد قاعدة البيانات**
   - افتح SQL Editor في Supabase
   - انسخ محتوى ملف `supabase/schema.sql` وقم بتشغيله

3. **متغيرات البيئة**
   ```bash
   cp .env.example .env.local
   ```
   ثم املأ القيم

4. **تثبيت الحزم**
   ```bash
   npm install --legacy-peer-deps
   npm run dev
   ```

5. **النشر على Vercel**
   - اربط المستودع بـ Vercel
   - أضف متغيرات البيئة
   - انشر
