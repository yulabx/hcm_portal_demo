/* ════════════════════════════════════════════════════════
   HCM_BUNDLE — 靜態資料包
   用途：本地直接開啟 HTML（file:// 協定）時的備援資料來源。
   GitHub Pages 等 HTTP 環境會優先使用 fetch JSON 檔案。

   ⚠ 此檔案由 JSON 檔案手動同步，資料修改請同時更新
     對應的 data/*.json 與此檔案。
════════════════════════════════════════════════════════ */
const HCM_BUNDLE = {

pools: [
  { "id":"P01","name":"電發私有雲主中心-Prod","type":"dedicated","cloud":"private","site_id":"tp-main","env":"Prod","site_role":"primary","project_id":"PROJ-001","system_id":"SYS-001","cpu_total":120,"mem_total_gb":256,"disk_total_tb":10,"subnet_ids":["SN01","SN02","SN03"],"status":"active" },
  { "id":"P02","name":"電發私有雲主中心-UAT","type":"dedicated","cloud":"private","site_id":"tp-main","env":"UAT","site_role":"primary","project_id":"PROJ-001","system_id":"SYS-001","cpu_total":40,"mem_total_gb":128,"disk_total_tb":5,"subnet_ids":["SN03","SN04"],"status":"active" },
  { "id":"P03","name":"電發私有雲異備-Prod","type":"dedicated","cloud":"private","site_id":"tc-dr","env":"Prod","site_role":"dr","project_id":"PROJ-001","system_id":"SYS-001","cpu_total":80,"mem_total_gb":256,"disk_total_tb":10,"subnet_ids":[],"status":"active" },
  { "id":"P04","name":"電發私有雲異備-UAT","type":"dedicated","cloud":"private","site_id":"tc-dr","env":"UAT","site_role":"dr","project_id":"PROJ-001","system_id":"SYS-001","cpu_total":40,"mem_total_gb":128,"disk_total_tb":5,"subnet_ids":[],"status":"active" },
  { "id":"P05","name":"電發 hiCloud-Prod","type":"dedicated","cloud":"hicloud","site_id":"e7-main","env":"Prod","site_role":"primary","project_id":"PROJ-001","system_id":"SYS-001","cpu_total":80,"mem_total_gb":192,"disk_total_tb":8,"subnet_ids":["SN05"],"status":"active" },
  { "id":"P06","name":"電發 hiCloud-UAT","type":"dedicated","cloud":"hicloud","site_id":"e7-main","env":"UAT","site_role":"primary","project_id":"PROJ-001","system_id":"SYS-001","cpu_total":32,"mem_total_gb":64,"disk_total_tb":3,"subnet_ids":["SN06"],"status":"active" },
  { "id":"P07","name":"兌獎APP hiCloud-Prod","type":"dedicated","cloud":"hicloud","site_id":"e7-main","env":"Prod","site_role":"primary","project_id":"PROJ-001","system_id":"SYS-002","cpu_total":32,"mem_total_gb":64,"disk_total_tb":2,"subnet_ids":["SN05"],"status":"active" },
  { "id":"P08","name":"兌獎APP hiCloud-UAT","type":"dedicated","cloud":"hicloud","site_id":"e7-main","env":"UAT","site_role":"primary","project_id":"PROJ-001","system_id":"SYS-002","cpu_total":16,"mem_total_gb":32,"disk_total_tb":1,"subnet_ids":["SN06"],"status":"active" },
  { "id":"P09","name":"電發 AWS-Prod","type":"dedicated","cloud":"aws","site_id":"tw-main","env":"Prod","site_role":"primary","project_id":"PROJ-001","system_id":"SYS-001","cpu_total":64,"mem_total_gb":128,"disk_total_tb":5,"subnet_ids":["SN07","SN08"],"status":"active" },
  { "id":"P10","name":"電發 AWS-UAT","type":"dedicated","cloud":"aws","site_id":"tw-main","env":"UAT","site_role":"primary","project_id":"PROJ-001","system_id":"SYS-001","cpu_total":24,"mem_total_gb":48,"disk_total_tb":2,"subnet_ids":["SN07","SN08","SN09","SN10"],"status":"active" },
  { "id":"S01","name":"共用私有雲主中心-Prod","type":"shared","cloud":"private","site_id":"tp-main","env":"Prod","site_role":"primary","project_id":null,"system_id":null,"cpu_total":200,"mem_total_gb":384,"disk_total_tb":15,"subnet_ids":["SN01","SN02","SN03"],"status":"active" },
  { "id":"S02","name":"共用私有雲異備-Prod","type":"shared","cloud":"private","site_id":"tc-dr","env":"Prod","site_role":"dr","project_id":null,"system_id":null,"cpu_total":120,"mem_total_gb":256,"disk_total_tb":10,"subnet_ids":[],"status":"active" },
  { "id":"S03","name":"共用 hiCloud-Prod","type":"shared","cloud":"hicloud","site_id":"e7-main","env":"Prod","site_role":"primary","project_id":null,"system_id":null,"cpu_total":160,"mem_total_gb":320,"disk_total_tb":12,"subnet_ids":["SN05"],"status":"active" }
],

vms: [
  { "id":"VM-001","name":"vm-power-prod-01","pool_id":"P01","alloc_id":null,"status":"running","vcpu":8,"ram_gb":32,"disk_gb":500,"ip":"10.10.1.11","subnet_id":"SN01","tags":{"project_id":"PROJ-001","system_id":"SYS-001","env":"Prod","role":"app"} },
  { "id":"VM-002","name":"vm-power-prod-02","pool_id":"P01","alloc_id":null,"status":"running","vcpu":8,"ram_gb":32,"disk_gb":500,"ip":"10.10.1.12","subnet_id":"SN01","tags":{"project_id":"PROJ-001","system_id":"SYS-001","env":"Prod","role":"app"} },
  { "id":"VM-003","name":"vm-power-prod-db","pool_id":"P01","alloc_id":null,"status":"running","vcpu":16,"ram_gb":64,"disk_gb":2000,"ip":"10.10.1.20","subnet_id":"SN01","tags":{"project_id":"PROJ-001","system_id":"SYS-001","env":"Prod","role":"db"} },
  { "id":"VM-004","name":"vm-power-prod-gw","pool_id":"P01","alloc_id":null,"status":"running","vcpu":4,"ram_gb":16,"disk_gb":100,"ip":"10.10.2.5","subnet_id":"SN02","tags":{"project_id":"PROJ-001","system_id":"SYS-001","env":"Prod","role":"gateway"} },
  { "id":"VM-005","name":"vm-power-uat-01","pool_id":"P02","alloc_id":null,"status":"running","vcpu":8,"ram_gb":32,"disk_gb":200,"ip":"10.10.10.11","subnet_id":"SN04","tags":{"project_id":"PROJ-001","system_id":"SYS-001","env":"UAT","role":"app"} },
  { "id":"VM-006","name":"vm-power-uat-db","pool_id":"P02","alloc_id":null,"status":"stopped","vcpu":8,"ram_gb":32,"disk_gb":500,"ip":"10.10.10.20","subnet_id":"SN04","tags":{"project_id":"PROJ-001","system_id":"SYS-001","env":"UAT","role":"db"} },
  { "id":"VM-007","name":"vm-power-dr-01","pool_id":"P03","alloc_id":null,"status":"running","vcpu":8,"ram_gb":32,"disk_gb":500,"ip":"10.20.1.11","subnet_id":null,"tags":{"project_id":"PROJ-001","system_id":"SYS-001","env":"Prod","role":"app"} },
  { "id":"VM-008","name":"vm-power-dr-db","pool_id":"P03","alloc_id":null,"status":"running","vcpu":16,"ram_gb":64,"disk_gb":2000,"ip":"10.20.1.20","subnet_id":null,"tags":{"project_id":"PROJ-001","system_id":"SYS-001","env":"Prod","role":"db"} },
  { "id":"VM-009","name":"vm-power-dr-uat-01","pool_id":"P04","alloc_id":null,"status":"stopped","vcpu":8,"ram_gb":32,"disk_gb":200,"ip":"10.20.2.11","subnet_id":null,"tags":{"project_id":"PROJ-001","system_id":"SYS-001","env":"UAT","role":"app"} },
  { "id":"VM-010","name":"vm-hic-power-prod-01","pool_id":"P05","alloc_id":null,"status":"running","vcpu":8,"ram_gb":32,"disk_gb":500,"ip":"172.16.1.11","subnet_id":"SN05","tags":{"project_id":"PROJ-001","system_id":"SYS-001","env":"Prod","role":"app"} },
  { "id":"VM-011","name":"vm-hic-power-prod-02","pool_id":"P05","alloc_id":null,"status":"running","vcpu":8,"ram_gb":32,"disk_gb":500,"ip":"172.16.1.12","subnet_id":"SN05","tags":{"project_id":"PROJ-001","system_id":"SYS-001","env":"Prod","role":"app"} },
  { "id":"VM-012","name":"vm-hic-power-prod-db","pool_id":"P05","alloc_id":null,"status":"running","vcpu":16,"ram_gb":64,"disk_gb":2000,"ip":"172.16.1.20","subnet_id":"SN05","tags":{"project_id":"PROJ-001","system_id":"SYS-001","env":"Prod","role":"db"} },
  { "id":"VM-013","name":"vm-hic-power-uat-01","pool_id":"P06","alloc_id":null,"status":"running","vcpu":8,"ram_gb":32,"disk_gb":200,"ip":"172.16.10.11","subnet_id":"SN06","tags":{"project_id":"PROJ-001","system_id":"SYS-001","env":"UAT","role":"app"} },
  { "id":"VM-014","name":"vm-hic-app-prod-01","pool_id":"P07","alloc_id":null,"status":"running","vcpu":8,"ram_gb":32,"disk_gb":500,"ip":"172.16.1.31","subnet_id":"SN05","tags":{"project_id":"PROJ-001","system_id":"SYS-002","env":"Prod","role":"app"} },
  { "id":"VM-015","name":"vm-hic-app-prod-db","pool_id":"P07","alloc_id":null,"status":"running","vcpu":8,"ram_gb":16,"disk_gb":500,"ip":"172.16.1.32","subnet_id":"SN05","tags":{"project_id":"PROJ-001","system_id":"SYS-002","env":"Prod","role":"db"} },
  { "id":"VM-016","name":"vm-hic-app-uat-01","pool_id":"P08","alloc_id":null,"status":"stopped","vcpu":4,"ram_gb":16,"disk_gb":200,"ip":"172.16.10.31","subnet_id":"SN06","tags":{"project_id":"PROJ-001","system_id":"SYS-002","env":"UAT","role":"app"} },
  { "id":"VM-017","name":"ec2-power-prod-01","pool_id":"P09","alloc_id":null,"status":"running","vcpu":8,"ram_gb":32,"disk_gb":500,"ip":"10.0.2.11","subnet_id":"SN08","tags":{"project_id":"PROJ-001","system_id":"SYS-001","env":"Prod","role":"app"} },
  { "id":"VM-018","name":"ec2-power-prod-db","pool_id":"P09","alloc_id":null,"status":"running","vcpu":16,"ram_gb":64,"disk_gb":2000,"ip":"10.0.2.20","subnet_id":"SN08","tags":{"project_id":"PROJ-001","system_id":"SYS-001","env":"Prod","role":"db"} },
  { "id":"VM-019","name":"ec2-power-uat-01","pool_id":"P10","alloc_id":null,"status":"running","vcpu":8,"ram_gb":32,"disk_gb":200,"ip":"10.0.4.11","subnet_id":"SN10","tags":{"project_id":"PROJ-001","system_id":"SYS-001","env":"UAT","role":"app"} },
  { "id":"VM-020","name":"ec2-power-uat-db","pool_id":"P10","alloc_id":null,"status":"running","vcpu":8,"ram_gb":32,"disk_gb":500,"ip":"10.0.4.20","subnet_id":"SN10","tags":{"project_id":"PROJ-001","system_id":"SYS-001","env":"UAT","role":"db"} },
  { "id":"VM-021","name":"vm-s01-sysa-01","pool_id":"S01","alloc_id":"A001","status":"running","vcpu":8,"ram_gb":16,"disk_gb":200,"ip":"10.10.1.31","subnet_id":"SN01","tags":{"project_id":"PROJ-002","system_id":"SYS-003","env":"Prod","role":"app"} },
  { "id":"VM-022","name":"vm-s01-sysa-db","pool_id":"S01","alloc_id":"A001","status":"running","vcpu":16,"ram_gb":48,"disk_gb":500,"ip":"10.10.1.32","subnet_id":"SN01","tags":{"project_id":"PROJ-002","system_id":"SYS-003","env":"Prod","role":"db"} },
  { "id":"VM-023","name":"vm-s01-sysb-01","pool_id":"S01","alloc_id":"A002","status":"running","vcpu":8,"ram_gb":16,"disk_gb":200,"ip":"10.10.1.41","subnet_id":"SN01","tags":{"project_id":"PROJ-003","system_id":"SYS-004","env":"Prod","role":"app"} },
  { "id":"VM-024","name":"vm-s01-sysb-02","pool_id":"S01","alloc_id":"A002","status":"running","vcpu":8,"ram_gb":16,"disk_gb":200,"ip":"10.10.1.42","subnet_id":"SN01","tags":{"project_id":"PROJ-003","system_id":"SYS-004","env":"Prod","role":"app"} },
  { "id":"VM-025","name":"vm-s02-sysa-dr","pool_id":"S02","alloc_id":"A003","status":"running","vcpu":8,"ram_gb":32,"disk_gb":500,"ip":"10.20.1.31","subnet_id":null,"tags":{"project_id":"PROJ-002","system_id":"SYS-003","env":"Prod","role":"app"} },
  { "id":"VM-026","name":"vm-s03-sysc-01","pool_id":"S03","alloc_id":"A004","status":"running","vcpu":16,"ram_gb":32,"disk_gb":500,"ip":"172.16.1.51","subnet_id":"SN05","tags":{"project_id":"PROJ-004","system_id":"SYS-005","env":"Prod","role":"app"} },
  { "id":"VM-027","name":"vm-s03-sysc-02","pool_id":"S03","alloc_id":"A004","status":"running","vcpu":16,"ram_gb":32,"disk_gb":500,"ip":"172.16.1.52","subnet_id":"SN05","tags":{"project_id":"PROJ-004","system_id":"SYS-005","env":"Prod","role":"app"} },
  { "id":"VM-028","name":"vm-s03-sysd-uat","pool_id":"S03","alloc_id":"A005","status":"running","vcpu":8,"ram_gb":16,"disk_gb":200,"ip":"172.16.1.61","subnet_id":"SN05","tags":{"project_id":"PROJ-005","system_id":"SYS-006","env":"UAT","role":"app"} }
],

allocations: [
  { "id":"A001","pool_id":"S01","project_id":"PROJ-002","system_id":"SYS-003","env":"Prod","site_role":"primary","quota_cpu":40,"quota_mem_gb":96,"quota_disk_tb":2,"status":"active" },
  { "id":"A002","pool_id":"S01","project_id":"PROJ-003","system_id":"SYS-004","env":"Prod","site_role":"primary","quota_cpu":30,"quota_mem_gb":64,"quota_disk_tb":1.5,"status":"active" },
  { "id":"A003","pool_id":"S02","project_id":"PROJ-002","system_id":"SYS-003","env":"Prod","site_role":"dr","quota_cpu":40,"quota_mem_gb":96,"quota_disk_tb":2,"status":"active" },
  { "id":"A004","pool_id":"S03","project_id":"PROJ-004","system_id":"SYS-005","env":"Prod","site_role":"primary","quota_cpu":32,"quota_mem_gb":64,"quota_disk_tb":2,"status":"active" },
  { "id":"A005","pool_id":"S03","project_id":"PROJ-005","system_id":"SYS-006","env":"UAT","site_role":"primary","quota_cpu":16,"quota_mem_gb":32,"quota_disk_tb":1,"status":"active" }
],

subnets: [
  { "id":"SN01","name":"內部應用網段","cidr":"10.10.1.0/24","type":"internal","cloud":"private","site_id":"tp-main","status":"active" },
  { "id":"SN02","name":"DMZ 網段","cidr":"10.10.2.0/24","type":"dmz","cloud":"private","site_id":"tp-main","status":"active" },
  { "id":"SN03","name":"管理網段","cidr":"10.10.100.0/24","type":"management","cloud":"private","site_id":"tp-main","status":"active" },
  { "id":"SN04","name":"UAT 內部網段","cidr":"10.10.10.0/24","type":"internal","cloud":"private","site_id":"tp-main","status":"active" },
  { "id":"SN05","name":"hiCloud 生產網段","cidr":"172.16.1.0/24","type":"internal","cloud":"hicloud","site_id":"e7-main","status":"active" },
  { "id":"SN06","name":"hiCloud UAT 網段","cidr":"172.16.10.0/24","type":"internal","cloud":"hicloud","site_id":"e7-main","status":"active" },
  { "id":"SN07","name":"AWS Public-A","cidr":"10.0.1.0/24","type":"public","cloud":"aws","site_id":"tw-main","status":"active" },
  { "id":"SN08","name":"AWS Private-A","cidr":"10.0.2.0/24","type":"internal","cloud":"aws","site_id":"tw-main","status":"active" },
  { "id":"SN09","name":"AWS Public-B","cidr":"10.0.3.0/24","type":"public","cloud":"aws","site_id":"tw-main","status":"active" },
  { "id":"SN10","name":"AWS Private-B","cidr":"10.0.4.0/24","type":"internal","cloud":"aws","site_id":"tw-main","status":"active" }
],

projects: [
  { "id":"PROJ-001","name":"電發專案","code":"POWER","owner":"王大明","dept":"資訊處" },
  { "id":"PROJ-002","name":"一科","code":"DEPT1","owner":"李小華","dept":"一科室" },
  { "id":"PROJ-003","name":"二科","code":"DEPT2","owner":"陳美玲","dept":"二科室" },
  { "id":"PROJ-004","name":"三科","code":"DEPT3","owner":"張志強","dept":"三科室" },
  { "id":"PROJ-005","name":"四科","code":"DEPT4","owner":"林佳蓉","dept":"四科室" }
],

systems: [
  { "id":"SYS-001","project_id":"PROJ-001","name":"電發系統","code":"SYS-POWER","envs":["Prod","UAT"] },
  { "id":"SYS-002","project_id":"PROJ-001","name":"允獎APP","code":"SYS-APP","envs":["Prod","UAT"] },
  { "id":"SYS-003","project_id":"PROJ-002","name":"系統A","code":"SYS-D1A","envs":["Prod"] },
  { "id":"SYS-004","project_id":"PROJ-003","name":"系統B","code":"SYS-D2B","envs":["Prod"] },
  { "id":"SYS-005","project_id":"PROJ-004","name":"系統C","code":"SYS-D3C","envs":["Prod"] },
  { "id":"SYS-006","project_id":"PROJ-005","name":"系統D","code":"SYS-D4D","envs":["UAT"] }
]

}; // end HCM_BUNDLE
