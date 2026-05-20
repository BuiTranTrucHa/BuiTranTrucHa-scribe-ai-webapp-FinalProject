const app = document.getElementById("app");
const toastRoot = document.getElementById("toast-root");

const state = {
  workspace: "strategist",
  route: location.pathname === "/" ? "/" : location.pathname,
  dashboardRange: "Tháng này",
  dashboardExpanded: null,
  planningExpanded: null,
  planningFilter: "all",
  approved: new Set(),
  rejected: new Set(),
  rejecting: null,
  briefOpen: false,
  briefTab: 0,
  panelOpen: false,
  bvPopover: false,
  tonePanel: false,
  toneSent: false,
  selectedTones: new Set(["Direct"]),
  suggestionMode: "single",
  suggestionVisible: false,
  customCompose: false,
  smartVisible: true,
  smartIndex: 0,
  anchor: false,
  warmStart: false,
  importModal: false,
  importTab: 0,
  importStep: "form",
  importArticles: ["Scribe AI vs Google Analytics", "B2B content mistakes"],
  sidebarCollapsed: false,
  writerBody: "",
  suggestionTimer: null,
  aiChatOpen: false,
  aiChatInput: "",
  aiChatAnswer: false,
  aiFocusLabel: "đoạn đang viết",
  autoSuggestionUsed: false,
};

const icons = {
  activity: `<svg class="icon" viewBox="0 0 24 24"><path d="M22 12h-4l-3 8-6-16-3 8H2"/></svg>`,
  list: `<svg class="icon" viewBox="0 0 24 24"><path d="M9 6h11M9 12h11M9 18h11"/><path d="m4 6 1 1 2-2M4 12l1 1 2-2M4 18l1 1 2-2"/></svg>`,
  file: `<svg class="icon" viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6M8 13h8M8 17h5"/></svg>`,
  settings: `<svg class="icon" viewBox="0 0 24 24"><path d="M12 15.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7z"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.6V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1-1.6 1.7 1.7 0 0 0-1.9.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.9 1.7 1.7 0 0 0-1.6-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.6-1 1.7 1.7 0 0 0-.3-1.9l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.9.3h.1a1.7 1.7 0 0 0 1-1.6V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.6 1.7 1.7 0 0 0 1.9-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.9v.1a1.7 1.7 0 0 0 1.6 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"/></svg>`,
  users: `<svg class="icon" viewBox="0 0 24 24"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.8M16 3.1a4 4 0 0 1 0 7.8"/></svg>`,
  download: `<svg class="icon" viewBox="0 0 24 24"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><path d="M7 10l5 5 5-5M12 15V3"/></svg>`,
  chevron: `<svg class="icon chevron" viewBox="0 0 24 24"><path d="m6 9 6 6 6-6"/></svg>`,
  calendar: `<svg class="icon" viewBox="0 0 24 24"><path d="M8 2v4M16 2v4M3 10h18M5 4h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z"/></svg>`,
  back: `<svg class="icon" viewBox="0 0 24 24"><path d="m15 18-6-6 6-6"/></svg>`,
  share: `<svg class="icon" viewBox="0 0 24 24"><path d="M4 12v8h16v-8M12 16V4M8 8l4-4 4 4"/></svg>`,
  panel: `<svg class="icon" viewBox="0 0 24 24"><path d="M4 4h16v16H4zM15 4v16"/></svg>`,
  close: `<svg class="icon" viewBox="0 0 24 24"><path d="M18 6 6 18M6 6l12 12"/></svg>`,
  clock: `<svg class="icon" viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>`,
  search: `<svg class="icon" viewBox="0 0 24 24"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>`,
  funnel: `<svg class="icon" viewBox="0 0 24 24"><path d="M3 4h18l-7 8v6l-4 2v-8z"/></svg>`,
  trend: `<svg class="icon" viewBox="0 0 24 24"><path d="m3 17 6-6 4 4 8-8"/><path d="M15 7h6v6"/></svg>`,
  check: `<svg class="icon" viewBox="0 0 24 24"><path d="m20 6-11 11-5-5"/></svg>`,
  wand: `<svg class="icon" viewBox="0 0 24 24"><path d="M15 4V2M15 10V8M11 6H9M21 6h-2M18.5 3.5 17 5M13 7l-9 9 4 4 9-9z"/></svg>`,
  sparkles: `<svg class="icon" viewBox="0 0 24 24"><path d="M12 3l1.6 4.4L18 9l-4.4 1.6L12 15l-1.6-4.4L6 9l4.4-1.6zM19 14l.8 2.2L22 17l-2.2.8L19 20l-.8-2.2L16 17l2.2-.8zM5 15l.7 1.8L7.5 17.5l-1.8.7L5 20l-.7-1.8-1.8-.7 1.8-.7z"/></svg>`,
};

function logo(color = "currentColor") {
  return `<span class="logo-mark" style="color:${color}"><svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M7 5.5h10M7 10h7M7 14.5h10M7 19h6" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/><rect x="4" y="3" width="16" height="18" rx="4" stroke="currentColor" stroke-width="1.4"/></svg></span>`;
}

function navigate(path) {
  history.pushState({}, "", path);
  state.route = path;
  state.suggestionVisible = false;
  render();
}

function toast(message) {
  const el = document.createElement("div");
  el.className = "toast";
  el.textContent = message;
  toastRoot.appendChild(el);
  setTimeout(() => {
    el.style.opacity = "0";
    setTimeout(() => el.remove(), 220);
  }, 3000);
}

function tag(stage, outline = false) {
  const cls = stage.toLowerCase();
  const labelMap = {
    awareness: "Nhận biết",
    consideration: "Cân nhắc",
    decision: "Quyết định",
    potential: "Tiềm năng",
    review: "Cần xem lại",
  };
  return `
    <span class="tag ${outline ? "outline" : cls}">
      ${labelMap[cls] || stage}
    </span>
  `;
}

function scoreBadge(value) {
  const v = Number(value);
  const tier = v >= 70 ? "high" : v >= 40 ? "mid" : "low";
  return `<span class="badge score ${tier} mono">${value}</span>`;
}

function setTitle(title) {
  document.title = title;
}

function render() {
  const route = state.route;
  if (route === "/dashboard") app.innerHTML = shell("dashboard", dashboardPage());
  else if (route === "/planning") app.innerHTML = shell("planning", planningPage());
  else if (route === "/canvas") app.innerHTML = shell("canvas", canvasPage(), "canvas-main");
  else app.innerHTML = homePage();
  bind();
}

