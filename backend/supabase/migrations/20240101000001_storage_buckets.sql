-- Create storage buckets for file uploads

-- Documents bucket (PDFs, DOCX, TXT, MD, etc.)
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'documents',
  'documents',
  false,
  52428800, -- 50MB
  array[
    'application/pdf',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/msword',
    'text/plain',
    'text/markdown',
    'text/csv',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  ]
);

-- Voice notes bucket (audio files)
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'voice-notes',
  'voice-notes',
  false,
  104857600, -- 100MB
  array[
    'audio/mpeg',
    'audio/mp3',
    'audio/wav',
    'audio/webm',
    'audio/ogg',
    'audio/m4a'
  ]
);

-- Avatars bucket (profile pictures)
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'avatars',
  'avatars',
  true,
  2097152, -- 2MB
  array[
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/webp',
    'image/gif'
  ]
);

-- Storage policies for documents bucket
create policy "Users can view their own documents"
  on storage.objects for select
  using (
    bucket_id = 'documents' and
    auth.uid()::text = (storage.foldername(name))[1]
  );

create policy "Users can upload their own documents"
  on storage.objects for insert
  with check (
    bucket_id = 'documents' and
    auth.uid()::text = (storage.foldername(name))[1]
  );

create policy "Users can update their own documents"
  on storage.objects for update
  using (
    bucket_id = 'documents' and
    auth.uid()::text = (storage.foldername(name))[1]
  );

create policy "Users can delete their own documents"
  on storage.objects for delete
  using (
    bucket_id = 'documents' and
    auth.uid()::text = (storage.foldername(name))[1]
  );

-- Storage policies for voice-notes bucket
create policy "Users can view their own voice notes"
  on storage.objects for select
  using (
    bucket_id = 'voice-notes' and
    auth.uid()::text = (storage.foldername(name))[1]
  );

create policy "Users can upload their own voice notes"
  on storage.objects for insert
  with check (
    bucket_id = 'voice-notes' and
    auth.uid()::text = (storage.foldername(name))[1]
  );

create policy "Users can delete their own voice notes"
  on storage.objects for delete
  using (
    bucket_id = 'voice-notes' and
    auth.uid()::text = (storage.foldername(name))[1]
  );

-- Storage policies for avatars bucket (public read, user write)
create policy "Anyone can view avatars"
  on storage.objects for select
  using (bucket_id = 'avatars');

create policy "Users can upload their own avatar"
  on storage.objects for insert
  with check (
    bucket_id = 'avatars' and
    auth.uid()::text = (storage.foldername(name))[1]
  );

create policy "Users can update their own avatar"
  on storage.objects for update
  using (
    bucket_id = 'avatars' and
    auth.uid()::text = (storage.foldername(name))[1]
  );

create policy "Users can delete their own avatar"
  on storage.objects for delete
  using (
    bucket_id = 'avatars' and
    auth.uid()::text = (storage.foldername(name))[1]
  );
