import { supabase } from '../lib/supabase';

export async function getLecturetteTopics() {
  const { data, error } = await supabase
    .from('lecturette_topics')
    .select('id, topic, active')
    .eq('active', true)
    .order('created_at');
  if (error) throw new Error(`Unable to load lecturette topics: ${error.message}`);
  return data || [];
}

export async function saveLecturetteAttempt({ topic, transcript, videoBlob, evaluation }) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('You must be signed in to save a lecturette.');
  const path = `${user.id}/${crypto.randomUUID()}.webm`;
  const { error: uploadError } = await supabase.storage
    .from('lecturette-videos')
    .upload(path, videoBlob, { contentType: videoBlob.type || 'video/webm', upsert: false });
  if (uploadError) throw new Error(`Could not save lecturette video: ${uploadError.message}`);
  const { error } = await supabase.from('lecturette_attempts').insert({
    user_id: user.id,
    topic,
    transcript,
    video_path: path,
    score: evaluation.score,
    verdict: evaluation.verdict,
    feedback: evaluation.feedback || ''
  });
  if (error) throw new Error(`Could not save lecturette history: ${error.message}`);
}

export async function getLecturetteAttempts() {
  const { data, error } = await supabase
    .from('lecturette_attempts')
    .select('id, topic, score, verdict, feedback, video_path, created_at')
    .order('created_at', { ascending: false })
    .limit(20);
  if (error) throw new Error(`Unable to load lecturette history: ${error.message}`);
  const attempts = await Promise.all((data || []).map(async (attempt) => {
    const { data: signed, error: signedError } = await supabase.storage
      .from('lecturette-videos')
      .createSignedUrl(attempt.video_path, 3600);
    return { ...attempt, videoUrl: signedError ? '' : signed.signedUrl };
  }));
  return attempts;
}