function shell(active, content, mainClass = "") {
  const activeUser = active === "canvas" ? ["TK", "Tuấn Khải", "Content Writer"] : ["LH", "Lan Hương", "Content Strategist"];
  return `
    <div class="page-shell ${state.sidebarCollapsed ? "collapsed" : ""}">
      <aside class="sidebar">
        <div class="sidebar-logo">
          <button class="sidebar-toggle" type="button" data-sidebar-toggle aria-label="${state.sidebarCollapsed ? "Mở navigation" : "Thu gọn navigation"}" title="${state.sidebarCollapsed ? "Mở navigation" : "Thu gọn navigation"}">${logo()}</button>
          <a class="sidebar-brand" href="/" data-nav="/" title="Về homepage">Scribe AI</a>
        </div>
        <nav class="nav-section">
          <div class="nav-label"></div>
          ${active === "canvas"
            ? navItem("/canvas", "canvas","", "Trình soạn thảo", active)
            : `
              <div class="nav-switch">
                <div class="switch-indicator ${active}"></div>
                ${navItem("/dashboard", "dashboard","", "Quản lý bài viết", active)}
                ${navItem("/planning", "planning","", "Kế hoạch đề xuất", active)}
              </div>
            `
          }
        </nav>
        <div class="sidebar-user"><div class="avatar">${activeUser[0]}</div><div class="user-meta"><div style="font-size:13px;font-weight:500">${activeUser[1]}</div><div class="muted" style="font-size:11px">${activeUser[2]}</div></div></div>
      </aside>
      <main class="main ${mainClass}">${content}</main>
    </div>`;
}

function navItem(path, key, icon, label, active) {
  return `<a class="nav-item ${active === key ? "active" : ""}" href="${path}" data-nav="${path}" title="${label}">${icon}<span class="nav-text">${label}</span></a>`;
}

function homePage() {
  setTitle("Scribe AI");
  const cards = [
     [
    "dashboard",
    icons.activity,
    "Content Strategist",
    "Biết ngay nội dung nào đang hiệu quả và đóng góp hiệu suất dựa trên tín hiệu hành vi thật.",
    "Dành cho Strategist",
    "/dashboard",
    "Img/Strategist 1.png" // 👈 ảnh riêng
    ],
     [
    "canvas",
    icons.file,
    "Content Writer",
    "Dữ liệu và data hiện hữu trong tài liệu - Người viết tiện lợi thỏa sức sáng tạo không sợ ngắt quãng .",
    "Dành cho Writer",
    "/canvas",
    "Img/Writer 1.png" // 👈 ảnh riêng
    ],
  ];
  return `
    <div class="homepage">
      <header class="home-nav">
        <a class="brand" href="/" data-nav="/">${logo()}<span>Scribe AI</span></a>
        <nav class="home-links"><a href="#features">Đăng nhập</a></nav>
      </header>
      <section class="hero">
        <div class="hero-inner">
          <div class="hero-left">
            <h1>
              Quản lý thông minh
              <span>Sáng tạo không giới hạn</span>
            </h1>
            <p>
              Nền tảng quản lý nội dung số hỗ trợ hiệu quả quảng cáo tiếp thị — 
              kết hợp trợ lý viết AI với phân tích hiệu quả nội dung trong một không gian làm việc.
            </p>
          </div>

          <div class="hero-right">
            <img src="Img/Gemini_Generated_Image_dxj8uddxj8uddxj8 1.png" />
          </div>
        </div>
      </section>
      <section class="feature-grid" id="features">
        ${cards.map((card, index) => `
          <article class="feature-card ${index === 2 ? "neutral" : ""}" data-nav="${card[5]}">

            <!-- IMAGE -->
            <div class="feature-image">
              <img src="${card[6]}" />
            </div>

            <div class="feature-icon">${card[1]}</div>
            <h3>${card[2]}</h3>
            <p>${card[3]}</p>

            <div class="feature-footer">
              <span class="tertiary" style="font-size:11px">${card[4]}</span>
              <span style="font-size:12px;color:var(--text-primary)">Bắt đầu ngay→</span>
            </div>

          </article>
        `).join("")}
      </section>  
      <section class="section-intro">
        <h2>Một không gian làm việc tinh gọn</h2>
        <p>Thống kê dữ liệu - Kế hoạch bài viết - Soạn thảo thông minh</p>
      </section>
      <footer class="footer">
        <div class="footer-grid">
          <div><div class="brand">${logo("#fff")}<span>Scribe AI</span></div><p>Know what works. Write more of it.</p></div>
          <div><div class="footer-label">Sản phẩm</div><a href="/dashboard" data-nav="/dashboard">Quản lý bài viết</a><a href="/planning" data-nav="/planning">Kế hoạch đề xuất</a><a href="/canvas" data-nav="/canvas">Trình soạn thảo</a></div>
          <div><div class="footer-label">Công ty</div><a href="#">Giới thiệu</a><a href="#">Blog</a></div>
        </div>
        <div class="footer-bottom"><span>© 2025 Scribe AI</span><span>Privacy</span><span>Terms</span></div>
      </footer>
    </div>`;
}

function dashboardPage() {
  setTitle("Tháng 5, 2026 ");
  const subtitle = state.dashboardRange === "7 ngày" ? "Tháng 5, 2025 · 4 bài đã publish" : state.dashboardRange === "90 ngày" ? "Q1–Q2 2025 · 38 bài đã publish" : "14 bài đã publish";
  const rows = [
    ["Scribe AI vs Google Analytics — so sánh thật", "potential", 92, "consideration", "Lượt quay lại tăng 40% — người đọc quay lại lần 2"],
    ["B2B content strategy 2025 — framework thực tế", "potential", 87, "awareness", "Độ sâu cuộn 78% — cao nhất tháng này"],
    ["So sánh công cụ content B2B: Notion vs Scribe AI", "potential", 74, "consideration", "Thời gian đọc trung bình 4:20 — gấp 2× mức bình thường"],
    ["Cách đo ROI content marketing cho B2B", "review", 51, "decision", "Bounce rate cao — người đọc rời sau 45 giây"],
    ["Tại sao B2B team cần phân tích content", "review", 28, "awareness", "Chia sẻ nội bộ giảm — topic có thể đã bão hòa"],
  ];
  return `
    <section class="page-header">
      <div><h1 class="h1">Tháng 5, 2026</h1><div class="muted" style="font-size:14px;margin-top:4px">${subtitle}</div></div>
      <div class="header-actions">
        <button class="btn" data-dropdown="range">${state.dashboardRange} ▾</button>
        <button class="btn" data-export>${icons.download}<span>Xuất báo cáo</span></button>
      </div>
    </section>
    <section class="metric-grid">
      <div class="metric-card metric-card-large">
        <div class="metric mono">64</div>
        <div class="label">Điểm tín hiệu trung bình</div>
        <div class="muted" style="margin-top:8px">Tổng hợp từ behavioral signals — thời gian đọc, độ sâu cuộn, lượt quay lại</div>
        <div class="trendline up" style="margin-top:24px">↑ 8 điểm so với tháng trước</div>
      </div>
      ${metricCard("5", "Bài đang hoạt động tốt", "↑ 2 so với tháng trước", "up")}
      ${metricCard("3", "Bài cần xem lại", "↓ 1 so với tháng trước", "down")}
    </section>
    <section class="table-card">
      <div class="table-head"><div>Bài viết</div><div>Trạng thái</div><div style="text-align:right">Điểm tín hiệu</div><div style="text-align:right">Xu hướng</div><div>Lý do thay đổi</div><div></div></div>
      ${rows.slice(0,3).map((r, i) => dashboardRow(r, i)).join("")}
      ${rows.slice(3).map((r, i) => dashboardRow(r, i + 3, "attention")).join("")}
      <div class="table-row opportunity">
        <div class="row-title">Decision stage — chưa có bài nào phủ</div>${tag("Decision", true)}<div class="mono tertiary">—</div><div class="mono tertiary">—</div>
        <div class="reason">Khoảng trống được phát hiện tự động — đang bỏ lỡ stage chuyển đổi quan trọng</div><button class="btn btn-soft" data-nav="/planning">Tạo brief →</button>
      </div>
    </section>`;
}

