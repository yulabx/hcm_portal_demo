# Resource Pool / Project / System 設計模型

---

# 🎯 一、設計目標

本模型用來同時支援兩種實務情境：

1. **Dedicated（專案專屬資源池）**
2. **Shared（多專案共用資源池）**

並達到：
- 架構清楚（不混維度）
- 支援多雲 / DR / 多環境
- 可擴充（配額 / 成本 / 權限）

---

# 🧠 二、核心觀念（先看這段就懂）

## 👉 三個維度（不要混成一條）

### 1️⃣ 資源供給（Infrastructure）
```
Cloud → Region → Site → Resource Pool
```

### 2️⃣ 使用需求（Application）
```
Project → System → Environment
```

### 3️⃣ 關聯（核心）
```
Resource Pool ↔ Allocation ↔ System
```

---

## 🔥 關鍵一句話

> Resource Pool 是供給，System 是需求，Allocation 是連接兩者的核心

---

# 🧱 三、資料結構（標準模型）

## 1️⃣ Project

| 欄位 | 說明 |
|------|------|
| project_id | 專案代碼 |
| project_name | 專案名稱 |

---

## 2️⃣ System

| 欄位 | 說明 |
|------|------|
| system_id | 系統代碼 |
| system_name | 系統名稱 |
| project_id | 所屬專案 |

---

## 3️⃣ Resource Pool

| 欄位 | 說明 |
|------|------|
| pool_id | 資源池代碼 |
| pool_name | 名稱 |
| cloud | 雲別 |
| region | 區域 |
| site | 站點（主中心 / DR） |
| pool_type | dedicated / shared |

---

## 4️⃣ Allocation（最重要）

| 欄位 | 說明 |
|------|------|
| allocation_id | 關聯ID |
| pool_id | 使用的資源池 |
| project_id | 專案 |
| system_id | 系統 |
| environment | Prod / UAT |
| usage_type | exclusive / shared |
| role | primary / dr |

- usage_type：是否為共用資源（exclusive=專用, shared=共用）
- role：部署角色（primary=主用, dr=備援）

---

# 🧾 四、案例一：Dedicated（你原始那張表）

## 📌 情境
- 單一專案：電發專案
- 系統：電發、允獎APP
- 每個環境都有**專用資源池**
- 多雲（私有雲 / hiCloud / AWS）
- 有主中心（台北）＋ DR（台中）

---

## Project

| id | name |
|---|---|
| PRJ-POWER | 電發專案 |

---

## System

| id | name |
|---|---|
| SYS-POWER | 電發 |
| SYS-APP | 允獎APP |

---

## Resource Pool（完整對應你原表）

| pool_id | cloud | region | site | name | type |
|--------|-------|--------|------|------|------|
| P01 | 私有雲 | 台北 | 主中心 | 電發私有雲主中心-Prod | dedicated |
| P02 | 私有雲 | 台北 | 主中心 | 電發私有雲主中心-UAT | dedicated |
| P03 | 私有雲 | 台中 | 異備dr | 電發私有雲異備主中心-Prod | dedicated |
| P04 | 私有雲 | 台中 | 異備dr | 電發私有雲異備主中心-UAT | dedicated |
| P05 | hiCloud | 東七 | 主中心 | 電發hicloud-Prod | dedicated |
| P06 | hiCloud | 東七 | 主中心 | 電發hicloud-UAT | dedicated |
| P07 | hiCloud | 東七 | 主中心 | 兌獎APP hicloud-Prod | dedicated |
| P08 | hiCloud | 東七 | 主中心 | 兌獎APP hicloud-UAT | dedicated |
| P09 | AWS | 台灣 | 主中心 | 電發AWS-Prod | dedicated |
| P10 | AWS | 台灣 | 主中心 | 電發AWS-UAT | dedicated |

---

## Allocation

| pool | system | env | usage_type | role |
|------|--------|-----|-----------|------|
| P01 | 電發 | Prod | exclusive | primary |
| P02 | 電發 | UAT | exclusive | primary |
| P03 | 電發 | Prod | exclusive | dr |
| P04 | 電發 | UAT | exclusive | dr |
| P05 | 電發 | Prod | exclusive | primary |
| P06 | 電發 | UAT | exclusive | primary |
| P07 | 允獎APP | Prod | exclusive | primary |
| P08 | 允獎APP | UAT | exclusive | primary |
| P09 | 電發 | Prod | exclusive | primary |
| P10 | 電發 | UAT | exclusive | primary |

---

## 🧠 解讀

- Pool = 專案資源
- 幾乎是一對一
- 部署固定、清楚

---

# 🧾 五、案例二：Shared（一科～四科）

## 📌 情境
- 每個科 = 一個專案
- 共用平台資源池
- 透過申請使用

---

## Project

| id | name |
|---|---|
| PRJ-1 | 一科 |
| PRJ-2 | 二科 |
| PRJ-3 | 三科 |
| PRJ-4 | 四科 |

---

## System

| system | project |
|--------|--------|
| 系統A | 一科 |
| 系統B | 二科 |
| 系統C | 三科 |
| 系統D | 四科 |

---

## Resource Pool（共用）

| pool_id | cloud | region | site | name | type |
|--------|-------|--------|------|------|------|
| S01 | 私有雲 | 台北 | 主中心 | 共用-Prod | shared |
| S02 | 私有雲 | 台中 | DR | 共用-DR | shared |
| S03 | hiCloud | 東七 | 主中心 | 共用-Cloud | shared |

---

## Allocation（已修正）

| pool | project | system | env | usage_type | role |
|------|--------|--------|-----|-----------|------|
| S01 | 一科 | 系統A | Prod | shared | primary |
| S01 | 二科 | 系統B | Prod | shared | primary |
| S03 | 三科 | 系統C | Prod | shared | primary |
| S03 | 四科 | 系統D | UAT | shared | primary |
| S02 | 一科 | 系統A | Prod | shared | dr |

---

## 🧠 解讀

- 一個 pool → 多個專案
- 多對多關係
- 需要治理（配額 / 申請）

---

# ⚖️ 六、差異總結

| 項目 | Dedicated | Shared |
|------|----------|--------|
| Pool關係 | 一對一 | 多對多 |
| 使用方式 | 固定 | 申請 |
| 適用 | 專案型 | 平台型 |

---

# 🧠 七、最終設計結論

👉 不要選其中一種模型  
👉 正確做法是：

```
Resource Pool（中立）
        ↓
Allocation（彈性）
        ↓
Project / System / Environment
```

---

# 📌 最終一句話

**用 Resource Pool 管資源，用 Project/System 管需求，用 Allocation 管關係。**
