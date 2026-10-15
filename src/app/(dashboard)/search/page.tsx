'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import Link from 'next/link';

export default function SearchPage() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const supabase = createClient();

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (!query.trim()) return;
    setLoading(true);
    const { data } = await supabase
      .from('courses')
      .select('*')
      .eq('is_published', true)
      .ilike('title', `%${query}%`);
    setResults(data || []);
    setLoading(false);
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
        {results.length === 0 && query && !loading && (
          <p className="text-muted-foreground">لا توجد نتائج</p>
        )}
      </div>
    </div>
  );
}