function metricCard(number, label, trend, cls) {
  return `<div class="metric-card"><div class="metric mono">${number}</div><div class="label">${label}</div><div class="trendline ${cls}">${trend}</div></div>`;
}

function dashboardRow(r, index, extra = "") {
  const open = state.dashboardExpanded === index;
  const trendCls = r[3].startsWith("↓") ? "down" : r[3].startsWith("↑") ? "up" : "tertiary";
  return `
    <div class="table-row ${extra}" data-expand-row="${index}">
      <div class="row-title">${r[0]}</div><div>${tag(r[1])}</div><div class="score-cell">${scoreBadge(r[2])}</div>
      <div class="trend" style="text-align:right">${tag(r[3])}</div><div class="reason">${r[4]}</div><div>${icons.chevron.replace("chevron", `chevron ${open ? "open" : ""}`)}</div>
    </div>
    ${open ? `<div class="expand-panel">
      ${signalCol("Tín hiệu hành vi", [["Thời gian đọc","4:22"],["Độ sâu cuộn","78%"],["Lượt quay lại","40%", "up"]])}
      ${signalCol("Tín hiệu pipeline", [["Chia sẻ nội bộ","23 lần"],["Tỉ lệ click CTA","12%"],["Số phiên trung bình","1.8"]])}
      <div class="expand-actions"><button class="btn btn-soft" data-nav="/canvas" data-toast="Brief đã được gửi sang người viết"> Gửi brief sang người viết</button></div>
    </div>` : ""}`;
}

function signalCol(title, items) {
  return `<div><div class="mini-label">${title}</div>${items.map(i => `<div class="metric-line"><span>${i[0]}</span><span class="mono ${i[2] || ""}">${i[1]}</span></div>`).join("")}</div>`;
}

function planningPage() {
  setTitle("Kế hoạch đề xuất — Scribe AI");
  const topics = planningTopics().filter(t => !state.rejected.has(t.id));
  const visible = state.planningFilter === "approved" ? topics.filter(t => state.approved.has(t.id)) : state.planningFilter === "gap" ? topics.filter(t => t.gap) : topics;
  return `
    <section class="page-header">
      <div><h1 class="h1">Độ phủ nội dung</h1><div class="muted" style="font-size:13px;margin-top:4px"> ${3 - state.approved.size - state.rejected.size} chủ đề đang chờ duyệt</div></div>
      <div class="header-actions"><button class="btn" data-month>Tháng này▾</button><button class="btn">${icons.calendar}Lịch nội dung</button></div>
    </section>
    <section class="coverage">
      <div class="coverage-grid">
        ${coverageCol("awareness", "6", "78", 78, "Đang tốt", "up")}
        ${coverageCol("consideration", "3", "52", 52, "Cần thêm bài", "amber")}
        ${coverageCol("decision", "0", "—", 0, "Chưa có bài · Gap phát hiện tự động", "down")}
      </div>
    </section>
    <section>
      <div class="topic-header"><h2 class="h2" style="font-size:15px">Chủ đề được đề xuất</h2><div class="tabs">
        ${filterBtn("all", "Tất cả")}${filterBtn("gap", "Đang thiếu")}${filterBtn("approved", "Đã duyệt")}
      </div></div>
      <div class="topic-list">
        ${visible.length ? visible.map(topicCard).join("") : `<div class="empty-state">${icons.list}<div>Chưa có chủ đề nào được duyệt</div></div>`}
      </div>
    </section>`;
}

function coverageCol(stage, count, avg, fill, status, cls, priority = false) {
  return `<div class="coverage-col">${tag(stage)}<div class="coverage-count"><span class="metric mono">${count}</span><span class="muted">bài</span></div><div class="mono muted" style="font-size:12px">Điểm tín hiệu TB: ${avg}</div><div class="progress ${cls === "amber" ? "amber" : ""}"><span style="width:${fill}%"></span></div><div class="${cls}" style="font-size:11px;margin-top:6px">${status}</div>${priority ? `<div class="tag low" style="margin-top:7px;background:#faece7;color:#712b13;font-size:10px">Ưu tiên cao</div>` : ""}</div>`;
}

function filterBtn(id, label) {
  return `<button class="tab-btn ${state.planningFilter === id ? "active" : ""}" data-planning-filter="${id}">${label}</button>`;
}

function planningTopics() {
  return [
    { id: "roi", gap: true, stage: "Decision", title: "Cách đo ROI content marketing — hướng dẫn thực tế cho B2B team nhỏ", reason: "Lấp khoảng trống Decision stage · Đối thủ chưa phủ góc ROI cho team dưới 15 người", estimate: "Tiềm năng cao", history: "Chưa có lịch sử đề xuất · Dựa trên nội dung Decision stage tương tự", priority: true },
    { id: "compare", gap: false, stage: "Consideration", title: "So sánh thực tế: content planning có và không có dữ liệu hiệu quả", reason: "Tăng độ phủ Consideration · Góc so sánh chưa được team khai thác sâu", estimate: "Tiềm năng trung bình", history: "Trước đây: Nội dung dạng so sánh → top 20% lượt quay lại ↑" },
    { id: "framework", gap: false, stage: "Awareness", title: "5 framework content B2B từ team dưới 10 người đã thành công", reason: "Bổ sung Awareness · Chủ đề mới chưa bão hòa · Pattern tương tự từng perform tốt", estimate: "Tiềm năng thấp", history: "Trước đây: Framework content → điểm tín hiệu TB 81 (+22% so với TB) ↑" },
  ];
}

