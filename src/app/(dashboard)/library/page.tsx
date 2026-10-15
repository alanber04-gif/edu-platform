'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';

export default function LibraryPage() {
  const [notes, setNotes] = useState<any[]>([]);
  const [files, setFiles] = useState<any[]>([]);
  const supabase = createClient();

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: notesData } = await supabase
        .from('notes')
        .select('*, lessons(title)')
        .eq('user_id', user.id)
        .order('updated_at', { ascending: false });
      setNotes(notesData || []);

      const { data: filesData } = await supabase
        .from('user_files')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      setFiles(filesData || []);
    }
    load();
  }, []);

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">مكتبتي الشخصية</h1>

      <div>
        <h2 className="text-xl font-semibold mb-4">الملاحظات</h2>
        <div className="space-y-3">
          {notes.map((note) => (
            <div key={note.id} className="bg-card p-4 rounded-xl border">
              <p className="text-sm text-muted-foreground mb-1">
                {note.lessons?.title}
              </p>
              <p>{note.content}</p>
            </div>
          ))}
          {notes.length === 0 && <p className="text-muted-foreground">لا توجد ملاحظات</p>}
        </div>
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-4">الملفات</h2>
        <div className="space-y-3">
          {files.map((file) => (
            <div key={file.id} className="bg-card p-4 rounded-xl border flex justify-between">
              <span>{file.name}</span>
              <a href={file.file_url} target="_blank" className="text-primary text-sm">
                تحميل
              </a>
            </div>
          ))}
          {files.length === 0 && <p className="text-muted-foreground">لا توجد ملفات</p>}
        </div>
      </div>
    </div>
  );
}