import { supabase } from './supabase';

export async function saveEvaluation({ testType, score, result, summary = '' }) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('You must be signed in to save an evaluation.');
  const numericScore = Number(score);
  const { error } = await supabase.from('evaluation_history').insert({
    user_id: user.id,
    test_type: testType,
    score: Number.isFinite(numericScore) ? numericScore : null,
    result: result || '',
    summary
  });
  if (error) throw new Error(`Could not save evaluation history: ${error.message}`);
  window.dispatchEvent(new CustomEvent('ssb-evaluation-saved'));
}

export async function getEvaluationHistory() {
  const { data, error } = await supabase
    .from('evaluation_history')
    .select('id, test_type, score, result, summary, created_at')
    .order('created_at', { ascending: false })
    .limit(100);
  if (error) throw new Error(`Could not load evaluation history: ${error.message}`);
  return (data || []).map((entry) => ({ ...entry, testType: entry.test_type, createdAt: entry.created_at }));
}

