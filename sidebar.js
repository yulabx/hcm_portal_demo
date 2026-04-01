/* ══════════════════════════════════════════════════════
   sidebar.js — 共用側邊欄（由 menu.js 的 HCM_MENU 驅動）

   用法：
     HTML: <div id="sidebar-root" data-active="xxx"></div>
     JS  : (自動初始化，或呼叫 renderSidebar('xxx'))

   activeId 對照請見 menu.js
══════════════════════════════════════════════════════ */

(function () {

  /* ── helpers ────────────────────────────────────── */

  function hasActiveChild(item, activeId) {
    return item.children && item.children.some(c => c.id === activeId);
  }

  /* ── HTML builders ──────────────────────────────── */

  function buildTopItem(item, activeId, mx) {
    const active = item.id === activeId;
    const cls = active
      ? `sb-item flex items-center gap-2.5 px-3.5 py-2 ${mx} rounded-[6px] bg-or-l cursor-pointer`
      : `sb-item flex items-center gap-2.5 px-3.5 py-2 ${mx} rounded-[6px] hover:bg-surf-2 transition-colors cursor-pointer`;
    const lblCls = active
      ? 'sb-label text-xs font-semibold text-or-d whitespace-nowrap overflow-hidden'
      : 'sb-label text-xs font-semibold text-ink-2 whitespace-nowrap overflow-hidden';
    const tag = active ? 'div' : 'a';
    const hrefAttr = active ? '' : ` href="${item.href}"`;
    return `<${tag}${hrefAttr} data-sid="${item.id}" class="${cls}">
      <span class="text-base w-5 text-center flex-shrink-0">${item.icon}</span>
      <span class="${lblCls}">${item.label}</span>
    </${tag}>`;
  }

  function buildParentItem(item, isOpen, activeId) {
    // Parent with children (e.g. 系統設定)
    const isActive = item.id === activeId || isOpen;
    const cls = isActive
      ? `sb-item flex items-center gap-2.5 px-3.5 py-2 mx-0 rounded-[6px] bg-or-l cursor-pointer`
      : `sb-item flex items-center gap-2.5 px-3.5 py-2 mx-0 rounded-[6px] hover:bg-surf-2 transition-colors cursor-pointer`;
    const lblCls = isActive
      ? 'sb-label text-xs font-semibold text-or-d whitespace-nowrap overflow-hidden'
      : 'sb-label text-xs font-semibold text-ink-2 whitespace-nowrap overflow-hidden';
    const tag = isOpen ? 'div' : 'a';
    const hrefAttr = isOpen ? '' : ` href="${item.href}"`;
    return `<${tag}${hrefAttr} data-sid="${item.id}" class="${cls}">
      <span class="text-base w-5 text-center flex-shrink-0">${item.icon}</span>
      <span class="${lblCls}">${item.label}</span>
    </${tag}>`;
  }

  function buildSubItem(item, activeId) {
    const active = item.id === activeId;
    const cls = active
      ? 'sb-item flex items-center gap-2 pl-[42px] pr-3.5 py-1.5 mx-0 rounded-[6px] bg-or-m/30 cursor-pointer'
      : 'sb-item flex items-center gap-2 pl-[42px] pr-3.5 py-1.5 mx-0 rounded-[6px] hover:bg-surf-2 transition-colors cursor-pointer';
    const lblCls = active
      ? 'sb-label text-xs font-semibold text-or-d whitespace-nowrap overflow-hidden'
      : 'sb-label text-xs text-ink-3 whitespace-nowrap overflow-hidden';
    const tag = active ? 'div' : 'a';
    const hrefAttr = active ? '' : ` href="${item.href}"`;
    return `<${tag}${hrefAttr} data-sid="${item.id}" class="${cls}"><span class="${lblCls}">${item.label}</span></${tag}>`;
  }

  /* ── renderSidebar ──────────────────────────────── */

  window.renderSidebar = function (activeId) {
    const root = document.getElementById('sidebar-root');
    if (!activeId) activeId = root?.dataset?.active || '';

    const menu = window.HCM_MENU || [];
    let sectionsHtml = '';

    menu.forEach((group, gi) => {
      // divider between groups (not before first)
      if (gi > 0) {
        sectionsHtml += `<div class="mx-3.5 my-2 h-px bg-bord"></div>`;
      }

      // section label
      if (group.section) {
        sectionsHtml += `<div class="sb-section px-3.5 pb-1.5 pt-2 text-[9px] font-bold tracking-[.16em] uppercase text-ink-4 whitespace-nowrap overflow-hidden">${group.section}</div>`;
      }

      // px-2 wrapper for items
      const mx = group.section ? 'mx-0' : 'mx-1.5';
      let itemsHtml = '';

      group.items.forEach(item => {
        if (item.children) {
          // expandable parent
          const isOpen = item.id === activeId || hasActiveChild(item, activeId);
          itemsHtml += buildParentItem(item, isOpen, activeId);
          if (isOpen) {
            itemsHtml += `<div class="flex flex-col gap-0.5 mt-0.5">`;
            item.children.forEach(child => {
              itemsHtml += buildSubItem(child, activeId);
            });
            itemsHtml += `</div>`;
          }
        } else {
          itemsHtml += buildTopItem(item, activeId, mx);
        }
      });

      const padTop = group.section ? '' : 'pt-2';
      sectionsHtml += `<div class="px-2 flex flex-col gap-0.5 ${padTop}">${itemsHtml}</div>`;
    });

    const html = `<nav id="sidebar" class="w-[220px] flex-shrink-0 bg-white border-r border-bord flex flex-col overflow-hidden z-10 transition-all">
  <div class="p-2 flex flex-col gap-0.5">
${sectionsHtml}
  </div>
  <div class="mt-auto border-t border-bord p-2">
    <button onclick="toggleSidebar()" class="sb-toggle-btn w-full flex items-center gap-2.5 px-3.5 py-2 rounded-[6px] hover:bg-surf-2 transition-colors">
      <span class="toggle-icon text-sm text-ink-4 w-5 text-center flex-shrink-0">◀</span>
      <span class="sb-label text-xs font-semibold text-ink-3 whitespace-nowrap overflow-hidden">收折選單</span>
    </button>
  </div>
</nav>`;

    if (root) root.outerHTML = html;

    // restore collapsed state
    if (localStorage.getItem('hcm_sb_collapsed') === '1') {
      document.getElementById('appBody')?.classList.add('sb-collapsed');
    }
  };

  /* ── toggleSidebar ──────────────────────────────── */
  window.toggleSidebar = function () {
    const body = document.getElementById('appBody');
    if (!body) return;
    const collapsed = body.classList.toggle('sb-collapsed');
    document.getElementById('topbar')?.classList.toggle('sb-collapsed', collapsed);
    localStorage.setItem('hcm_sb_collapsed', collapsed ? '1' : '0');
  };

  /* ── 自動初始化 ─────────────────────────────────── */
  function init() {
    const root = document.getElementById('sidebar-root');
    if (root) renderSidebar(root.dataset.active);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
