/* ════════════════════════════════════════════════════════
   DataService — 資料存取抽象層  v2

   Demo 模式：從 ./data/bundle.js 或 ./data/*.json 讀取，
              寫入存 localStorage（各實體獨立 key）。
   未來上線：只需將各 TODO 區塊換成真實 API 呼叫，
             UI 頁面的程式碼完全不用動。
════════════════════════════════════════════════════════ */

const DataService = (() => {

  /* ── 設定 ──────────────────────────────────────────── */
  const BASE = './data';  // 上線後改成 'https://api.yourapp.com'

  const LS = {
    vm     : 'hcm_vm_changes',
    pool   : 'hcm_pool_changes',
    subnet : 'hcm_subnet_changes',
    alloc  : 'hcm_alloc_changes',
  };

  /* ── 顯示名稱對照 ──────────────────────────────────── */
  const CLOUD_LABELS = { private:'私有雲', hicloud:'hiCloud', aws:'AWS' };
  const SITE_LABELS  = {
    'tp-main':'台北主中心', 'tc-dr':'台中異備中心',
    'e7-main':'東七主中心', 'tw-main':'台灣主中心',
  };

  /* ── 環境偵測 ──────────────────────────────────────── */
  const isFileProtocol = location.protocol === 'file:';

  /* ── Fetch 工具 ────────────────────────────────────── */
  async function fetchJSON(file) {
    const r = await fetch(`${BASE}/${file}`);
    if (!r.ok) throw new Error(`無法載入 ${file}（HTTP ${r.status}）`);
    return r.json();
  }

  /* ════════════════════════════════════════════════════
     Generic CRUD factory
     每種實體（vm / pool / subnet / alloc）各有一個
     localStorage key，存放 { added:[], deleted:[], updated:{} }
  ════════════════════════════════════════════════════ */
  function makeCRUD(lsKey) {
    const get = () => {
      try { return JSON.parse(localStorage.getItem(lsKey)) || { added:[], deleted:[], updated:{} }; }
      catch { return { added:[], deleted:[], updated:{} }; }
    };
    const save = c => localStorage.setItem(lsKey, JSON.stringify(c));

    /* 將 localStorage 的異動套用到 JSON 陣列上 */
    const apply = arr => {
      const c = get();
      const del = new Set(c.deleted);
      let r = arr.filter(x => !del.has(x.id));
      r = r.map(x => c.updated[x.id] ? { ...x, ...c.updated[x.id] } : x);
      return [...r, ...c.added];
    };

    return {
      apply,
      /* TODO（上線）：換成 POST /api/{entity} */
      async create(item) {
        const c = get(); c.added.push(item); save(c); return item;
      },
      /* TODO（上線）：換成 PATCH /api/{entity}/{id} */
      async update(id, patch) {
        const c = get();
        const i = c.added.findIndex(x => x.id === id);
        if (i !== -1) { c.added[i] = { ...c.added[i], ...patch }; }
        else { c.updated[id] = { ...(c.updated[id] || {}), ...patch }; }
        save(c);
      },
      /* TODO（上線）：換成 DELETE /api/{entity}/{id} */
      async delete(id) {
        const c = get();
        if (c.added.some(x => x.id === id)) { c.added = c.added.filter(x => x.id !== id); }
        else { delete c.updated[id]; if (!c.deleted.includes(id)) c.deleted.push(id); }
        save(c);
      },
      reset() { localStorage.removeItem(lsKey); },
    };
  }

  /* ── CRUD 實例 ─────────────────────────────────────── */
  const vmCRUD     = makeCRUD(LS.vm);
  const poolCRUD   = makeCRUD(LS.pool);
  const subnetCRUD = makeCRUD(LS.subnet);
  const allocCRUD  = makeCRUD(LS.alloc);

  /* ════════════════════════════════════════════════════
     buildPoolsObject
     flat JSON → vm.html / resource-pool-overview 需要的巢狀格式
  ════════════════════════════════════════════════════ */
  function buildPoolsObject({ pools, vms, allocs, projects, systems }) {
    const projectMap = Object.fromEntries(projects.map(p => [p.id, p]));
    const systemMap  = Object.fromEntries(systems.map(s => [s.id, s]));

    const normalizeVM = (v, poolEnv) => ({
      ...v,
      ram      : v.ram_gb,
      disk     : v.disk_gb,
      subnet   : v.subnet_id,
      env      : v.tags?.env   || poolEnv,
      role     : v.tags?.role  || '',
      hostname : v.hostname    || v.name,
    });

    const sumUsed = vmList => vmList.reduce(
      (a, v) => ({ cpu: a.cpu + (v.vcpu||0), mem: a.mem + (v.ram_gb||0), disk: a.disk + (v.disk_gb||0) }),
      { cpu:0, mem:0, disk:0 }
    );

    const result = {};
    for (const pool of pools) {
      const entry = {
        id      : pool.id,
        name    : pool.name,
        type    : pool.type,
        cloud   : CLOUD_LABELS[pool.cloud] || pool.cloud,
        site    : SITE_LABELS[pool.site_id] || pool.site_id,
        env     : pool.env,
        subnets : pool.subnet_ids || [],
        cpu     : { u:0, t: pool.cpu_total },
        mem     : { u:0, t: pool.mem_total_gb },
        disk    : { u:0, t: pool.disk_total_tb * 1024 }, // TB → GB
      };

      if (pool.type === 'dedicated') {
        const pvms = vms.filter(v => v.pool_id === pool.id);
        const used = sumUsed(pvms);
        entry.cpu.u = used.cpu; entry.mem.u = used.mem; entry.disk.u = used.disk;
        entry.vms = pvms.map(v => normalizeVM(v, pool.env));
      } else {
        const pallocs = allocs.filter(a => a.pool_id === pool.id);
        entry.allocs = pallocs.map(a => {
          const avms  = vms.filter(v => v.pool_id === pool.id && v.alloc_id === a.id);
          const used  = sumUsed(avms);
          const proj  = projectMap[a.project_id];
          const sys   = systemMap[a.system_id];
          return {
            id: a.id, proj: proj?.name||a.project_id, sys: sys?.name||a.system_id,
            env: a.env, quota_cpu: a.quota_cpu, quota_mem: a.quota_mem_gb,
            quota_disk: a.quota_disk_tb * 1024,
            used_cpu: used.cpu, used_mem: used.mem, used_disk: used.disk,
            vms: avms.map(v => normalizeVM(v, a.env)),
          };
        });
        const allPVMs = vms.filter(v => v.pool_id === pool.id);
        const used    = sumUsed(allPVMs);
        entry.cpu.u = used.cpu; entry.mem.u = used.mem; entry.disk.u = used.disk;
      }
      result[pool.id] = entry;
    }
    return result;
  }

  /* ── buildSubnetsArray ─────────────────────────────── */
  function buildSubnetsArray(subnets) {
    return subnets.map(s => ({
      id    : s.id,
      label : `${s.name} — ${s.cidr}`,
      cloud : CLOUD_LABELS[s.cloud] || s.cloud,
    }));
  }

  /* ════════════════════════════════════════════════════
     Public API
  ════════════════════════════════════════════════════ */
  return {

    /* ── loadAll ───────────────────────────────────────
       回傳：
         POOLS   — 巢狀格式（vm.html / resource-pool-overview 用）
         SUBNETS — 附 label 的陣列（vm.html 用）
         raw     — 套用 localStorage 後的 flat 陣列（其他頁自行轉換）
    ─────────────────────────────────────────────────── */
    async loadAll() {
      let rawPools, rawVMs, rawAllocs, rawSubnets, projects, systems;

      if (isFileProtocol || typeof HCM_BUNDLE !== 'undefined') {
        const b  = HCM_BUNDLE;
        rawPools   = b.pools;
        rawVMs     = b.vms;
        rawAllocs  = b.allocations;
        rawSubnets = b.subnets;
        projects   = b.projects;
        systems    = b.systems;
      } else {
        [rawPools, rawVMs, rawAllocs, rawSubnets, projects, systems] = await Promise.all([
          fetchJSON('pools.json'), fetchJSON('vms.json'), fetchJSON('allocations.json'),
          fetchJSON('subnets.json'), fetchJSON('projects.json'), fetchJSON('systems.json'),
        ]);
      }

      /* 套用 localStorage 異動 */
      const pools   = poolCRUD.apply(rawPools);
      const vms     = vmCRUD.apply(rawVMs);
      const allocs  = allocCRUD.apply(rawAllocs);
      const subnets = subnetCRUD.apply(rawSubnets);

      const raw = { pools, vms, allocs, subnets, projects, systems };

      return {
        POOLS   : buildPoolsObject(raw),
        SUBNETS : buildSubnetsArray(subnets),
        raw,
      };
    },

    /* ── VM CRUD ───────────────────────────────────────
       TODO（上線）：換成對應 REST API 呼叫
    ─────────────────────────────────────────────────── */
    createVM   : vmCRUD.create.bind(vmCRUD),
    updateVM   : vmCRUD.update.bind(vmCRUD),
    deleteVM   : vmCRUD.delete.bind(vmCRUD),

    /* ── Pool CRUD ─────────────────────────────────────
       傳入格式與 pools.json 一致（snake_case）
       TODO（上線）：換成對應 REST API 呼叫
    ─────────────────────────────────────────────────── */
    createPool : poolCRUD.create.bind(poolCRUD),
    updatePool : poolCRUD.update.bind(poolCRUD),
    deletePool : poolCRUD.delete.bind(poolCRUD),

    /* ── Subnet CRUD ───────────────────────────────────
       TODO（上線）：換成對應 REST API 呼叫
    ─────────────────────────────────────────────────── */
    createSubnet : subnetCRUD.create.bind(subnetCRUD),
    updateSubnet : subnetCRUD.update.bind(subnetCRUD),
    deleteSubnet : subnetCRUD.delete.bind(subnetCRUD),

    /* ── Allocation CRUD ───────────────────────────────
       TODO（上線）：換成對應 REST API 呼叫
    ─────────────────────────────────────────────────── */
    createAllocation : allocCRUD.create.bind(allocCRUD),
    updateAllocation : allocCRUD.update.bind(allocCRUD),
    deleteAllocation : allocCRUD.delete.bind(allocCRUD),

    /* ── 重置全部 demo 狀態 ─────────────────────────── */
    resetDemo() {
      vmCRUD.reset(); poolCRUD.reset(); subnetCRUD.reset(); allocCRUD.reset();
    },
  };

})();
