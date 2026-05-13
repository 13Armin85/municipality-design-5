import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Info,
  X,
  Layers,
  ClipboardList,
  FileSearch,
  Plus,
  Minus,
  Home,
  Trash2,
  ArrowRight,
  Sun,
  Moon,
  ChevronLeft,
} from "lucide-react";
import { Link } from "react-router";
import { searchLabels, urbanPropertiesMock } from "../data/urbanServiceMock";

interface Props { isDark: boolean; toggleTheme: () => void; }

type PropertyFileData = {
  id: string; owner: string; kind: string; fields: string[];
  requests: { code: string; title: string; status: string; date: string }[];
  details: { label: string; value: string }[];
};

const mockFiles: PropertyFileData[] = urbanPropertiesMock.map((item, idx) => ({ id: item.id, owner: item.owner, kind: item.type, fields: item.fields, requests: [{code:`RQ-1405-1${idx+1}`,title:"درخواست مفاصاحساب",status:"در حال بررسی",date:"1405/02/21"}], details: [{label:"آخرین مرحله",value:"ارجاع به کارشناس"},{label:"نوع درخواست",value:"خدمات شهری"},{label:"شناسه پیگیری",value:item.trackingCode},{label:"آدرس",value:item.address}] }));

export function PropertyRequestDetails({ isDark, toggleTheme }: Props) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState(mockFiles[0]);
  const [searchValues, setSearchValues] = useState(mockFiles[0].fields);
  const [activeFile, setActiveFile] = useState(mockFiles[0]);

  const handleSearch = () => {
    setSearchValues(selectedFile.fields);
    setActiveFile(selectedFile);
  };

  const filledRequestRows = useMemo(() => activeFile.requests, [activeFile]);

  const HelpButton = () => (
    <button onClick={() => setIsModalOpen(true)} className="inline-flex items-center gap-1 rounded-lg border border-primary/35 bg-[var(--primary-soft)] px-2.5 py-1 text-[10px] font-bold text-primary transition-colors hover:bg-primary/10 md:text-xs"><Info className="h-3.5 w-3.5" /> راهنما</button>
  );

  return <div dir="rtl" className="min-h-screen bg-background text-foreground transition-colors duration-300">
    <motion.header initial={{ y: -80 }} animate={{ y: 0 }} className="fixed inset-x-0 top-0 z-50 px-2 pt-2 md:px-4 md:pt-3"><div className="container mx-auto px-0 md:px-2 lg:px-6"><div className="nav-shell"><div className="flex h-16 items-center justify-between gap-2 px-3 md:h-20 md:px-4"><Link to="/" className="header-action-btn inline-flex items-center gap-2 px-3"><ArrowRight className="h-4 w-4" /><span className="hidden text-sm md:block">بازگشت</span></Link><h1 className="text-sm font-bold text-foreground md:text-base">پیگیری درخواست‌ها</h1><button onClick={toggleTheme} className="header-action-btn flex items-center justify-center p-2 rounded-lg hover:bg-muted transition-colors text-foreground">{isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}</button></div></div></div></motion.header>

    <main className="section-decor px-3 pb-12 pt-24 md:pb-20 md:pt-28 lg:px-6"><div className="container mx-auto max-w-6xl space-y-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="rounded-2xl border border-primary/25 bg-[var(--primary-soft)] px-4 py-3 text-xs text-primary md:text-sm">کاربر گرامی، پس از انتخاب پرونده زیرمجموعه روی جستجو بزنید تا همه سکشن‌ها تکمیل شوند.</motion.div>

      <motion.article initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="soft-card mesh-panel overflow-hidden"><div className="flex items-center justify-between border-b border-border/70 px-4 py-3"><div className="flex items-center gap-2"><Search className="h-4 w-4 text-primary" /><h2 className="text-sm font-bold">جستجو</h2></div><HelpButton /></div>
      <div className="grid grid-cols-2 gap-2 p-4 md:grid-cols-8"><button onClick={handleSearch} className="h-11 rounded-xl bg-emerald-600 px-6 text-sm font-bold text-white">جستجو</button>{searchLabels.map((label,i)=><div key={label} className="relative"><input value={searchValues[i]} readOnly className="h-11 w-full rounded-xl border border-border/70 bg-card px-2 text-center text-sm font-medium"/><span className="absolute -top-2 right-2 bg-card px-1 text-[9px] text-muted-foreground">{label}</span></div>)}</div></motion.article>

      <motion.article initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="soft-card mesh-panel overflow-hidden"><div className="flex items-center justify-between border-b border-border/70 px-4 py-3"><div className="flex items-center gap-2"><Layers className="h-4 w-4 text-primary" /><h2 className="text-sm font-bold">پرونده های زیر مجموعه</h2></div><HelpButton /></div><div className="p-4 space-y-2">{mockFiles.map((file)=><button key={file.id} onClick={()=>{setSelectedFile(file);setSearchValues(file.fields);}} className="flex w-full items-center justify-between rounded-xl border border-border/70 bg-card/40 p-3"><span className="text-xs md:text-sm">{file.id} ({file.kind}) - {file.owner}</span><ChevronLeft className="h-4 w-4 text-muted-foreground"/></button>)}</div></motion.article>

      <div className="grid gap-6 md:grid-cols-2">
        <motion.article className="soft-card mesh-panel overflow-hidden"><div className="flex items-center justify-between border-b border-border/70 px-4 py-3"><div className="flex items-center gap-2"><ClipboardList className="h-4 w-4 text-primary" /><h2 className="text-sm font-bold">پیگیری درخواست ها</h2></div><HelpButton /></div><div className="overflow-x-auto p-4"><table className="w-full text-xs md:text-sm"><thead><tr className="bg-muted/40"><th className="p-2 text-right">کد</th><th className="p-2 text-right">عنوان</th><th className="p-2 text-right">وضعیت</th><th className="p-2 text-right">تاریخ</th></tr></thead><tbody>{filledRequestRows.map((row)=><tr key={row.code} className="border-b border-border/40"><td className="p-2">{row.code}</td><td className="p-2">{row.title}</td><td className="p-2">{row.status}</td><td className="p-2">{row.date}</td></tr>)}</tbody></table></div></motion.article>
        <motion.article className="soft-card mesh-panel overflow-hidden"><div className="flex items-center justify-between border-b border-border/70 px-4 py-3"><div className="flex items-center gap-2"><FileSearch className="h-4 w-4 text-primary" /><h2 className="text-sm font-bold">جزئیات درخواست</h2></div></div><div className="p-4 space-y-3">{activeFile.details.map((d)=><div key={d.label} className="flex items-center justify-between border-b border-border/40 pb-2 text-sm"><span className="text-muted-foreground">{d.label}</span><strong>{d.value}</strong></div>)}</div></motion.article>
      </div>

      <motion.article className="soft-card mesh-panel relative h-[360px] overflow-hidden"><div className="absolute inset-0 bg-slate-800/10"><img src="/map-placeholder.jpg" alt="Map" className="h-full w-full object-cover opacity-80" /></div><div className="absolute left-4 top-4 flex flex-col gap-2"><button className="flex h-10 w-10 items-center justify-center rounded-xl bg-card shadow-xl border border-border/40"><Plus className="h-5 w-5" /></button><button className="flex h-10 w-10 items-center justify-center rounded-xl bg-card shadow-xl border border-border/40"><Minus className="h-5 w-5" /></button><button className="flex h-10 w-10 items-center justify-center rounded-xl bg-card shadow-xl border border-border/40"><Home className="h-5 w-5" /></button></div><button className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-xl bg-destructive text-white shadow-xl"><Trash2 className="h-5 w-5" /></button></motion.article>
    </div></main>

    <AnimatePresence>{isModalOpen && <div className="fixed inset-0 z-[100] flex items-center justify-center p-4"><motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsModalOpen(false)} className="absolute inset-0 bg-background/40 backdrop-blur-md" /><motion.div initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 20 }} className="relative w-full max-w-sm overflow-hidden rounded-[2.5rem] border border-border bg-card shadow-2xl"><div className="flex items-center justify-between border-b border-border/50 px-8 py-5"><h3 className="flex items-center gap-2 text-base font-bold text-primary"><Info className="h-5 w-5" /> راهنمای سیستم</h3><button onClick={() => setIsModalOpen(false)} className="rounded-full p-2 text-muted-foreground hover:bg-muted transition-colors"><X className="h-5 w-5" /></button></div><div className="px-8 py-6 text-sm leading-8 text-foreground/80 text-justify">با انتخاب هر پرونده زیرمجموعه، کد نوسازی در اینپوت‌ها قرار می‌گیرد. سپس با جستجو، تمام سکشن‌ها با اطلاعات همان ملک پر می‌شوند.</div><div className="px-8 pb-8"><button onClick={() => setIsModalOpen(false)} className="w-full rounded-2xl bg-emerald-600 py-3.5 text-sm font-bold text-white">فهمیدم</button></div></motion.div></div>}</AnimatePresence>
  </div>;
}
