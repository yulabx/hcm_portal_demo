# 雲地整合平台 — Resource Pool Portal 規劃文件

> 版本：v1.0　整理日期：2026-03-31

---

## 一、背景與目標

目前 v14 介面為**純瀏覽（read-only）**，涵蓋資源池總覽與專案維度兩個頁面。  
本次規劃目標是在現有基礎上，補齊**申請流程**與**管理員設定**兩大功能模組，讓整個 Portal 能夠實際運作。

---

## 二、核心概念與層級關係

```
專案 Project
└── 系統 System（一個專案可有多個系統）
    ├── 掛載 Dedicated Pool（獨佔，直接含 VM）
    └── 掛載 Shared Pool（共用，需分配 Allocation 配額）
```

### 重要規則

- 一個系統可以**同時掛多個 Pool**，Dedicated 與 Shared 可混用
- Shared Pool 有**總容量上限**（由管理員建立時設定）
- 各系統從 Shared Pool 取得的配額稱為 **Allocation**，所有 Allocation 加總不可超過 Pool 總量
- 申請流程**不含審核**，使用者送出後由管理員直接執行開通

---

## 三、實體資料結構

### 3.1 Project
| 欄位 | 說明 |
|------|------|
| id | 專案代碼，例如 `PROJ-001` |
| name | 專案名稱，例如「電發專案」 |
| owner | 負責人 |
| dept | 所屬部門 |
| status | active / inactive |

### 3.2 System
| 欄位 | 說明 |
|------|------|
| id | 系統代碼，例如 `SYS-001` |
| project_id | 所屬專案 |
| name | 系統名稱，例如「ERP」 |
| env | Prod / UAT |
| status | active / inactive |

### 3.3 Pool（現有，需補欄位）
| 欄位 | 說明 |
|------|------|
| id | Pool ID，例如 `P01`、`S01` |
| name | Pool 名稱 |
| type | `dedicated` / `shared` |
| cloud | 所屬雲端，例如 `private`、`hicloud`、`aws` |
| site | 所屬站點 |
| env | Prod / UAT |
| cpu.t | CPU 總量（Core） |
| mem.t | Memory 總量（GB） |
| disk.t | Disk 總量（TB） |
| cpu.u | CPU 已使用 |
| mem.u | Memory 已使用 |
| disk.u | Disk 已使用 |
| status | active / inactive |

### 3.4 Allocation（Shared Pool 專用）
| 欄位 | 說明 |
|------|------|
| id | Allocation ID |
| pool_id | 對應的 Shared Pool |
| system_id | 對應的系統 |
| quota_cpu | 分配 CPU（Core） |
| quota_mem | 分配 Memory（GB） |
| quota_disk | 分配 Disk（TB） |
| created_at | 建立時間 |

### 3.5 ApplicationRequest（申請單）
| 欄位 | 說明 |
|------|------|
| id | 申請單編號 |
| applicant | 申請人 |
| project | 專案資訊（新建或既有） |
| systems | 系統清單（含每個系統要掛的 Pool） |
| note | 需求說明 |
| status | pending / done |
| created_at | 申請時間 |
| executed_at | 管理員執行時間 |

---

## 四、頁面與功能清單

### 4.1 現有頁面（不動）

| 頁面 | 說明 |
|------|------|
| 資源池總覽 | Cloud → Site → Pool 三層瀏覽，資源使用率，VM / Allocation 清單 |
| 專案維度 | 以專案為主軸，切換 Cloud View / Sys View，純瀏覽 |

---

### 4.2 申請頁（新增）

側邊欄入口：**申請**（現有「申請 VM」擴充為通用申請入口）

#### 功能一：申請 Wizard（Step 1–3）

**Step 1 — 選擇 / 建立專案**
- 搜尋現有專案（輸入名稱或代碼）
- 若無則填表新建：名稱、代碼、負責人、部門

**Step 2 — 建立系統**
- 填寫系統名稱、代碼、環境（Prod / UAT）
- 可在同一申請單新增多個系統

