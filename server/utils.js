// Shared TZ utilities — used by server/app.js and scripts/ai-worker.js

export const TZ_STATUSES = ['draft', 'review', 'analysis', 'development', 'testing', 'release', 'production', 'partial', 'cancelled'];

export const TZ_STATUS_LABELS = {
  draft: 'Черновик',
  review: 'На рассмотрении',
  analysis: 'Анализ',
  development: 'Разработка',
  testing: 'Тестирование',
  release: 'Релиз',
  production: 'В продакшене',
  partial: 'В продакшене (частично)',
  cancelled: 'Отменено'
};

export const TZ_STATUS_ORD = {
  draft: 0, review: 1, analysis: 2, development: 3,
  testing: 4, release: 5, production: 6, partial: 7, cancelled: 99
};

export function computeTzFlags(tz) {
  const now = new Date();
  const today = now.toISOString().slice(0, 10);
  const flags = {};
  const ord = TZ_STATUS_ORD[tz.status] ?? 0;

  flags.analysis_overdue = !!tz.date_analysis_deadline && today > tz.date_analysis_deadline && ord < 3;
  flags.dev_overdue = !!tz.date_dev_deadline && today > tz.date_dev_deadline && ord < 4;
  flags.release_overdue = !!tz.date_release_deadline && today > tz.date_release_deadline && ord < 6;
  flags.overdue = flags.analysis_overdue || flags.dev_overdue || flags.release_overdue;

  const soon7 = new Date(now.getTime() + 7 * 86400000).toISOString().slice(0, 10);
  const activeDeadline =
    (ord < 3 && tz.date_analysis_deadline) ||
    (ord < 4 && tz.date_dev_deadline) ||
    (ord < 6 && tz.date_release_deadline) ||
    null;
  flags.deadline_soon = !flags.overdue && !!activeDeadline && activeDeadline <= soon7 && activeDeadline >= today;

  flags.no_dates = !tz.date_analysis_deadline && !tz.date_dev_deadline && !tz.date_release_deadline;
  flags.no_owner = !tz.owner || tz.owner.trim() === '';

  flags.missing_deadline =
    (ord === 3 && !!tz.date_analysis_deadline && !tz.date_dev_deadline) ||
    (ord >= 4 && ord <= 5 && (!!tz.date_analysis_deadline || !!tz.date_dev_deadline) && !tz.date_release_deadline);

  return flags;
}