function topicCard(t) {
  const open = state.planningExpanded === t.id;
  const approved = state.approved.has(t.id);
  const rejecting = state.rejecting === t.id;
  return `<article class="topic-card ${t.priority ? "priority" : ""}" data-topic="${t.id}">
    <div class="topic-top"><div style="display:flex;gap:8px;align-items:center">${tag(t.stage)}${t.gap ? `<span class="tertiary" style="font-size:10px">Lấp gap ·</span>` : ""}</div>${icons.chevron.replace("chevron", `chevron ${open ? "open" : ""}`)}</div>
    <h3 class="topic-title">${t.title}</h3>
    <div class="topic-reason">${t.reason}</div>
    ${rejecting ? rejectPanel(t.id) : `<div class="topic-bottom"><div><span class="estimate" style="${t.stage === "Awareness" ? "background:#f7f6f3;color:#6b6a65" : t.stage === "Consideration" ? "background:#faeeda;color:#633806" : ""}">${t.estimate}</span><div class="${t.id === "roi" ? "tertiary" : "up"}" style="margin-top:6px;font-size:11px;font-style:italic">${t.history}</div></div><div class="topic-actions">${approved ? approvedActions() : `<button class="btn btn-primary" data-approve="${t.id}">Duyệt & Tạo brief</button><button class="btn" data-reject="${t.id}">Từ chối</button>`}</div></div>`}
    ${open ? topicExpanded(t) : ""}
  </article>`;
}

function rejectPanel(id) {
  return `<div class="reject-panel"><input placeholder="Lý do từ chối (không bắt buộc)" /><div style="display:flex;gap:8px;margin-top:8px"><button class="btn" style="background:#faece7;color:#712b13;border:0" data-confirm-reject="${id}">Xác nhận từ chối</button><button class="btn" data-cancel-reject>Hủy</button></div></div>`;
}

function approvedActions() {
  return `<div><div class="up" style="font-size:13px;font-weight:500">${icons.check} Brief đã tạo</div><a href="/canvas" data-nav="/canvas" style="display:block;color:var(--brand);font-size:13px;margin-top:4px">Gửi bài cho người viết</a><button class="btn btn-plain" style="font-size:12px;padding:2px 0" data-open-brief>Mở brief đầy đủ ↓</button></div>`;
}

function topicExpanded(t) {
  return `<div class="topic-expanded"><div><div class="mini-label">Ước tính kịch bản</div><div class="tertiary" style="font-size:10px;font-style:italic;margin-bottom:12px">Ước tính theo hành vi người đọc — không đảm bảo pipeline</div>${signalCol("", [["Thời gian đọc dự kiến","~4:30"],["Tỉ lệ quay lại","~35%"],["Độ sâu cuộn","~72%"],["Mức engagement","Top 25%", "up"]])}</div><div><div class="mini-label">Brief sẽ được tạo</div><div class="brief-preview">${[["Độc giả","Content Strategist / Manager · B2B SaaS"],["Góc viết","Framework ROI thực tế cho team nhỏ"],["Tone","Confident + Direct"],["CTA","Bắt đầu thử miễn phí"],["Stage", tag(t.stage)]].map(r => `<div class="brief-row"><span class="tertiary" style="min-width:58px">${r[0]}</span><span>${r[1]}</span></div>`).join("")}</div></div></div>`;
}

function canvasPage() {
  setTitle("Trình soạn thảo — Scribe AI");
  return `<div class="canvas-page">
    <header class="canvas-topbar">
      <div class="top-left"><button class="icon-btn" data-nav="/">${icons.back}</button><div class="divider"></div><div contenteditable class="doc-title">B2B content strategy 2025 — framework thực tế</div><div class="status-text tertiary" style="font-size:11px">Draft · Tự động lưu lúc 14:32</div></div>
      <div class="top-right"><button class="btn" data-share>${icons.share}Share</button><button class="btn btn-primary" data-publish>Publish</button></div>
    </header>
    <main class="canvas">
      ${brandVoiceBanner()}
      ${briefSection()}
      ${editorToolbar()}
      <div class="writing-editor" contenteditable="true" spellcheck="true" aria-label="Nội dung bài viết">
        <h1 data-ai-block="tiêu đề">B2B Content Strategy 2025: Framework Thực Tế Không Cần Đoán Mò</h1>
        <p data-ai-block="đoạn mở bài">Content marketing B2B đang ở một giai đoạn thú vị. Hầu hết các team đều biết content quan trọng — nhưng rất ít team thực sự biết nội dung nào đang hiệu quả và vì sao.</p>
        <p data-ai-block="đoạn framework">Bài viết này không nói về lý thuyết. Đây là framework 4 bước mà các B2B marketing team dưới 15 người đang dùng để ra quyết định dựa trên dữ liệu thay vì trực giác.</p>
        <h2 class="writing-h2 ${state.anchor ? "anchor" : ""}" data-ai-block="heading bước 1">Bước 1: Hiểu signal, không phải traffic</h2>
      </div>
      ${state.anchor ? `<div class="tertiary" style="font-size:11px;font-style:italic;padding-top:4px">Bạn đang viết về framework thực tế cho B2B team — tiếp tục từ đây.</div>` : ""}
      <div class="post-h2-input" contenteditable="true" spellcheck="true" data-writer-input data-ai-block="vùng trống dưới bước 1" aria-label="Viết nội dung bên dưới bước 1">${state.writerBody || ""}</div>
      <div class="inserted-text"></div>
      ${state.warmStart ? warmStart() : state.suggestionVisible ? aiSuggestion() : ""}
    </main>
    ${state.panelOpen ? "" : `<button class="icon-btn context-icon" title="Brief & ngữ cảnh" data-panel>${icons.panel}</button>`}
    ${state.panelOpen ? sidePanel() : ""}
    ${state.aiChatOpen ? aiChatPanel() : ""}
    ${state.importModal ? importModal() : ""}
  </div>`;
}

function editorToolbar() {
  return `<div class="editor-toolbar" role="toolbar" aria-label="Công cụ soạn thảo">
    <button class="toolbar-btn" title="Hoàn tác">${icons.chevron.replace("chevron", "chevron rotate-left")}</button>
    <button class="toolbar-btn" title="Làm lại">${icons.chevron.replace("chevron", "chevron rotate-right")}</button>
    <span class="toolbar-divider"></span>
    <button class="toolbar-select">100% ▾</button>
    <button class="toolbar-select">Đoạn văn ▾</button>
    <span class="toolbar-divider"></span>
    <button class="toolbar-btn text-tool">B</button>
    <button class="toolbar-btn text-tool"><i>I</i></button>
    <button class="toolbar-btn text-tool"><u>U</u></button>
    <button class="toolbar-btn text-tool">S</button>
    <span class="toolbar-divider"></span>
    <button class="toolbar-btn">${icons.list}</button>
    <button class="toolbar-btn">1.</button>
    <button class="toolbar-btn">≡</button>
    <span class="toolbar-divider"></span>
    <button class="toolbar-btn">${icons.file}</button>
    <button class="toolbar-btn">fx</button>
    <span class="toolbar-spacer"></span>
    <button class="btn btn-soft ai-toolbar-btn" data-open-ai-chat>${icons.sparkles}<span>Đề xuất AI</span></button>
  </div>`;
}

function brandVoiceBanner(compact = false) {
  return `<section class="brand-voice-banner ${compact ? "compact" : ""}">
    <div class="brand-voice-top">
      <div><span class="dot"></span><strong>Brand Voice AI đang học</strong></div>
      <span class="mono">8 / 20 bài</span>
    </div>
    <div class="progress"><span style="width:40%"></span></div>
    <p>AI đọc các bài có điểm tín hiệu cao để hiểu cách team dùng hook, tone và cấu trúc lập luận. Càng đủ dữ liệu, gợi ý trong lúc viết càng sát giọng brand hơn.</p>
  </section>`;
}

function briefSection() {
  return `<section class="brief-box">
    <div class="brief-header" data-brief-toggle><div class="brief-left">${icons.list}<span style="font-size:14px;font-weight:500;color:var(--text-secondary)">Hướng bài</span><span class="tertiary">·</span><span class="tertiary" style="font-size:14px">Brief của Lan Hương · Đã duyệt</span></div><div class="brief-right"><span class="tag" style="background:rgba(26,25,23,0.06);color:var(--text-tertiary);font-size:10px">3 tab</span>${icons.chevron.replace("chevron", `chevron ${state.briefOpen ? "open" : ""}`)}</div></div>
    ${state.briefOpen ? `<div class="brief-tabs">${["Hướng bài","Bài hiệu quả & đối thủ","Ngữ cảnh pipeline"].map((t, i) => `<button class="brief-tab ${state.briefTab === i ? "active" : ""}" data-brief-tab="${i}">${t}</button>`).join("")}</div><div class="brief-content">${briefContent()}</div>` : ""}
  </section>`;
}

function briefContent() {
  if (state.briefTab === 1) return briefTabTwo();
  if (state.briefTab === 2) return briefTabThree();
  return `<div style="font-s>${dataRow("Độc giả", "Content Strategist / Manager · B2B SaaS · team 5–15 người")}${dataRow("Góc viết", "Framework có thể áp dụng ngay — không lý thuyết")}${dataRow("Tone", "Confident + Direct")}${dataRow("Tone chiến dịch", `${toneTagsHtml()} <button class="btn btn-plain" style="min-height:0;padding:0 0 0 4px;font-size:14px;color:var(--brand)" data-tone-panel>Đề xuất chỉnh tone ↗</button>${state.toneSent ? `<span style="margin-left:8px;color:var(--amber);font-size:10px;font-style:italic">(Đang chờ duyệt)</span>` : ""}`)}${state.tonePanel ? tonePanel() : ""}${dataRow("CTA", "Bắt đầu thử miễn phí — 14 ngày")}${dataRow("Stage", tag("Awareness"))}</div>`;
}