**Step 3 — 掛載 Pool**
- 針對每個系統，選擇要掛的 Pool
- Pool 類型：Dedicated（直接建立）或 Shared（選現有 Pool）
- 同一系統可掛多個 Pool（Dedicated + Shared 混用）
- Shared Pool：顯示目前剩餘容量供參考，使用者填寫需求說明
- 送出前顯示申請摘要頁，確認後送出

#### 功能二：申請記錄列表
- 列出所有申請單
- 顯示狀態：待執行 / 已完成
- 可查看申請單詳情

---

### 4.3 設定頁 — 管理員（新增）

側邊欄入口：**系統設定**（現有入口，新增以下子功能）

#### 功能三：專案管理
- 列表顯示所有專案
- 新增 / 編輯 / 停用專案

#### 功能四：系統管理
- 列表顯示所有系統（可依專案篩選）
- 新增 / 編輯 / 停用系統
- 顯示每個系統目前掛載的 Pool

#### 功能五：Pool 管理
- 列表顯示所有 Pool（Dedicated + Shared）
- **新增 Pool**：填寫 Cloud、Site、類型、總容量（CPU / Mem / Disk）
- 編輯 / 擴容 / 停用 Pool
- Shared Pool 顯示已分配配額 vs 總量

#### 功能六：Allocation 管理
- 列表顯示所有 Shared Pool 的配額分配狀況
- 對應申請單，為系統設定實際配額（CPU / Mem / Disk）
- 即時顯示 Pool 剩餘容量，防止超配
- 執行後寫入 Allocation，申請單狀態更新為「已完成」

---

## 五、完整申請流程

### 5.1 初次申請（全新專案 + 系統）

```
使用者
  → 申請頁 Wizard Step 1：建立專案
  → Step 2：建立系統（可多筆）
  → Step 3：每個系統掛 Pool（Dedicated or Shared，可多個）
  → 送出申請單

管理員
  → 設定頁 Pool 管理：若 Shared Pool 尚未建立，先建立並設定總容量
  → Allocation 管理：看到申請單，為 Shared Pool 分配配額
  → 按「執行」→ 系統開通，申請單標記完成
```

### 5.2 新增系統（專案已存在）

```
使用者
  → 申請頁 Wizard Step 1：搜尋選取既有專案
  → Step 2：建立新系統
  → Step 3：掛 Pool
  → 送出
```

### 5.3 補掛 Pool（系統已存在）

```
使用者
  → 申請頁 Wizard Step 1：選取既有專案
  → Step 2：選取既有系統（不新建）
  → Step 3：掛新的 Pool
  → 送出
```

---

## 六、Shared Pool 容量邏輯

```
Pool 總量（cpu.t）
  └── 已分配 = Σ 所有系統的 quota_cpu
  └── 剩餘 = cpu.t - 已分配

規則：新增 Allocation 時，分配量 ≤ 剩餘容量
```

管理員在 Allocation 管理頁執行時，系統應即時檢查並阻擋超配。

---

## 七、開發優先順序建議

| 階段 | 功能 | 說明 |
|------|------|------|
| P1 | Pool 管理（設定頁） | 先讓管理員能建 Shared Pool，有資料才能繼續 |
| P1 | 申請 Wizard Step 1–3 | 主要使用者流程 |
| P1 | Allocation 管理 | 管理員執行開通的核心操作 |
| P2 | 申請記錄列表 | 讓使用者追蹤狀態 |
| P3 | 專案管理、系統管理 | CRUD 後台，管理員維護資料用 |

---

## 八、UI 設計待規劃頁面

依開發優先順序，以下頁面需設計 UI：

1. **設定頁 → Pool 管理**：列表 + 新增/編輯 Modal
2. **申請頁 → Wizard**：Step 1 / Step 2 / Step 3 / 摘要確認
3. **設定頁 → Allocation 管理**：Shared Pool 配額分配表
4. **申請頁 → 申請記錄**：列表 + 詳情
5. **設定頁 → 專案管理 / 系統管理**：CRUD 列表

---

*本文件為規劃階段產出，實際開發時各欄位與流程細節依實作調整。*
