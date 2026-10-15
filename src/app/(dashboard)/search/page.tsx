'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import Link from 'next/link';

export default function SearchPage() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [error, setError] = useState('');
  const supabase = createClient();

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (!query.trim()) return;
    setLoading(true);
    setError('');
    setSearched(true);
    try {
      const { data, error: searchError } = await supabase
        .from('courses')
        .select('id, title, description, category, level')
        .eq('is_published', true)
        .ilike('title', `%${query.trim()}%`)
        .order('created_at', { ascending: false });
      if (searchError) {
        setError('تعذر إكمال البحث. تحقق من الاتصال وحاول مجددًا.');
        setResults([]);
      } else {
        setResults(data || []);
      }
    } catch {
      setError('حدث خطأ أثناء البحث. حاول مرة أخرى.');
      setResults([]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">البحث</h1>
      <form onSubmit={handleSearch} className="flex gap-2">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="ابحث عن دورة..."
          className="flex-1 px-3 py-2 border rounded-md bg-background"
        />
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 bg-primary text-primary-foreground rounded-md"
        >
          {loading ? '...' : 'بحث'}
        </button>
      </form>

      {error && <p role="alert" className="rounded-xl border border-destructive/30 p-4 text-sm text-destructive">{error}</p>}
      <div className="space-y-3">
        {results.map((course) => (
          <Link
            key={course.id}
            href={`/courses/${course.id}`}
            className="block bg-card p-4 rounded-xl border hover:bg-accent"
          >
            <h3 className="font-medium">{course.title}</h3>
            <p className="text-sm text-muted-foreground">{course.description}</p>
          </Link>
        ))}
        {results.length === 0 && searched && !loading && !error && (
          <p className="rounded-xl border border-dashed p-6 text-center text-muted-foreground">لا توجد دورات تطابق بحثك. جرّب كلمات أخرى.</p>
        )}
        {!searched && <p className="text-sm text-muted-foreground">اكتب اسم الدورة واضغط «بحث» لعرض النتائج من المنصة.</p>}
      </div>
    </div>
  );
}