function dataRow(k, v) { return `<div class="data-row"><div class="key">${k}</div><div class="value">${v}</div></div>`; }
function toneTagsHtml() { return `<span style="${state.toneSent ? "opacity:.5" : ""}">${tag("Educational").replace("awareness", "consideration")} ${tag("Confident").replace("awareness", "awareness")}</span>`; }

function tonePanel() {
  if (state.toneSent) return `<div class="tone-panel"><div class="up" style="display:flex;gap:6px;align-items:center;font-size:13px;font-weight:500">${icons.check}Đề xuất đã gửi</div><div class="muted" style="font-size:11px;margin-top:4px">Lan Hương sẽ review và phản hồi — gợi ý AI sẽ tự cập nhật khi được duyệt.</div></div>`;
  return `<div class="tone-panel"><div style="font-size:11px;font-weight:500;color:var(--text-secondary);margin-bottom:10px">Đề xuất tone mới cho bài này</div><div class="tertiary" style="font-size:10px;font-style:italic;margin-bottom:10px">Tone hiện tại: Educational + Confident</div><div class="tone-tags">${["Đồng cảm","Gấp rút","Trực diện","Vui hơn","Tự nhiên","Có thẩm quyền"].map(t => `<button class="tone-tag ${state.selectedTones.has(t) ? "selected" : ""}" data-tone="${t}">${t}</button>`).join("")}</div><textarea rows="2" placeholder="Ghi chú thêm (không bắt buộc)"></textarea><div style="display:flex;gap:8px;margin-top:12px"><button class="btn btn-primary" data-send-tone>Gửi đề xuất cho Lan Hương</button><button class="btn" data-close-tone>Hủy</button></div></div>`;
}

function briefTabTwo() {
  return `<div class="two-col"><div><div class="mini-label">Bài của team · Cùng topic</div>${miniArticle("Scribe AI vs Google Analytics — so sánh thật","92","Hook số liệu cụ thể mở bài → giữ được 80% độ sâu cuộn")}${miniArticle("Các lỗi content B2B phổ biến nhất","81","Framework đánh số rõ ràng → lượt quay lại tăng 40%")}</div><div><div class="mini-label">Đối thủ · Nội dung công khai</div><div class="stale">${icons.clock}<span>Cập nhật 5 ngày trước — có thể có thay đổi mới</span></div>${["Đối thủ A: Tập trung ROI và revenue attribution","Đối thủ B: Hướng dẫn triển khai từng bước","Đối thủ C: Case study từ enterprise brands"].map(x => `<div class="metric-line"><span>${x}</span></div>`).join("")}<div class="gap-summary"><b>Góc viết chưa được phủ:</b><br/>Framework thực tế từ team nhỏ (&lt;15 người) — đối thủ tập trung enterprise</div><button class="btn btn-plain" style="padding:8px 0;color:var(--brand)" data-refresh>Làm mới dữ liệu</button><div class="tertiary" style="font-size:10px;font-style:italic">Dữ liệu từ nội dung công khai — không bao gồm nguồn paywall</div></div></div>`;
}

function miniArticle(title, score, reason) {
  return `<div class="mini-card"><div style="display:flex;justify-content:space-between;gap:8px"><div style="font-size:12px;font-weight:500;line-height:1.4">${title}</div>${scoreBadge(score)}</div><div class="reason" style="font-size:11px;margin-top:6px">${reason}</div></div>`;
}

function briefTabThree() {
  return `<div><div style="display:flex;gap:8px;align-items:center;margin-bottom:16px"><span class="muted" style="font-size:12px">Bài này đang ở</span>${tag("Awareness")}<span class="muted" style="font-size:12px">trong funnel</span></div><div class="mini-label">CTA đang perform tốt nhất ở Awareness stage</div>${[["Xem case study →","74"],["Thử demo miễn phí →","68"],["Tải template →","61"]].map(x => `<div class="metric-line"><span>${x[0]}</span>${scoreBadge(x[1])}</div>`).join("")}</div>`;
}

function bvPopover() {
  return `<div class="bv-popover"><div style="font-size:12px;font-weight:500;margin-bottom:6px">Brand Voice AI đang học</div><div class="metric-line"><span>Tuấn Khải</span><span class="mono">8 / 20 bài</span></div><div class="progress"><span style="width:40%"></span></div><div style="border-top:.5px solid var(--border);margin:10px 0"></div><div class="mini-label">Fingerprint học từ</div><div class="muted" style="font-size:11px">5 bài có điểm tín hiệu cao ≥70 ${scoreBadge("84")}</div><div class="tertiary" style="font-size:10px;font-style:italic;margin-top:8px">Gợi ý sẽ cá nhân hóa hơn sau khi đủ 20 bài.</div></div>`;
}

function aiSuggestion() {
  if (state.suggestionMode === "options") return optionsSuggestion();
  return `<section class="ai-suggestion"><div class="source-row"><span class="dot"></span>Brand Voice · Confident + Educational</div><div class="reason-line">Dựa trên fingerprint brand (5 bài điểm cao) + tone Confident của campaign này — brand mình hay dùng tương phản hoặc số cụ thể để giữ người đọc tiếp tục ↓</div><div class="suggestion-text">Traffic nói với bạn có bao nhiêu người đến. Signal nói với bạn ai thực sự quan tâm — và đó là thứ tạo ra quyết định content tốt.</div><div style="display:flex;gap:8px;margin-top:12px"><button class="btn btn-primary" data-insert="Traffic nói với bạn có bao nhiêu người đến. Signal nói với bạn ai thực sự quan tâm — và đó là thứ tạo ra quyết định content tốt.">Dùng câu này</button><button class="btn" data-more-suggestions>Xem thêm</button><button class="btn btn-plain" data-dismiss-suggestion>Bỏ qua</button></div></section>`;
}

