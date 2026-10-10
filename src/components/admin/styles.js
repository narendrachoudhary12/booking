const adminStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@600;700;800&family=DM+Sans:wght@300;400;500&family=DM+Mono:wght@400&display=swap');

  :root {
    --green:    var(--s9-green);
    --green-lt: #e4f0ea;
    --green-dk: #0d4025;
    --gold:     #c8973a;
    --gold-lt:  #faf0dc;
    --red:      #b83232;
    --red-lt:   #fdf0f0;
    --blue:     #1a5fa0;
    --blue-lt:  #e8f0fb;
    --ink:      #1a1714;
    --bg:       #f5f3ee;
    --surface:  #ffffff;
    --border:   #e4ddd2;
    --muted:    #7a7060;
    --shadow:   0 2px 12px rgba(0,0,0,0.07);
  }

  .s9-wrap * { box-sizing: border-box; margin: 0; padding: 0; }
  .s9-wrap { font-family: var(--s9-font-body); background: var(--bg); color: var(--ink); display: flex; min-height: 100vh; }

  /* ── Sidebar ── */
  .s9-sidebar { width: 220px; background: var(--green-dk); color: #fff; display: flex; flex-direction: column; position: fixed; height: 100vh; left: 0; top: 0; z-index: 200; overflow-y: auto; }
  .s9-sidebar-brand { padding: 22px 18px 16px; border-bottom: 1px solid rgba(255,255,255,0.08); }
  .s9-brand-name { font-family: 'Syne', sans-serif; font-size: 18px; font-weight: 800; color: var(--gold); letter-spacing: -0.5px; }
  .s9-brand-sub { font-size: 10px; color: rgba(255,255,255,0.4); text-transform: uppercase; letter-spacing: 1.5px; margin-top: 2px; }
  .s9-nav { padding: 10px; flex: 1; }
  .s9-nav-group-label { font-size: 9.5px; text-transform: uppercase; letter-spacing: 1.5px; color: rgba(255,255,255,0.3); padding: 12px 8px 5px; font-weight: 600; }
  .s9-nav-item { display: flex; align-items: center; gap: 9px; padding: 9px 10px; border-radius: 7px; font-size: 13px; color: rgba(255,255,255,0.65); cursor: pointer; transition: all 0.15s; margin-bottom: 1px; }
  .s9-nav-item:hover { background: rgba(255,255,255,0.07); color: #fff; }
  .s9-nav-item.active { background: var(--gold); color: var(--green-dk); font-weight: 600; }
  .s9-nav-icon { font-size: 15px; width: 18px; text-align: center; }
  .s9-nav-badge { margin-left: auto; background: var(--red); color: #fff; font-size: 10px; padding: 1px 6px; border-radius: 20px; font-weight: 700; }
  .s9-nav-item.active .s9-nav-badge { background: var(--green-dk); color: #fff; }
  .s9-sidebar-footer { padding: 14px 18px; border-top: 1px solid rgba(255,255,255,0.08); font-size: 11px; color: rgba(255,255,255,0.3); }

  /* ── Main ── */
  .s9-main { margin-left: 220px; flex: 1; display: flex; flex-direction: column; min-height: 100vh; }
  .s9-topbar { background: var(--surface); border-bottom: 1px solid var(--border); padding: 12px 28px; display: flex; align-items: center; justify-content: space-between; position: sticky; top: 0; z-index: 100; box-shadow: 0 1px 6px rgba(0,0,0,0.04); }
  .s9-topbar-title { font-family: 'Syne', sans-serif; font-size: 17px; font-weight: 700; letter-spacing: -0.3px; }
  .s9-topbar-right { display: flex; align-items: center; gap: 12px; }
  .s9-search { padding: 7px 14px 7px 32px; border: 1.5px solid var(--border); border-radius: 7px; font-size: 13px; font-family: var(--s9-font-body); outline: none; background: var(--bg); width: 200px; transition: border-color 0.15s; }
  .s9-search:focus { border-color: var(--green); }
  .s9-avatar { width: 32px; height: 32px; border-radius: 50%; background: var(--green-lt); display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 12px; color: var(--green); }
  .s9-content { padding: 24px 28px; flex: 1; }

  /* ── Stat cards ── */
  .s9-stats-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin-bottom: 24px; }
  .s9-stat-card { background: var(--surface); border-radius: 12px; padding: 20px; border: 1px solid var(--border); box-shadow: var(--shadow); position: relative; overflow: hidden; }
  .s9-stat-card::after { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 3px; }
  .s9-stat-card.s-green::after { background: var(--green); }
  .s9-stat-card.s-gold::after  { background: var(--gold); }
  .s9-stat-card.s-blue::after  { background: var(--blue); }
  .s9-stat-card.s-red::after   { background: var(--red); }
  .s9-stat-label { font-size: 11px; text-transform: uppercase; letter-spacing: 1px; color: var(--muted); margin-bottom: 8px; font-weight: 500; }
  .s9-stat-val   { font-family: 'Syne', sans-serif; font-size: 28px; font-weight: 700; letter-spacing: -1px; line-height: 1; margin-bottom: 6px; }
  .s9-stat-sub   { font-size: 12px; color: var(--muted); }
  .s9-stat-trend { font-size: 12px; font-weight: 500; margin-top: 4px; }
  .trend-up { color: var(--green); }
  .trend-dn { color: var(--red); }

  /* ── Cards ── */
  .s9-card { background: var(--surface); border-radius: 12px; border: 1px solid var(--border); box-shadow: var(--shadow); overflow: hidden; margin-bottom: 20px; }
  .s9-card-head { padding: 14px 20px; border-bottom: 1px solid var(--border); display: flex; align-items: center; justify-content: space-between; }
  .s9-card-title { font-family: 'Syne', sans-serif; font-size: 13.5px; font-weight: 700; }
  .s9-card-body { padding: 20px; }

  /* ── Table ── */
  .s9-tbl { width: 100%; border-collapse: collapse; font-size: 13px; }
  .s9-tbl th { background: var(--bg); padding: 9px 14px; text-align: left; font-size: 10.5px; text-transform: uppercase; letter-spacing: 0.8px; color: var(--muted); border-bottom: 1px solid var(--border); font-weight: 600; white-space: nowrap; }
  .s9-tbl td { padding: 12px 14px; border-bottom: 1px solid var(--border); vertical-align: middle; }
  .s9-tbl tr:last-child td { border-bottom: none; }
  .s9-tbl tr:hover td { background: #faf9f6; }

  /* ── Badges ── */
  .s9-badge { display: inline-flex; align-items: center; gap: 4px; padding: 3px 9px; border-radius: 20px; font-size: 11px; font-weight: 600; text-transform: capitalize; white-space: nowrap; }
  .s9-badge::before { content: ''; width: 5px; height: 5px; border-radius: 50%; }
  .badge-confirmed { background: var(--green-lt); color: var(--green-dk); }
  .badge-confirmed::before { background: var(--green); }
  .badge-pending   { background: var(--gold-lt);  color: #7a4a10; }
  .badge-pending::before   { background: var(--gold); }
  .badge-cancelled { background: var(--red-lt);   color: var(--red); }
  .badge-cancelled::before { background: var(--red); }
  .badge-completed { background: var(--blue-lt);  color: var(--blue); }
  .badge-completed::before { background: var(--blue); }

  /* ── Buttons ── */
  .s9-btn { padding: 7px 14px; border-radius: 7px; font-size: 12.5px; font-family: var(--s9-font-body); font-weight: 500; cursor: pointer; border: none; transition: all 0.15s; }
  .s9-btn-primary { background: var(--green); color: #fff; }
  .s9-btn-primary:hover { background: var(--green-dk); }
  .s9-btn-outline { background: transparent; border: 1.5px solid var(--border); color: var(--ink); }
  .s9-btn-outline:hover { border-color: var(--green); color: var(--green); }
  .s9-btn-danger  { background: var(--red); color: #fff; }
  .s9-btn-danger:hover { background: #8a1f1f; }
  .s9-btn-gold    { background: var(--gold); color: #fff; }
  .s9-btn-sm { padding: 5px 10px; font-size: 11.5px; }

  /* ── Layouts ── */
  .s9-two-col   { display: grid; grid-template-columns: 1fr 340px; gap: 20px; margin-bottom: 20px; }
  .s9-three-col { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 16px; margin-bottom: 20px; }

  /* ── Revenue Chart ── */
  .s9-chart-bars { display: flex; align-items: flex-end; gap: 8px; height: 120px; padding: 10px 0 0; }
  .s9-chart-bar-wrap { flex: 1; display: flex; flex-direction: column; align-items: center; }
  .s9-chart-bar { width: 100%; border-radius: 4px 4px 0 0; background: var(--green-lt); transition: background 0.15s; cursor: pointer; }
  .s9-chart-bar:hover  { background: var(--green); }
  .s9-chart-bar.active { background: var(--green); }
  .s9-chart-label-row  { display: flex; justify-content: space-between; margin-top: 8px; }

  /* ── Activity Feed ── */
  .s9-feed-item { display: flex; gap: 12px; padding: 11px 0; border-bottom: 1px solid var(--border); font-size: 13px; align-items: flex-start; }
  .s9-feed-item:last-child { border-bottom: none; }
  .s9-feed-dot { width: 8px; height: 8px; border-radius: 50%; margin-top: 4px; flex-shrink: 0; }
  .s9-feed-dot.green { background: var(--green); }
  .s9-feed-dot.gold  { background: var(--gold); }
  .s9-feed-dot.red   { background: var(--red); }
  .s9-feed-dot.blue  { background: var(--blue); }
  .s9-feed-text { flex: 1; line-height: 1.5; }
  .s9-feed-time { font-size: 11px; color: var(--muted); white-space: nowrap; }

  /* ── Hotel List ── */
  .s9-hotel-item { display: flex; align-items: center; gap: 14px; padding: 14px 0; border-bottom: 1px solid var(--border); }
  .s9-hotel-item:last-child { border-bottom: none; }
  .s9-hotel-thumb { width: 48px; height: 48px; border-radius: 8px; background: var(--green-lt); display: flex; align-items: center; justify-content: center; font-size: 22px; flex-shrink: 0; }
  .s9-hotel-info { flex: 1; }
  .s9-hotel-name { font-weight: 600; font-size: 14px; }
  .s9-hotel-meta { font-size: 12px; color: var(--muted); margin-top: 2px; }
  .s9-hotel-stats { text-align: right; }
  .s9-hotel-revenue { font-family: 'Syne', sans-serif; font-size: 14px; font-weight: 700; color: var(--green); }
  .s9-hotel-bookings { font-size: 11px; color: var(--muted); }

  /* ── Forms ── */
  .s9-form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; margin-bottom: 14px; }
  .s9-form-row.full  { grid-template-columns: 1fr; }
  .s9-form-group { display: flex; flex-direction: column; gap: 5px; }
  .s9-label { font-size: 11px; font-weight: 600; color: var(--muted); text-transform: uppercase; letter-spacing: 0.7px; }
  .s9-input { padding: 9px 12px; border: 1.5px solid var(--border); border-radius: 7px; font-size: 13px; font-family: var(--s9-font-body); outline: none; background: var(--bg); color: var(--ink); transition: border-color 0.15s; }
  .s9-input:focus { border-color: var(--green); background: #fff; }

  /* ── Revenue Box ── */
  .s9-rev-box { background: var(--surface); border: 1px solid var(--border); border-radius: 10px; padding: 16px; text-align: center; }
  .s9-rev-label { font-size: 11px; color: var(--muted); text-transform: uppercase; letter-spacing: 1px; margin-bottom: 6px; font-weight: 500; }
  .s9-rev-val   { font-family: 'Syne', sans-serif; font-size: 22px; font-weight: 700; }

  /* ── Alerts ── */
  .s9-alert       { display: flex; gap: 10px; padding: 12px 14px; border-radius: 8px; font-size: 13px; margin-bottom: 14px; }
  .s9-alert-green { background: var(--green-lt); border-left: 3px solid var(--green); color: var(--green-dk); }
  .s9-alert-gold  { background: var(--gold-lt);  border-left: 3px solid var(--gold);  color: #7a4a10; }
  .s9-alert-red   { background: var(--red-lt);   border-left: 3px solid var(--red);   color: var(--red); }

  /* ── Modal ── */
  .s9-modal-bg { display: none; position: fixed; inset: 0; background: rgba(0,0,0,0.45); z-index: 500; align-items: center; justify-content: center; }
  .s9-modal-bg.open { display: flex; }
  .s9-modal { background: var(--surface); border-radius: 14px; padding: 28px; width: 500px; max-width: 95vw; box-shadow: 0 24px 64px rgba(0,0,0,0.18); max-height: 90vh; overflow-y: auto; }
  .s9-modal-title  { font-family: 'Syne', sans-serif; font-size: 17px; font-weight: 700; margin-bottom: 20px; }
  .s9-modal-footer { display: flex; gap: 10px; justify-content: flex-end; margin-top: 20px; padding-top: 16px; border-top: 1px solid var(--border); }

  /* ── Misc ── */
  .s9-tag    { display: inline-block; padding: 2px 8px; border-radius: 20px; font-size: 11px; background: var(--bg); border: 1px solid var(--border); color: var(--muted); margin-right: 4px; }
  .s9-tier-1 { display: inline-block; white-space: nowrap; background: var(--green-lt); color: var(--green-dk); padding: 2px 8px; border-radius: 20px; font-size: 11px; font-weight: 600; }
  .s9-tier-2 { display: inline-block; white-space: nowrap; background: var(--gold-lt);  color: #7a4a10;         padding: 2px 8px; border-radius: 20px; font-size: 11px; font-weight: 600; }
  .s9-tier-3 { display: inline-block; white-space: nowrap; background: var(--red-lt);   color: var(--red);      padding: 2px 8px; border-radius: 20px; font-size: 11px; font-weight: 600; }
  .s9-toggle { position: relative; display: inline-block; width: 38px; height: 20px; }
  .s9-toggle input { display: none; }
  .s9-toggle-slider { position: absolute; inset: 0; background: var(--border); border-radius: 20px; cursor: pointer; transition: 0.2s; }
  .s9-toggle-slider::before { content: ''; position: absolute; width: 16px; height: 16px; left: 2px; bottom: 2px; background: #fff; border-radius: 50%; transition: 0.2s; }
  .s9-toggle input:checked + .s9-toggle-slider { background: var(--green); }
  .s9-toggle input:checked + .s9-toggle-slider::before { transform: translateX(18px); }
  .s9-code { font-family: monospace; font-size: 11px; color: var(--muted); }

  @media (max-width: 900px) {
    .s9-sidebar { display: none; }
    .s9-main { margin-left: 0; }
    .s9-stats-grid { grid-template-columns: 1fr 1fr; }
    .s9-two-col, .s9-three-col { grid-template-columns: 1fr; }
  }
`;

export default adminStyles;
