// Shared TZ utilities — used by server/app.js and scripts/ai-worker.js

export const TZ_TYPES = ['ТЗ', 'Дефект', 'Заявка', 'Задача', 'Недоработка', 'Предложение'];

// Types that any authenticated user can create (not only superadmin)
export const TZ_USER_TYPES = ['Задача', 'Недоработка', 'Предложение'];

export const TZ_STATUSES = ['draft', 'review', 'waiting_analysis', 'analysis', 'development', 'testing', 'release', 'production', 'partial', 'cancelled'];

export const TZ_STATUS_LABELS = {
  draft: 'Черновик',
  review: 'На рассмотрении',
  waiting_analysis: 'Ждёт анализа',
  analysis: 'Анализ',
  development: 'Разработка',
  testing: 'Тестирование',
  release: 'Релиз',
  production: 'В продакшене',
  partial: 'В продакшене (частично)',
  cancelled: 'Отменено'
};

export const TZ_STATUS_ORD = {
  draft: 0, review: 1, waiting_analysis: 2, analysis: 3, development: 4,
  testing: 5, release: 6, production: 7, partial: 8, cancelled: 99
};

/** Build status ordinals from board columns (dynamic, not hardcoded) */
export function buildStatusOrd(boardColumns) {
  if (!boardColumns || !boardColumns.length) return TZ_STATUS_ORD;
  const sorted = [...boardColumns].sort((a, b) => a.order - b.order);
  return Object.fromEntries(sorted.map((c, i) => [c.id, i]));
}

export function computeTzFlags(tz, statusOrd) {
  const now = new Date();
  const today = now.toISOString().slice(0, 10);
  const flags = {};
  const ordMap = statusOrd || TZ_STATUS_ORD;
  const ord = ordMap[tz.status] ?? 0;

  // Dynamic milestone ordinals — adapts to any board column layout
  const devOrd = ordMap['development'] ?? Infinity;
  const testOrd = ordMap['testing'] ?? Infinity;
  const prodOrd = ordMap['production'] ?? Infinity;

  flags.analysis_overdue = !!tz.date_analysis_deadline && today > tz.date_analysis_deadline && ord < devOrd;
  flags.dev_overdue = !!tz.date_dev_deadline && today > tz.date_dev_deadline && ord < testOrd;
  flags.release_overdue = !!tz.date_release_deadline && today > tz.date_release_deadline && ord < prodOrd;
  flags.overdue = flags.analysis_overdue || flags.dev_overdue || flags.release_overdue;

  const soon7 = new Date(now.getTime() + 7 * 86400000).toISOString().slice(0, 10);
  const activeDeadline =
    (ord < devOrd && tz.date_analysis_deadline) ||
    (ord < testOrd && tz.date_dev_deadline) ||
    (ord < prodOrd && tz.date_release_deadline) ||
    null;
  flags.deadline_soon = !flags.overdue && !!activeDeadline && activeDeadline <= soon7 && activeDeadline >= today;

  flags.no_dates = !tz.date_analysis_deadline && !tz.date_dev_deadline && !tz.date_release_deadline;
  flags.no_owner = (!tz.owner || tz.owner.trim() === '') && !tz.assignee_id;

  flags.missing_deadline =
    (ord === devOrd && !!tz.date_analysis_deadline && !tz.date_dev_deadline) ||
    (ord >= testOrd && ord < prodOrd && (!!tz.date_analysis_deadline || !!tz.date_dev_deadline) && !tz.date_release_deadline);

  return flags;
}
