/* ══════════════════════════════════════════════════════
   menu.js — 側邊欄選單設定（唯一定義來源）

   要新增/刪除/改名選單項目：只改這個檔案
   sidebar.js 讀取此設定自動渲染
══════════════════════════════════════════════════════ */
window.HCM_MENU = [
  {
    items: [
      { id:'pool-overview',  icon:'🗄', label:'資源池總覽', href:'resource-pool-overview.html' },
      { id:'proj-dimension', icon:'📁', label:'專案維度',    href:'proj-dimension.html' },
    ]
  },
  {
    section: '作業',
    items: [
      { id:'vm',    icon:'🖥', label:'申請 VM',        href:'vm.html' },
      { id:'apply', icon:'📋', label:'申請專案/系統', href:'apply.html' },
    ]
  },
  {
    section: '設定',
    items: [
      { id:'user-mgmt', icon:'👥', label:'使用者管理', href:'#' },
      {
        id:'settings', icon:'⚙️', label:'系統設定', href:'settings-pool.html',
        children: [
          { id:'settings-project', label:'專案管理',        href:'#' },
          { id:'settings-system',  label:'系統管理',        href:'#' },
          { id:'settings-pool',    label:'Pool 管理',       href:'settings-pool.html' },
          { id:'settings-alloc',   label:'Allocation 管理', href:'allocation.html' },
        ]
      }
    ]
  }
];