function optionsSuggestion() {
  const options = [
    ["A", "Ngắn gọn, direct", "Traffic nói có bao nhiêu người đến. Signal nói ai thực sự quan tâm — đó là thứ tạo ra quyết định tốt."],
    ["B", "Có số liệu cụ thể", "Team dùng Scribe AI báo cáo nhanh hơn 3× — vì dữ liệu và phần viết nằm cùng một chỗ, không cần ghép tay."],
    ["C", "Conversational hơn", "Bạn đang đoán bài nào work hay thực sự biết? Đó là câu hỏi Scribe AI giúp bạn trả lời — bằng data thật."],
  ];
  return `<section class="ai-suggestion"><div class="mini-label">3 lựa chọn · Chọn một hoặc tự ghép</div>${options.map(o => `<div class="option-row"><div><div class="tertiary" style="font-size:10px;margin-bottom:4px">Lựa chọn ${o[0]} · ${o[1]}</div><div style="font-size:13px;color:var(--text-secondary);line-height:1.5">${o[2]}</div></div><button class="btn" data-insert="${o[2]}">Dùng ${o[0]}</button></div>`).join("")}<div style="display:flex;gap:8px;margin-top:12px"><button class="btn" data-compose>Tự ghép</button><button class="btn btn-plain" data-dismiss-suggestion>Bỏ qua tất cả</button></div><div class="ai-request-box"><input data-ai-inline-request placeholder="Hãy cho tôi biết mong muốn của bạn" /><button type="button" data-ai-inline-send aria-label="Gửi yêu cầu">${icons.chevron.replace("chevron", "send-arrow")}</button></div>${state.customCompose ? `<div class="compose-area" style="margin-top:12px"><div class="tertiary" style="font-size:10px;margin-bottom:6px">Ghép từ các lựa chọn hoặc chỉnh theo ý bạn:</div><textarea>Traffic nói với bạn có bao nhiêu người đến. Signal nói với bạn ai thực sự quan tâm</textarea><div style="display:flex;gap:8px;margin-top:8px"><button class="btn btn-primary" data-insert-custom>Dùng câu này</button><button class="btn" data-compose-cancel>Hủy</button></div></div>` : ""}</section>`;
}

function aiChatPanel() {
  const answer = state.aiChatAnswer ? `<div class="chat-message ai">
    <div class="chat-label">Scribe AI · đang dùng Brand Voice</div>
    <p>Mình đang tập trung vào ${state.aiFocusLabel}. Gợi ý theo giọng Confident + Educational:</p>
    <div class="chat-suggestion">Signal không chỉ cho biết bài nào có traffic. Nó cho biết đoạn nào khiến người đọc dừng lại, quay lại, và sẵn sàng làm bước tiếp theo.</div>
    <p>Bạn muốn mình đưa câu này vào đúng vị trí đang focus không?</p>
    <div class="chat-actions"><button class="btn btn-primary" data-chat-apply>Có, đưa vào</button><button class="btn" data-chat-decline>Không</button></div>
  </div>` : `<div class="chat-message ai"><div class="chat-label">Scribe AI</div><p>AI đã nhận đúng ngữ cảnh: ${state.aiFocusLabel}. Bạn muốn chỉnh tone, thêm ý, rút gọn, hay viết tiếp đoạn này?</p></div>`;
  return `<aside class="ai-chat-panel">
    <div class="ai-chat-header"><div>${icons.sparkles}<span>Chat với AI</span></div><button class="btn btn-plain" data-close-ai-chat>${icons.close}</button></div>
    <div class="ai-chat-body">
      <div class="chat-context">Đang focus: <strong>${state.aiFocusLabel}</strong></div>
      <div class="chat-message user">${state.aiChatInput || "Tôi muốn AI đề xuất thêm theo đúng giọng brand voice."}</div>
      ${answer}
    </div>
    <div class="ai-chat-compose">
      <textarea data-ai-chat-input placeholder="Nhập yêu cầu của bạn...">${state.aiChatInput}</textarea>
      <button class="btn btn-primary" data-ai-chat-send>${icons.sparkles}<span>Gửi</span></button>
    </div>
  </aside>`;
}

function sidePanel() {
  return `<aside class="side-panel"><div class="panel-header"><span>Brief & ngữ cảnh</span><button class="btn btn-plain" data-panel-close>${icons.close}</button></div>${brandVoiceBanner(true)}<div class="brief-tabs">${["Hướng bài","Bài hiệu quả","Pipeline"].map((t, i) => `<button class="brief-tab ${state.briefTab === i ? "active" : ""}" data-brief-tab="${i}">${t}</button>`).join("")}</div><div class="panel-body">${briefContent()}</div></aside>`;
}

function smartCard() {
  const cards = [
    ["high", icons.funnel, "CTA tốt nhất ở Awareness: 'Xem case study →'", "Điểm tín hiệu TB 74"],
    ["low", icons.file, "Góc viết: Framework thực tế · Độc giả: team content B2B 5–15 người", "Tone: Confident + Direct"],
    ["high", icons.trend, "Bài perform tốt cùng topic dùng: framework đánh số + số liệu cụ thể", "Điểm tín hiệu 92 · Lượt quay lại +40%"],
    ["high", icons.search, "Góc viết chưa được phủ: Framework từ team nhỏ — đối thủ tập trung enterprise", "Từ phân tích nội dung công khai"],
  ];
  const c = cards[state.smartIndex];
  return `<aside class="smart-card"><div class="smart-top"><div><span class="mini-label" style="margin:0">Context</span> <span class="confidence ${c[0] === "low" ? "low" : ""}">Confidence ${c[0] === "low" ? "thấp" : "cao"}</span></div><button class="btn btn-plain" data-smart-close>${icons.close}</button></div><div class="smart-content">${c[1]}<div><div>${c[2]}</div><div class="mono tertiary" style="font-size:11px;margin-top:4px">${c[3]}</div>${c[0] === "low" ? `<div class="tertiary" style="font-size:10px;font-style:italic;margin-top:4px">Fallback về brief — system không đủ context để chọn thông tin khác</div>` : ""}</div></div><div style="display:flex;gap:8px;margin-top:12px"><button class="btn" style="background:#eaf3de;color:#27500a;border:0" data-smart-close>Hữu ích</button><button class="btn" data-smart-swap>Đổi</button></div></aside>`;
}

function warmStart() {
  return `<section class="warm-start">${icons.wand.replace("icon", "icon").replace('width: 16px', "")}<h3 style="margin:12px 0 6px;font-size:14px;font-weight:500">Brand Voice AI chưa có dữ liệu</h3><p class="muted" style="max-width:320px;margin:0 auto 16px;font-size:13px;line-height:1.5">Import tối đa 5 bài team bạn thấy đúng giọng nhất. AI sẽ phân tích và bắt đầu gợi ý đúng giọng brand trong ~2 phút.</p><button class="btn btn-soft" data-import>Import bài ngay →</button><button class="btn btn-plain" style="display:block;margin:10px auto 0;text-decoration:underline" data-skip-warm>Bỏ qua — gợi ý sẽ chung chung hơn</button></section>`;
}

