/* ══════════════════════════════════════════════════════
   tailwind-config.js — 共用 Tailwind 主題設定
   所有頁面 <script src="tailwind-config.js"></script>
   必須放在 <script src="https://cdn.tailwindcss.com"> 之後
══════════════════════════════════════════════════════ */
tailwind.config = {
  theme: {
    extend: {
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Noto Sans TC', 'sans-serif'],
        mono: ['Fira Code', 'monospace'],
      },
      colors: {
        or:  { DEFAULT:'#ea580c', l:'#fff7ed', m:'#fed7aa', d:'#c2410c' },
        ink: { DEFAULT:'#0f0f0f', 2:'#262626', 3:'#737373', 4:'#a3a3a3' },
        surf:{ DEFAULT:'#ffffff', 2:'#f7f8fa' },
        bord:{ DEFAULT:'#e8e8e8', 2:'#d4d4d4' },
        ded: { DEFAULT:'#2563eb', l:'#eff6ff', m:'#bfdbfe' },
        shr: { DEFAULT:'#0d9488', l:'#f0fdfa', m:'#99f6e4' },
        grn: { DEFAULT:'#16a34a', l:'#f0fdf4', m:'#bbf7d0' },
        red: { DEFAULT:'#dc2626', l:'#fef2f2', m:'#fecaca' },
        pur: { DEFAULT:'#7c3aed', l:'#f5f3ff', m:'#ddd6fe' },
        amb: { DEFAULT:'#d97706', l:'#fffbeb', m:'#fde68a' },
      },
      boxShadow: {
        sm: '0 1px 3px rgba(0,0,0,.06), 0 1px 2px rgba(0,0,0,.04)',
        md: '0 4px 12px rgba(0,0,0,.08), 0 1px 3px rgba(0,0,0,.04)',
        lg: '0 16px 36px rgba(0,0,0,.12), 0 4px 8px rgba(0,0,0,.06)',
      }
    }
  }
};
