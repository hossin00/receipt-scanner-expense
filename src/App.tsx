import { useState, useEffect } from 'react';
import { Plus, Trash2, Edit3, Search, X, Download, DollarSign } from 'lucide-react';
const A='#06b6d4',SK='rsev1',SS='rses1',SO='rseo1';
interface Item{id:string;vendor:string;amount:number;date:string;category:string;taxAmount:number;paymentMethod:string;reference:string;notes:string;isSample?:boolean;}
const CATS=['Travel','Meals','Software','Office','Equipment','Health','Utilities','Other'];
const PAY=['Credit Card','Cash','Bank Transfer','PayPal','Cheque'];
const SAMPLE:Item[]=[
  {id:'r1',vendor:'Amazon AWS',amount:49.99,date:'2026-06-01',category:'Software',taxAmount:0,paymentMethod:'Credit Card',reference:'INV-001',notes:'Cloud hosting',isSample:true},
  {id:'r2',vendor:'Office Depot',amount:67.50,date:'2026-06-02',category:'Office',taxAmount:6.75,paymentMethod:'Credit Card',reference:'REC-4521',notes:'Stationery supplies',isSample:true},
  {id:'r3',vendor:'Delta Airlines',amount:342.00,date:'2026-05-28',category:'Travel',taxAmount:0,paymentMethod:'Credit Card',reference:'DL-88271',notes:'Client meeting NYC',isSample:true},
  {id:'r4',vendor:'Starbucks',amount:18.50,date:'2026-06-03',category:'Meals',taxAmount:1.85,paymentMethod:'Cash',reference:'',notes:'Client coffee meeting',isSample:true},
  {id:'r5',vendor:'Figma',amount:15.00,date:'2026-06-01',category:'Software',taxAmount:0,paymentMethod:'Credit Card',reference:'FIG-2026-06',notes:'Design tool',isSample:true},
];
function ld<T>(k:string,fb:T):T{try{const v=localStorage.getItem(k);return v?JSON.parse(v):fb;}catch{return fb;}}
function sv<T>(k:string,v:T){localStorage.setItem(k,JSON.stringify(v));}
function uid(){return Math.random().toString(36).slice(2,10);}
function fmt(n:number){return '$'+n.toFixed(2);}
export default function App(){
  const [items,setItems]=useState<Item[]>(()=>ld(SK,[]));
  const [ob,setOb]=useState(()=>ld(SO,false));
  const [pg,setPg]=useState('dashboard');
  const [q,setQ]=useState('');
  const [modal,setModal]=useState(false);
  const [edit,setEdit]=useState<Item|null>(null);
  const [theme,setTheme]=useState(()=>ld(SS,{theme:'system'}).theme);
  const B={vendor:'',amount:0,date:new Date().toISOString().split('T')[0],category:'Office',taxAmount:0,paymentMethod:'Credit Card',reference:'',notes:''};
  const [form,setForm]=useState<any>(B);
  const F=(k:string)=>(e:any)=>setForm((f:any)=>({...f,[k]:e.target.value}));
  const FN=(k:string)=>(e:any)=>setForm((f:any)=>({...f,[k]:+e.target.value}));
  useEffect(()=>{sv(SK,items);},[items]);
  useEffect(()=>{const el=document.documentElement;theme==='dark'?el.classList.add('dark'):theme==='light'?el.classList.remove('dark'):(window.matchMedia('(prefers-color-scheme: dark)').matches?el.classList.add('dark'):el.classList.remove('dark'));sv(SS,{theme});},[theme]);
  const start=(s:boolean)=>{if(s)setItems(SAMPLE);setOb(true);sv(SO,true);};
  const openNew=()=>{setEdit(null);setForm({...B});setModal(true);};
  const openEdit=(item:Item)=>{setEdit(item);setForm({...item});setModal(true);};
  const save=()=>{const item={id:edit?.id||uid(),...form};setItems(p=>edit?p.map(x=>x.id===edit.id?item:x):[item,...p]);setModal(false);};
  const hasSample=items.some(i=>i.isSample);
  const totalSpend=items.reduce((s,i)=>s+i.amount,0);
  const totalTax=items.reduce((s,i)=>s+i.taxAmount,0);
  const filtered=items.filter(i=>{const qq=q.toLowerCase();return!q||i.vendor.toLowerCase().includes(qq)||i.category.toLowerCase().includes(qq);});
  const byCat=CATS.map(c=>({cat:c,total:items.filter(i=>i.category===c).reduce((s,i)=>s+i.amount,0),count:items.filter(i=>i.category===c).length})).filter(c=>c.count>0);
  const exportCSV=()=>{const r=items.map(i=>[i.vendor,i.amount,i.date,i.category,i.taxAmount,i.paymentMethod,i.reference].join(','));const el=document.createElement('a');el.href='data:text/csv;charset=utf-8,'+encodeURIComponent('Vendor,Amount,Date,Category,Tax,Payment,Ref\n'+r.join('\n'));el.download='expenses.csv';el.click();};
  if(!ob)return(<div className="min-h-screen flex items-center justify-center p-6" style={{background:`linear-gradient(135deg,${A},#0e7490)`}}><div className="max-w-xl w-full text-center"><div className="text-6xl mb-4">🧾</div><h1 className="text-3xl font-bold text-white mb-2">Receipt Scanner & Expense Report</h1><p className="text-cyan-100 mb-8">Organize receipts, track spending by category, and export expense reports.</p><div className="grid grid-cols-2 gap-4 text-left"><button onClick={()=>start(false)} className="bg-white/10 hover:bg-white/20 border-2 border-white/30 rounded-2xl p-6 text-white"><div className="text-2xl mb-2">📋</div><div className="font-semibold">Start Empty</div></button><button onClick={()=>start(true)} className="bg-white rounded-2xl p-6 text-left hover:opacity-90"><div className="text-2xl mb-2">✨</div><div className="font-semibold text-cyan-700">Explore Sample Workspace</div><div className="text-gray-500 text-sm mt-1">5 sample receipts preloaded</div><div className="text-gray-400 text-xs mt-2">Sample data · Remove anytime</div></button></div><p className="text-cyan-300 text-xs mt-4">One-time paid app · No subscription · Fully unlocked</p></div></div>);
  const Nav=({id,lb}:{id:string;lb:string})=>(<button onClick={()=>setPg(id)} className={`px-3 py-2 rounded-xl text-sm font-medium ${pg===id?'text-white':'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'}`} style={pg===id?{backgroundColor:A}:{}}>{lb}</button>);
  return(<div className="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-white">
    <header className="bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 px-6 py-3 flex items-center justify-between">
      <div className="flex items-center gap-3"><div className="w-8 h-8 rounded-lg text-white flex items-center justify-center text-sm" style={{backgroundColor:A}}>🧾</div><nav className="flex gap-1"><Nav id="dashboard" lb="Dashboard"/><Nav id="receipts" lb="Receipts"/><Nav id="reports" lb="Reports"/><Nav id="settings" lb="Settings"/><Nav id="help" lb="Help"/></nav></div>
      <div className="flex items-center gap-2"><button onClick={()=>setTheme((t:string)=>t==='dark'?'light':'dark')} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500">{theme==='dark'?'☀️':'🌙'}</button><button onClick={openNew} className="flex items-center gap-2 px-4 py-2 rounded-xl text-white text-sm font-medium" style={{backgroundColor:A}}><Plus size={15}/>Add Receipt</button></div>
    </header>
    <main className="max-w-5xl mx-auto p-6 space-y-6">
      {pg==='dashboard'&&<>
        {hasSample&&<div className="flex items-center justify-between bg-amber-50 dark:bg-amber-900/20 border border-amber-200 rounded-xl px-4 py-3"><span className="text-amber-700 dark:text-amber-400 text-sm">✦ Sample workspace loaded</span><button onClick={()=>setItems(p=>p.filter(i=>!i.isSample))} className="text-xs text-amber-600 underline">Remove</button></div>}
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 p-5"><div className="text-2xl mb-2">🧾</div><div className="text-2xl font-bold">{items.length}</div><div className="text-sm text-gray-500">Total Receipts</div></div>
          <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 p-5"><div className="text-2xl mb-2">💰</div><div className="text-2xl font-bold">{fmt(totalSpend)}</div><div className="text-sm text-gray-500">Total Spend</div></div>
          <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 p-5"><div className="text-2xl mb-2">📊</div><div className="text-2xl font-bold">{fmt(totalTax)}</div><div className="text-sm text-gray-500">Total Tax</div></div>
        </div>
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800">
          <div className="px-5 py-4 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between"><span className="font-semibold">Recent Receipts</span><button onClick={()=>setPg('receipts')} className="text-sm underline" style={{color:A}}>View all</button></div>
          {items.slice(0,5).map(item=><div key={item.id} className="flex items-center gap-4 px-5 py-3.5 border-b border-gray-50 dark:border-gray-800 last:border-0"><div className="flex-1"><div className="flex items-center gap-2"><span className="font-medium text-sm">{item.vendor}</span>{item.isSample&&<span className="text-xs bg-amber-100 text-amber-700 px-1.5 rounded">✦</span>}</div><p className="text-xs text-gray-400">{item.category} · {item.date}</p></div><span className="font-semibold">{fmt(item.amount)}</span></div>)}
          {items.length===0&&<div className="py-10 text-center text-gray-400"><DollarSign size={32} className="mx-auto mb-2"/><p>No receipts yet</p><button onClick={openNew} className="mt-3 px-4 py-2 rounded-xl text-white text-sm" style={{backgroundColor:A}}>Add First Receipt</button></div>}
        </div>
      </>}
      {pg==='receipts'&&<>
        <div className="flex gap-3"><div className="relative flex-1"><Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"/><input value={q} onChange={e=>setQ(e.target.value)} placeholder="Search receipts…" className="w-full pl-9 pr-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm"/></div><button onClick={exportCSV} className="flex items-center gap-2 px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm"><Download size={14}/>CSV</button></div>
        {filtered.length===0?<div className="text-center py-16"><div className="text-5xl mb-4">🧾</div><p className="font-semibold text-lg mb-5">No receipts found</p><button onClick={openNew} className="px-5 py-2.5 rounded-xl text-white font-medium" style={{backgroundColor:A}}>Add Receipt</button></div>:
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 divide-y divide-gray-50 dark:divide-gray-800">
          {filtered.map(item=><div key={item.id} className="flex items-center gap-4 px-5 py-4">
            <div className="flex-1"><div className="flex items-center gap-2"><span className="font-medium text-sm">{item.vendor}</span>{item.isSample&&<span className="text-xs bg-amber-100 text-amber-700 px-1.5 rounded">✦ Sample</span>}<span className="text-xs bg-gray-100 dark:bg-gray-800 text-gray-500 px-2 py-0.5 rounded">{item.category}</span></div><p className="text-xs text-gray-400">{item.date} · {item.paymentMethod}{item.reference?' · '+item.reference:''}</p></div>
            <div className="text-right"><div className="font-bold">{fmt(item.amount)}</div>{item.taxAmount>0&&<div className="text-xs text-gray-400">Tax: {fmt(item.taxAmount)}</div>}</div>
            <div className="flex gap-1"><button onClick={()=>openEdit(item)} className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg text-gray-400"><Edit3 size={15}/></button><button onClick={()=>setItems(p=>p.filter(x=>x.id!==item.id))} className="p-1.5 hover:bg-red-50 rounded-lg text-gray-400 hover:text-red-500"><Trash2 size={15}/></button></div>
          </div>)}
        </div>}
      </>}
      {pg==='reports'&&<>
        <h2 className="font-semibold text-lg">Expense Breakdown</h2>
        <div className="grid grid-cols-2 gap-4">
          {byCat.map(c=><div key={c.cat} className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 p-5"><div className="font-semibold text-sm mb-2">{c.cat}</div><div className="text-xl font-bold">{fmt(c.total)}</div><div className="text-xs text-gray-400">{c.count} receipt{c.count!==1?'s':''}</div></div>)}
          {byCat.length===0&&<div className="col-span-2 text-center py-10 text-gray-400">No data yet. Add receipts to see reports.</div>}
        </div>
      </>}
      {pg==='settings'&&<div className="max-w-lg space-y-4"><div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 p-5"><h3 className="font-semibold mb-3">Theme</h3><div className="flex gap-2">{['light','dark','system'].map(t=><button key={t} onClick={()=>setTheme(t)} className={`px-4 py-2 rounded-xl border text-sm capitalize ${theme===t?'text-white border-transparent':'border-gray-200 dark:border-gray-700'}`} style={theme===t?{backgroundColor:A}:{}}>{t}</button>)}</div></div><div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 p-5"><h3 className="font-semibold mb-2">About</h3><p className="text-sm text-gray-500">Receipt Scanner & Expense Report · v1.0</p><p className="text-sm text-green-600 mt-1">✓ One-time paid app · No subscription · Fully unlocked</p></div></div>}
      {pg==='help'&&<div className="max-w-2xl space-y-3">{[['How do I add a receipt?','Click Add Receipt. Enter the vendor, amount, date, and category.'],['Can I export expense reports?','Yes — use the CSV export on the Receipts page.'],['What is the Reports page?','Shows total spending broken down by category.'],['Is my data private?','All data is stored locally on your device. Nothing is sent anywhere.']].map(([q,a],i)=><div key={i} className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 p-5"><p className="font-medium text-sm mb-1">{q}</p><p className="text-sm text-gray-500">{a}</p></div>)}</div>}
    </main>
    {modal&&<div className="fixed inset-0 z-50 flex items-center justify-center p-4"><div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={()=>setModal(false)}/><div className="relative w-full max-w-lg bg-white dark:bg-gray-900 rounded-2xl shadow-2xl p-6 max-h-[90vh] overflow-y-auto">
      <div className="flex items-center justify-between mb-5"><h3 className="text-lg font-semibold">{edit?'Edit Receipt':'Add Receipt'}</h3><button onClick={()=>setModal(false)} className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg text-gray-400"><X size={18}/></button></div>
      <div className="grid grid-cols-2 gap-3">
        <div className="col-span-2"><label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1.5">Vendor / Store</label><input value={form.vendor} onChange={F('vendor')} placeholder="e.g. Amazon, Starbucks" className="w-full px-3.5 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm focus:outline-none"/></div>
        <div><label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1.5">Amount ($)</label><input type="number" value={form.amount} onChange={FN('amount')} className="w-full px-3.5 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm focus:outline-none"/></div>
        <div><label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1.5">Tax ($)</label><input type="number" value={form.taxAmount} onChange={FN('taxAmount')} className="w-full px-3.5 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm focus:outline-none"/></div>
        <div><label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1.5">Date</label><input type="date" value={form.date} onChange={F('date')} className="w-full px-3.5 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm"/></div>
        <div><label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1.5">Category</label><select value={form.category} onChange={F('category')} className="w-full px-3.5 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm">{CATS.map(c=><option key={c}>{c}</option>)}</select></div>
        <div><label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1.5">Payment Method</label><select value={form.paymentMethod} onChange={F('paymentMethod')} className="w-full px-3.5 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm">{PAY.map(p=><option key={p}>{p}</option>)}</select></div>
        <div><label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1.5">Reference No.</label><input value={form.reference} onChange={F('reference')} className="w-full px-3.5 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm focus:outline-none"/></div>
        <div className="col-span-2"><label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1.5">Notes</label><textarea value={form.notes} onChange={F('notes')} rows={2} className="w-full px-3.5 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm resize-none"/></div>
        <div className="col-span-2 flex gap-3"><button onClick={()=>setModal(false)} className="flex-1 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 text-sm">Cancel</button><button onClick={save} className="flex-1 py-2.5 rounded-xl text-white text-sm font-medium" style={{backgroundColor:A}}>Save Receipt</button></div>
      </div>
    </div></div>}
  </div>);
}