function importModal() {
  if (state.importStep === "loading") return `<div class="modal-overlay"><div class="import-modal" style="text-align:center"><div class="spinner" style="width:24px;height:24px;border-color:#e1f5ee;border-top-color:var(--brand);margin:0 auto 16px"></div><div style="font-size:15px;font-weight:500">Đang phân tích giọng viết...</div><div class="muted" style="font-size:13px;margin-top:6px">Khoảng 2 phút — đừng đóng cửa sổ</div><div class="progress" style="margin-top:20px"><span style="width:100%;transition:width 2s ease-out"></span></div><div class="tertiary" style="font-size:12px;margin-top:12px">Đang đọc: Scribe AI vs Google Analytics — so sánh thật...</div></div></div>`;
  if (state.importStep === "success") return `<div class="modal-overlay"><div class="import-modal" style="text-align:center;padding:64px 32px">${icons.check}<h2 class="h2" style="font-size:18px;margin-top:16px">Brand Voice fingerprint đã được tạo</h2><p class="muted" style="font-size:13px;max-width:320px;margin:8px auto 24px">AI đã học từ 2 bài — gợi ý sẽ phản ánh giọng brand của team từ bây giờ.</p><button class="btn btn-primary" data-start-writing>Bắt đầu viết →</button></div></div>`;
  return `<div class="modal-overlay"><div class="import-modal"><h2 class="h2" style="font-size:18px">Khởi động Brand Voice AI</h2><p class="muted" style="font-size:13px;margin:8px 0 20px">Chọn tối đa 5 bài đúng giọng nhất của team — AI sẽ tạo baseline fingerprint để gợi ý ngay từ đầu đã sát brand.</p><div class="brief-tabs" style="background:#fff;border-bottom:0;margin-bottom:16px">${["Link Google Docs","Link Notion","Dán nội dung"].map((t,i)=>`<button class="brief-tab ${state.importTab===i?"active":""}" data-import-tab="${i}">${t}</button>`).join("")}</div>${importTabContent()}<div style="margin-top:16px;border-top:.5px solid var(--border);padding-top:16px"><div class="tertiary" style="font-size:11px;margin-bottom:10px">${state.importArticles.length} / 5 bài đã thêm</div>${state.importArticles.map((a,i)=>`<div class="article-item"><span>${icons.file}${a}</span><button class="btn btn-plain" data-remove-article="${i}">${icons.close}</button></div>`).join("")}<div class="slot">Slot ${state.importArticles.length + 1} — tối đa 5 bài</div></div><div style="margin-top:20px;padding-top:20px;border-top:.5px solid var(--border)"><div class="tertiary" style="font-size:10px;font-style:italic;margin-bottom:14px">AI chỉ đọc nội dung bài bạn chọn — không truy cập dữ liệu khác của bạn.</div><div style="display:flex;justify-content:space-between"><button class="btn" data-close-import>Hủy</button><button class="btn btn-primary" data-analyze>Bắt đầu phân tích →</button></div></div></div></div>`;
}

function importTabContent() {
  if (state.importTab === 2) return `<textarea rows="4" placeholder="Dán nội dung bài viết vào đây..."></textarea><button class="btn" style="margin-top:8px" data-add-article>Thêm bài này</button>`;
  return `<div style="display:flex;gap:8px"><input placeholder="${state.importTab === 0 ? "https://docs.google.com/..." : "https://notion.so/..."}" /><button class="btn" data-add-article>Thêm bài</button></div>`;
}

