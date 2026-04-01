# 雲地整合平台（HCM Portal）設計文件

> 版本：v3　　最後更新：2026-04-01

---

## 目錄

1. [系統定位](#1-系統定位)
2. [頁面架構](#2-頁面架構)
3. [業務流程](#3-業務流程)
4. [資料模型](#4-資料模型)
5. [頁面功能說明](#5-頁面功能說明)
6. [設計規範](#6-設計規範)
7. [技術規格](#7-技術規格)

---

## 1. 系統定位

雲地整合平台（HCM, Hybrid Cloud Management）是一套給政府/企業 IT 部門使用的資源管理入口，涵蓋三個主要雲端環境：

| 雲端 | 說明 |
|------|------|
| 私有雲 | 自建機房，台北主中心 / 台中異備 |
| hiCloud | 中華電信政府雲，東七機房 |
| AWS | 公有雲，台灣 Region |

### 使用者角色

| 角色 | 功能範圍 |
|------|----------|
| **一般使用者** | 申請專案/系統、建立與管理 VM |
| **管理員** | 管理 Pool、分配 Allocation、審核申請 |

---

## 2. 頁面架構

```
┌─────────────────────────────────────────────────────────────┐
│           resource-pool-overview.html（資源池總覽）          │
│  所有人入口 — Cloud 維度 / 專案維度兩種視角                  │
└───────┬────────────────┬─────────────────┬──────────────────┘
        │                │                 │
        ↓                ↓                 ↓
  apply.html       vm.html          settings-pool.html
  申請專案/系統    申請與管理 VM      Pool & Subnet 管理
  （使用者）       （使用者）          （管理員）
                                          │
                                          ↓
                                   allocation.html
                                   Allocation 管理 & 審核
                                   （管理員）
```

### 側邊欄導航結構（所有頁面一致）

```
─ 資源池總覽
─ 專案維度
═════ 作業 ════
─ 申請 VM            → vm.html
─ 申請專案/系統       → apply.html
═════ 設定 ════
─ 使用者管理（待實作）
─ 系統設定
  ├ 專案管理（待實作）
  ├ 系統管理（待實作）
  ├ Pool 管理          → settings-pool.html
  └ Allocation 管理    → allocation.html
```

---

## 3. 業務流程

### 3.1 使用者申請流程

```
使用者 apply.html
  Step 1：選擇（或建立）專案
  Step 2：建立系統（1 或多個，各選 Prod / UAT 環境）
  Step 3：掛載 Pool
    ├── Dedicated Pool：選一個 → 1:1 專屬綁定此系統+環境
    └── Shared Pool：可多筆 → 申請配額（CPU / Mem / Disk）
  Step 4：預覽確認 → 送出申請（REQ-YYYYMMDD-xxx）
          ↓
管理員 allocation.html（待執行申請 tab）
  ├── 若為 Dedicated Pool → 直接執行開通，無需配額設定
  └── 若為 Shared Pool → 設定各系統的 CPU / Mem / Disk 配額 → 執行開通
          ↓
使用者 vm.html → 在已取得的 Pool 內建立 VM（即時生效，無須審核）
```

### 3.2 VM 建立流程

```
vm.html 選擇 Pool → 點「新增 VM」
  ├── Dedicated Pool：直接填寫規格，驗證 Pool 剩餘容量
  └── Shared Pool：先選擇系統配額，驗證 Allocation 剩餘量
填寫：VM 名稱 / 主機名稱 / 規格套餐 / 映像檔 / 磁碟 / Subnet / 角色 / IP / 備註
建立後：Pool 已用量 +vcpu / +ram / +disk，表格即時插入新行
```

### 3.3 Subnet 管理流程

```
管理員 settings-pool.html → Subnet 管理 tab
  → 新增 Subnet（ID / 名稱 / CIDR / 類型 / Cloud / Site）
          ↓
  Pool 管理 tab → 編輯 Pool → 勾選「可用 Subnet」
  （每個 Pool 只顯示同 Cloud 的 Subnet）
          ↓
使用者 vm.html 建立 VM → Subnet 下拉只顯示此 Pool 綁定的 Subnet
```

---

## 4. 資料模型

### 4.1 Pool

```
Pool {
  id          : string       // P01–P10（Dedicated）、S01–S03（Shared）
  name        : string
  type        : 'dedicated' | 'shared'
  cloud       : 'private' | 'hicloud' | 'aws'
  site        : string       // 台北主中心、東七、台灣 等
  env         : 'Prod' | 'UAT'
  cpu         : { t: number, u: number }   // total / used（Core）
  mem         : { t: number, u: number }   // total / used（GB）
  disk        : { t: number, u: number }   // total / used（TB）
  subnets     : string[]     // Subnet ID 清單，vm.html 建立 VM 時的選項來源
  status      : 'active' | 'inactive'
}
```

**備註**：
- `settings-pool.html` 的 disk 單位為 **TB**；`vm.html` 的 disk 單位為 **GB**（VM 層級）
- Dedicated Pool：一個 Pool 1:1 綁定一個系統+環境
- Shared Pool：一個 Pool 可被多個系統共用，各系統各自有 Allocation

### 4.2 Subnet

```
Subnet {
  id      : string       // SN01–SN10
  name    : string
  cidr    : string       // e.g., 10.10.1.0/24
  type    : 'internal' | 'dmz' | 'management' | 'public'
  cloud   : 'private' | 'hicloud' | 'aws'
  site    : string
  status  : 'active' | 'inactive'
}
```

**類型語意**：

| 類型 | 說明 | 顏色 |
|------|------|------|
| internal | 內部應用網段，VM 間互通 | 藍色 |
| dmz | 對外服務區，可存取公網 | 紅色 |
| management | 管理網段，SSH / 監控用 | 琥珀色 |
| public | 公開子網（AWS 用） | 綠色 |

### 4.3 Allocation（共享池配額記錄）

```
Allocation {
  id          : string       // A001...
  pool_id     : string       // 隸屬的 Shared Pool
  project     : string
  system      : string
  env         : 'Prod' | 'UAT'
  cpu         : number       // 分配量（Core）
  mem         : number       // 分配量（GB）
  disk        : number       // 分配量（TB）
  status      : 'active' | 'inactive'
}
```

**vm.html 的擴充版本**（含即時用量追蹤）：

```
AllocEntry {
  ...Allocation
  quota_cpu    : number   // 配額上限
  quota_mem    : number
  quota_disk   : number
  used_cpu     : number   // 已建立 VM 的實際消耗
  used_mem     : number
  used_disk    : number
  vms          : VM[]
}
```

### 4.4 VM

```
VM {
  id          : string
  name        : string       // e.g., vm-power-prod-web-01
  hostname    : string       // e.g., power-web-01（選填）
  status      : 'running' | 'stopped'
  flavor      : string       // 規格套餐 ID（private: s/m/l/xl/... ；aws: t3.medium...）
  vcpu        : number
  ram         : number       // GB
  disk        : number       // GB
  diskType    : string       // ssd / hdd / gp3 / ...
  image       : string       // e.g., ubuntu-22
  role        : string       // Web / API、Database、Cache...
  subnet      : string       // Subnet ID
  env         : 'Prod' | 'UAT'
  ip          : string       // IPv4
  note        : string       // 選填備註
}
```

### 4.5 申請單（Apply）

```
Request {
  id          : string       // REQ-YYYYMMDD-NNN
  project     : string
  systems     : string[]     // 系統名稱清單
  status      : 'pending' | 'done'
  created     : string       // YYYY-MM-DD
  note        : string
}
```

**Step 2/3 的暫存狀態**（不進 HISTORY）：

```
systems = [{ uid, name, code, envs: ['Prod', 'UAT'] }]

poolMounts = {
  'sysUid:Prod': {
    dedicated : string | null,     // Pool ID
    shared    : [{
      pool_id  : string,
      est_cpu  : number,
      est_mem  : number,
      est_disk : number
    }]
  }
}
```

---

## 5. 頁面功能說明

### 5.1 resource-pool-overview.html — 資源池總覽

**用途**：系統入口，全景展示所有 Pool 的容量狀態。

| UI 區塊 | 功能 |
|---------|------|
| KPI Strip | 5 個統計數字（Total / Dedicated / Shared / Cloud 分佈 / 環境分佈） |
| Cloud Dimension | 按 Cloud → Site → Pool 層級鑽取 |
| Project Dimension | 按專案篩選，切換 Cloud View / System View |
| Hash 路由 | 其他頁面可用 `#proj-dimension` 直接跳至專案維度 |

---

### 5.2 apply.html — 申請專案/系統

**用途**：四步驟嚮導，使用者提交資源申請。

| 步驟 | 功能 |
|------|------|
| Step 1 選擇專案 | 搜尋現有 / 建立新專案 |
| Step 2 建立系統 | 一或多個系統，各選 Prod / UAT 環境（複選） |
| Step 3 掛載 Pool | 每個系統+環境組合可選 Dedicated Pool（1:1）及多筆 Shared Pool（含配額估計） |
| Step 4 確認送出 | 摘要預覽 → 送出申請單 |
| 申請記錄 | 查看所有歷史申請狀態 |

**驗證規則**：
- Step 2：每個系統至少選一個環境
- Step 3：每個系統+環境組合至少掛載一個 Pool（Dedicated 或 Shared 擇一即可）

---

### 5.3 settings-pool.html — Pool & Subnet 管理

**用途**：管理員維護 Pool 基本設定與 Subnet 清單。

#### Pool 管理 tab

| 功能 | 說明 |
|------|------|
| 表格瀏覽 | 全部 13 個 Pool，含容量進度條 |
| 篩選 | 類型（Dedicated/Shared）× 環境（Prod/UAT）× 關鍵字搜尋 |
| 新增 Pool | ID / 名稱 / 類型 / 環境 / Cloud / Site / 容量 / 可用 Subnet |
| 編輯 Pool | 同上，ID 不可改 |
| 停用/啟用 | 二次確認對話框，停用後無法新增 Allocation 或 VM |

**Subnet 綁定**（Pool 表單的一部分）：
- 依選擇的 Cloud 自動過濾 Subnet 清單
- 勾選後，使用者在 vm.html 建立 VM 時的 Subnet 下拉即顯示此清單

#### Subnet 管理 tab

| 功能 | 說明 |
|------|------|
| 表格瀏覽 | 全部 Subnet，含 CIDR / 類型 / Cloud / Site |
| 篩選 | Cloud × 關鍵字搜尋 |
| 新增 Subnet | ID / 名稱 / CIDR / 類型 / Cloud / Site |
| 編輯 Subnet | 同上，ID 不可改 |
| 刪除 Subnet | 同時清除所有 Pool 的綁定關係 |

**預設 Subnet 清單（10 筆）**：

| Subnet ID | 名稱 | CIDR | 類型 | Cloud |
|-----------|------|------|------|-------|
| SN01 | 內部應用網段 | 10.10.1.0/24 | internal | 私有雲 |
| SN02 | DMZ 網段 | 10.10.2.0/24 | dmz | 私有雲 |
| SN03 | 管理網段 | 10.10.100.0/24 | management | 私有雲 |
| SN04 | UAT 內部網段 | 10.10.10.0/24 | internal | 私有雲 |
| SN05 | hiCloud 生產網段 | 172.16.1.0/24 | internal | hiCloud |
| SN06 | hiCloud UAT 網段 | 172.16.10.0/24 | internal | hiCloud |
| SN07 | AWS Public-A | 10.0.1.0/24 | public | AWS |
| SN08 | AWS Private-A | 10.0.2.0/24 | internal | AWS |
| SN09 | AWS Public-B | 10.0.3.0/24 | public | AWS |
| SN10 | AWS Private-B | 10.0.4.0/24 | internal | AWS |

---

### 5.4 allocation.html — Allocation 管理

**用途**：管理員分配 Shared Pool 配額、審核待執行申請。

#### Pool 配額 tab

| 功能 | 說明 |
|------|------|
| Pool 卡片 | 每個 Shared Pool 一張，含容量進度條（三色警示） |
| Allocation 表格 | 列出此 Pool 下所有系統的配額 |
| 新增 Allocation | 選擇系統 → 填 CPU/Mem/Disk 配額，即時驗證不超過剩餘容量 |
| 調整 / 移除 | 編輯或刪除已有的 Allocation |
| 容量警示 | 使用率 ≥ 85% → 紅色；70–85% → 橘色 |

#### 待執行申請 tab

| 功能 | 說明 |
|------|------|
| 申請單列表 | 來自 apply.html 送出的 pending 申請 |
| 展開詳情 | 顯示系統清單與各系統的 Pool 掛載需求 |
| 執行開通 | 設定 Shared Pool 配額後執行；Dedicated Pool 直接執行 |
| 完成標記 | 所有系統配額設定完畢後，申請單狀態改為 done |

---

### 5.5 vm.html — 申請與管理 VM

**用途**：使用者在自己擁有的 Pool 或 Allocation 配額內，自助新增/管理 VM。

| 功能 | 說明 |
|------|------|
| Pool 卡片列表 | 使用者可用的 Pool（Demo 預載：P01 Prod Ded、P02 UAT Ded、S01 Shared） |
| 環境篩選 | 全部 / Prod / UAT |
| 容量進度條 | CPU / Memory / Disk，三色警示 |
| VM 表格 | VM名稱/角色、狀態、規格、映像檔、磁碟、IP/Subnet、操作 |
| 啟動/停止 VM | 即時切換 running ↔ stopped |
| 新增 VM Modal | 見下方表單欄位說明 |
| 刪除 VM | 二次確認後移除，容量回收 |

#### 新增 VM Modal 欄位

| 欄位 | 說明 | 備註 |
|------|------|------|
| 系統配額 | Shared Pool 專用，選擇使用哪個 Allocation | 僅 Shared Pool 顯示 |
| VM 名稱 | 必填，英數字 + 連字符 | |
| 主機名稱 | 選填 | |
| 規格套餐 | 依 Cloud 類型有不同選項 | 見下表 |
| 自訂規格 | vCPU + RAM 輸入框 | 僅私有雲的「自訂」選項顯示 |
| 映像檔 | 依 Cloud 類型有不同選項 | Ubuntu/RHEL/Rocky/Windows/AMI |
| 磁碟大小 | GB | |
| 磁碟類型 | 依 Cloud：SSD/HDD / gp3/gp2/io1 等 | |
| 系統角色 | Web/API、Database、Cache 等 8 種 | |
| Subnet | 僅顯示此 Pool 綁定的 Subnet | |
| IP 位址 | IPv4 格式 | |
| 初始狀態 | Running / Stopped | 預設 Running |
| 備註 | 選填 | |
| 資源剩餘提示 | 即時顯示建立後剩餘容量，顏色警示 | 超過容量時禁用確認鈕 |

#### 規格套餐（Flavors）

**私有雲**：

| ID | vCPU | RAM |
|----|------|-----|
| S | 2 | 4 GB |
| M | 4 | 8 GB |
| L | 8 | 16 GB |
| XL | 8 | 32 GB |
| 2XL | 16 | 32 GB |
| 3XL | 16 | 64 GB |
| Mem-M | 4 | 16 GB（記憶體優化）|
| Mem-L | 8 | 64 GB（記憶體優化）|
| 自訂 | — | 手動輸入 |

**hiCloud**：c1.small(1/2) → c1.2xlarge(8/16)、m1.medium(2/4) → m1.2xlarge(8/32)

**AWS**：t3.medium/large、m5.large/xlarge/2xlarge、r5.large/xlarge、c5.large/xlarge/2xlarge

---

## 6. 設計規範

### 6.1 色彩系統

| Token | 預設值 | 用途 |
|-------|--------|------|
| `or` | #ea580c | 主色、強調、CTA 按鈕 |
| `ded` | #2563eb | Dedicated Pool、藍色系元素 |
| `shr` | #0d9488 | Shared Pool、青色系元素 |
| `grn` | #16a34a | Prod 環境、Active 狀態、成功 |
| `pur` | #7c3aed | UAT 環境 |
| `red` | #dc2626 | 錯誤、停用、容量超限 |
| `amb` | #d97706 | 容量警告（70–85%）|
| `ink` | #0f0f0f | 主要文字 |
| `surf` | #ffffff / #f7f8fa | 背景層 |
| `bord` | #e8e8e8 / #d4d4d4 | 邊框 |

每個語意色有三個變體：`.l`（背景淺色）、`.m`（邊框中色）、`.DEFAULT`（文字深色）。

### 6.2 字體

| 用途 | 字體 |
|------|------|
| 介面文字 | Plus Jakarta Sans + Noto Sans TC |
| 程式碼 / ID / IP | Fira Code |

### 6.3 間距與圓角

| 元素 | 圓角 |
|------|------|
| 小徽章、Tag | 3–4px |
| 按鈕、Input | 6px |
| 卡片、Table 容器 | 8px |
| Modal | 10–12px |
| 全圓（Avatar、進度條）| 99px |

### 6.4 容量進度條顏色規則

| 使用率 | 顏色 |
|--------|------|
| < 70% | 綠色（`#16a34a`）|
| 70–85% | 橘色（`#d97706`）|
| ≥ 85% | 紅色（`#dc2626`）|

### 6.5 動畫

| 動畫 | 說明 |
|------|------|
| `fadeUp` | 元素出現，opacity 0→1 + translateY(6px)→0，22ms |
| `modalIn` | Modal 彈出，opacity + translateY(10px) + scale(.98)，20ms |
| Sidebar 收折 | width 220px→52px，transition 250ms cubic-bezier(.23,1,.32,1) |

---

## 7. 技術規格

### 技術棧

| 項目 | 選擇 |
|------|------|
| HTML | HTML5 |
| CSS | Tailwind CSS v3（CDN） |
| JavaScript | Vanilla JS（ES6+），無框架 |
| 字體 | Google Fonts CDN |
| 資料儲存 | In-memory（頁面內 JS 變數），無後端 |

### 重要設計決策

**1. 資料不跨頁共享**
每個 HTML 檔案各自嵌入 Mock 資料。若要實作跨頁共享（如 `apply.html` 送出申請後 `allocation.html` 即時出現），需改用 `localStorage` 或後端 API。

**2. Subnet 與 Pool 的關聯方式**
- `settings-pool.html` 用 `SN01–SN10` 作為 Subnet ID
- `vm.html` 用 `sn-priv-internal` 等較語意化的 ID
- 兩者目前為各自獨立的 Mock 資料，若串接應統一採用同一套 ID 體系

**3. 環境（Env）只有 Prod / UAT**
DR（異地備援）是 Site 的概念，在 Pool 的 `site` 欄位體現（例：台中異備），不作為獨立環境。

**4. Shared Pool 配額追蹤位置**
- `vm.html` 在 `allocs[].used_cpu/mem/disk` 追蹤即時消耗
- `allocation.html` 在 `ALLOCS[].cpu/mem/disk` 追蹤分配量
- 兩者語意不同：前者是 VM 實際用量，後者是管理員核配的上限額度

### 已知限制 / 待改善

| 項目 | 說明 |
|------|------|
| 跨頁資料同步 | 各頁面 Mock 資料獨立，無法即時反映其他頁面的操作 |
| Subnet ID 不統一 | settings-pool.html（SN01...）與 vm.html（sn-priv-internal...）格式不同 |
| 使用者管理 | 側邊欄有入口但功能未實作 |
| 專案管理 / 系統管理 | 側邊欄有入口但功能未實作 |
| 表單驗證 | IP 格式、CIDR 格式僅文字提示，未做正規表達式驗證 |
| 響應式 | 主要針對 1280px+ 桌面設計，行動版未最佳化 |