function bind() {
  document.querySelector("[data-sidebar-toggle]")?.addEventListener("click", e => {
    e.preventDefault();
    e.stopPropagation();
    state.sidebarCollapsed = !state.sidebarCollapsed;
    render();
  });
  document.querySelectorAll("[data-nav]").forEach(el => el.addEventListener("click", e => {
    const path = el.getAttribute("data-nav");
    if (!path || path === "#") return;
    e.preventDefault();
    if (el.dataset.toast) toast(el.dataset.toast);
    navigate(path);
  }));
  document.querySelectorAll("a[href^='/']").forEach(el => el.addEventListener("click", e => {
    e.preventDefault();
    navigate(el.getAttribute("href"));
  }));
  document.querySelector("[data-dropdown='range']")?.addEventListener("click", e => {
    const menu = document.createElement("div");
    menu.className = "dropdown-menu";
    menu.innerHTML = ["7 ngày","30 ngày qua","90 ngày","Tùy chọn"].map(x => `<button class="${state.dashboardRange === x ? "selected" : ""}" data-range="${x}">${x}</button>`).join("");
    e.currentTarget.parentElement.appendChild(menu);
    menu.querySelectorAll("[data-range]").forEach(btn => btn.addEventListener("click", () => { state.dashboardRange = btn.dataset.range; render(); }));
  });
  document.querySelector("[data-export]")?.addEventListener("click", e => {
    const btn = e.currentTarget;
    btn.innerHTML = `<span class="spinner"></span>Đang xuất...`;
    setTimeout(() => { toast("Báo cáo đã xuất · Kiểm tra email của bạn"); render(); }, 1500);
  });
  document.querySelectorAll("[data-expand-row]").forEach(el => el.addEventListener("click", () => { const i = Number(el.dataset.expandRow); state.dashboardExpanded = state.dashboardExpanded === i ? null : i; render(); }));
  document.querySelectorAll("[data-planning-filter]").forEach(el => el.addEventListener("click", () => { state.planningFilter = el.dataset.planningFilter; render(); }));
  document.querySelectorAll("[data-topic]").forEach(el => el.addEventListener("click", e => { if (e.target.closest("button,a,input")) return; const id = el.dataset.topic; state.planningExpanded = state.planningExpanded === id ? null : id; render(); }));
  document.querySelectorAll("[data-approve]").forEach(el => el.addEventListener("click", e => { e.stopPropagation(); const id = el.dataset.approve; el.innerHTML = `<span class="spinner"></span>Đang tạo brief...`; setTimeout(() => { state.approved.add(id); state.planningExpanded = id; toast("Brief đã tạo · Mở trong Trình soạn thảo khi sẵn sàng"); render(); }, 1500); }));
  document.querySelectorAll("[data-reject]").forEach(el => el.addEventListener("click", e => { e.stopPropagation(); state.rejecting = el.dataset.reject; render(); }));
  document.querySelector("[data-cancel-reject]")?.addEventListener("click", e => { e.stopPropagation(); state.rejecting = null; render(); });
  document.querySelectorAll("[data-confirm-reject]").forEach(el => el.addEventListener("click", e => { e.stopPropagation(); state.rejected.add(el.dataset.confirmReject); state.rejecting = null; toast("Đã từ chối · Có thể hoàn tác trong demo bằng cách refresh"); render(); }));
  document.querySelector("[data-brief-toggle]")?.addEventListener("click", () => { state.briefOpen = !state.briefOpen; render(); });
  document.querySelectorAll("[data-brief-tab]").forEach(el => el.addEventListener("click", e => { e.stopPropagation(); state.briefTab = Number(el.dataset.briefTab); render(); }));
  document.querySelector("[data-tone-panel]")?.addEventListener("click", e => { e.stopPropagation(); state.tonePanel = !state.tonePanel; render(); });
  document.querySelectorAll("[data-tone]").forEach(el => el.addEventListener("click", e => { e.stopPropagation(); const t = el.dataset.tone; state.selectedTones.has(t) ? state.selectedTones.delete(t) : state.selectedTones.add(t); render(); }));
  document.querySelector("[data-send-tone]")?.addEventListener("click", () => { state.toneSent = true; render(); setTimeout(() => toast("Lan Hương đã duyệt tone mới: Empathetic + Direct · Gợi ý AI đã cập nhật"), 4000); });
  document.querySelector("[data-close-tone]")?.addEventListener("click", () => { state.tonePanel = false; render(); });
  document.querySelector("[data-refresh]")?.addEventListener("click", () => { toast("Vừa cập nhật · Competitor data đã refresh"); });
  document.querySelector("[data-panel]")?.addEventListener("click", () => { state.panelOpen = !state.panelOpen; render(); });
  document.querySelector("[data-panel-close]")?.addEventListener("click", () => { state.panelOpen = false; render(); });
  document.querySelector("[data-open-ai-chat]")?.addEventListener("click", () => {
    state.panelOpen = false;
    state.aiChatOpen = true;
    state.aiFocusLabel = "vùng soạn thảo hiện tại";
    state.aiChatInput = "Hãy đề xuất cách viết tiếp đoạn này theo đúng brand voice.";
    state.aiChatAnswer = false;
    render();
  });
  document.querySelectorAll("[data-ai-block]").forEach(block => {
    block.addEventListener("mouseenter", () => showInlineAiTrigger(block));
  });
  document.querySelector("[data-ai-inline-request]")?.addEventListener("keydown", e => {
    if (e.key === "Enter") {
      e.preventDefault();
      submitInlineAiRequest();
    }
  });
  document.querySelector("[data-ai-inline-send]")?.addEventListener("click", submitInlineAiRequest);
  document.querySelector("[data-close-ai-chat]")?.addEventListener("click", () => { state.aiChatOpen = false; render(); });
  document.querySelector("[data-ai-chat-send]")?.addEventListener("click", () => {
    state.aiChatInput = document.querySelector("[data-ai-chat-input]")?.value.trim() || "Hãy đề xuất thêm";
    state.aiChatAnswer = true;
    render();
  });
  document.querySelector("[data-chat-apply]")?.addEventListener("click", () => {
    state.writerBody = `${state.writerBody || ""}<p>Signal không chỉ cho biết bài nào có traffic. Nó cho biết đoạn nào khiến người đọc dừng lại, quay lại, và sẵn sàng làm bước tiếp theo.</p>`;
    state.aiChatOpen = false;
    state.aiChatAnswer = false;
    state.suggestionVisible = false;
    render();
  });
  document.querySelector("[data-chat-decline]")?.addEventListener("click", () => {
    state.aiChatAnswer = false;
    render();
  });
  document.querySelector("[data-writer-input]")?.addEventListener("input", e => {
    state.writerBody = e.currentTarget.innerHTML;
    state.suggestionVisible = false;
    state.suggestionMode = "single";
    state.customCompose = false;
    document.querySelector(".ai-suggestion")?.remove();
    if (state.suggestionTimer) clearTimeout(state.suggestionTimer);
    const typedText = e.currentTarget.textContent.trim();
    if (typedText.length > 0 && !state.autoSuggestionUsed) {
      state.suggestionTimer = setTimeout(() => {
        if (state.route === "/canvas") {
          state.suggestionVisible = true;
          state.suggestionMode = "options";
          state.autoSuggestionUsed = true;
          render();
        }
      }, 30000);
    }
  });
  document.querySelector("[data-share]")?.addEventListener("click", () => toast("Link đã được copy · Paste để chia sẻ"));
  document.querySelector("[data-publish]")?.addEventListener("click", e => { e.currentTarget.textContent = "Publishing..."; setTimeout(() => { toast("Published"); navigate("/"); }, 1000); });
  document.querySelector("[data-anchor]")?.addEventListener("click", () => { state.anchor = true; render(); setTimeout(() => { state.anchor = false; render(); }, 5000); });
  document.querySelector("[data-more-suggestions]")?.addEventListener("click", () => { state.suggestionMode = "options"; render(); });
  document.querySelectorAll("[data-insert]").forEach(el => el.addEventListener("click", () => insertSuggestion(el.dataset.insert)));
  document.querySelector("[data-insert-custom]")?.addEventListener("click", () => insertSuggestion(document.querySelector(".compose-area textarea")?.value || ""));
  document.querySelector("[data-dismiss-suggestion]")?.addEventListener("click", () => { state.suggestionVisible = false; state.autoSuggestionUsed = true; render(); });
  document.querySelector("[data-compose]")?.addEventListener("click", () => { state.customCompose = true; render(); });
  document.querySelector("[data-compose-cancel]")?.addEventListener("click", () => { state.customCompose = false; render(); });
  document.querySelector("[data-smart-close]")?.addEventListener("click", () => { state.smartVisible = false; render(); });
  document.querySelector("[data-smart-swap]")?.addEventListener("click", () => { state.smartIndex = (state.smartIndex + 1) % 4; render(); });
  document.querySelector("[data-import]")?.addEventListener("click", () => { state.importModal = true; render(); });
  document.querySelector("[data-skip-warm]")?.addEventListener("click", () => { state.warmStart = false; state.suggestionVisible = false; render(); });
  document.querySelectorAll("[data-import-tab]").forEach(el => el.addEventListener("click", () => { state.importTab = Number(el.dataset.importTab); render(); }));
  document.querySelector("[data-add-article]")?.addEventListener("click", () => { if (state.importArticles.length < 5) state.importArticles.push("Bài mới vừa thêm"); render(); });
  document.querySelectorAll("[data-remove-article]").forEach(el => el.addEventListener("click", () => { state.importArticles.splice(Number(el.dataset.removeArticle), 1); render(); }));
  document.querySelector("[data-close-import]")?.addEventListener("click", () => { state.importModal = false; render(); });
  document.querySelector("[data-analyze]")?.addEventListener("click", () => { state.importStep = "loading"; render(); setTimeout(() => { state.importStep = "success"; render(); }, 2000); });
  document.querySelector("[data-start-writing]")?.addEventListener("click", () => { state.importModal = false; state.importStep = "form"; state.warmStart = false; state.suggestionVisible = true; render(); });
}

function submitInlineAiRequest() {
  const value = document.querySelector("[data-ai-inline-request]")?.value.trim();
  if (!value) return;
  state.panelOpen = false;
  state.aiChatOpen = true;
  state.aiFocusLabel = state.aiFocusLabel || "đoạn vừa chọn";
  state.aiChatInput = value;
  state.aiChatAnswer = true;
  state.suggestionVisible = false;
  render();
}

function showInlineAiTrigger(block) {
  document.querySelector(".inline-ai-trigger")?.remove();
  const rect = block.getBoundingClientRect();
  const trigger = document.createElement("button");
  trigger.className = "inline-ai-trigger";
  trigger.innerHTML = `${icons.sparkles}<span>AI</span>`;
  trigger.style.top = `${window.scrollY + rect.top + 2}px`;
  trigger.style.left = `${window.scrollX + rect.left - 58}px`;
  document.body.appendChild(trigger);
  trigger.addEventListener("click", () => {
    state.aiFocusLabel = block.dataset.aiBlock || "đoạn vừa chọn";
    state.suggestionVisible = true;
    state.suggestionMode = "options";
    render();
  });
}

function insertSuggestion(text) {
  state.suggestionVisible = false;
  state.suggestionMode = "single";
  state.customCompose = false;
  toast("Signal học thêm +1");
  render();
  const target = document.querySelector(".inserted-text");
  if (target) target.innerHTML = `<p style="margin-top:12px">${text}</p>`;
}

window.addEventListener("popstate", () => { state.route = location.pathname; render(); });
window.addEventListener("keydown", e => { if (e.key === "Escape" && state.panelOpen) { state.panelOpen = false; render(); } });
render();
