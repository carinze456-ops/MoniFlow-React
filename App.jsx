import React, { useMemo, useState } from "react";
import {
  Activity, ArrowDownLeft, ArrowLeft, ArrowRight, ArrowUpRight, Bell, Check,
  ChevronDown, CircleHelp, CreditCard, Eye, EyeOff, FileText, Fingerprint,
  Home, Landmark, LockKeyhole, LogOut, Menu, Moon, MoreHorizontal, Phone,
  Plus, Search, Send, Settings, ShieldCheck, Smartphone, Sun, Tv, UserRound,
  Wallet, Wifi, Zap, X, CheckCircle2, Copy, History, CircleUserRound
} from "lucide-react";

const initialTransactions = [
  { id: 1, title: "Transfer to Chika", subtitle: "Today · 10:42 AM", amount: -25000, type: "sent", icon: ArrowUpRight, color: "violet" },
  { id: 2, title: "Wallet funding", subtitle: "Today · 9:18 AM", amount: 100000, type: "received", icon: ArrowDownLeft, color: "mint" },
  { id: 3, title: "MTN Data Bundle", subtitle: "Yesterday · 6:32 PM", amount: -3500, type: "bill", icon: Wifi, color: "orange" },
  { id: 4, title: "Netflix subscription", subtitle: "Yesterday · 1:05 PM", amount: -7200, type: "bill", icon: Tv, color: "pink" },
];

const naira = (amount) => new Intl.NumberFormat("en-NG", {
  style: "currency", currency: "NGN", maximumFractionDigits: 2
}).format(Math.abs(amount));

const banks = ["Access Bank", "First Bank", "GTBank", "Kuda", "Moniepoint", "OPay", "PalmPay", "UBA", "Zenith Bank"];
const tvProviders = ["DSTV", "GOtv", "Startimes"];
const networks = ["MTN", "Airtel", "Glo", "9mobile"];

function App() {
  const [activeTab, setActiveTab] = useState("Overview");
  const [balanceVisible, setBalanceVisible] = useState(true);
  const [dark, setDark] = useState(true);
  const [profileName, setProfileName] = useState("Charles Arinze");
  const [draftName, setDraftName] = useState("Charles Arinze");
  const [search, setSearch] = useState("");
  const [modal, setModal] = useState("");
  const [notice, setNotice] = useState("");
  const [transactions, setTransactions] = useState(initialTransactions);
  const [form, setForm] = useState({ recipient: "", bank: banks[0], amount: "", phone: "", network: networks[0], service: "Airtime", provider: tvProviders[0], smartcard: "", plan: "1.5GB · ₦1,000", meter: "Prepaid", customer: "" });
  const [showAllTransactions, setShowAllTransactions] = useState(false);

  const filteredTransactions = useMemo(() => transactions.filter((tx) =>
    `${tx.title} ${tx.subtitle}`.toLowerCase().includes(search.toLowerCase())
  ), [transactions, search]);

  const go = (tab) => { setActiveTab(tab); setModal(""); };
  const toast = (message) => { setNotice(message); window.setTimeout(() => setNotice(""), 2800); };
  const updateForm = (key, value) => setForm((old) => ({ ...old, [key]: value }));

  const completeDemoPayment = (title, amount, icon = ArrowUpRight, color = "violet") => {
    const value = Number(amount);
    if (!Number.isFinite(value) || value <= 0) { toast("Enter a valid amount greater than ₦0."); return; }
    setTransactions((old) => [{
      id: Date.now(), title, subtitle: "Just now · Demo transaction", amount: -value, type: "bill", icon, color
    }, ...old]);
    setModal("");
    toast("Demo request completed — no real money was moved.");
  };

  const sendMoney = () => {
    if (!form.recipient.trim()) { toast("Enter the recipient's account name or number."); return; }
    if (Number(form.amount) <= 0) { toast("Enter a valid transfer amount."); return; }
    completeDemoPayment(`Transfer to ${form.recipient.trim()}`, form.amount, Send, "violet");
    setForm((old) => ({ ...old, recipient: "", amount: "" }));
  };

  const payAirtimeData = () => {
    if (!/^\d{10,11}$/.test(form.phone.replace(/\s/g, ""))) { toast("Enter a valid Nigerian phone number."); return; }
    const label = form.service === "Airtime" ? `${form.network} Airtime · ${form.phone}` : `${form.network} Data · ${form.phone}`;
    completeDemoPayment(label, form.amount, form.service === "Airtime" ? Phone : Wifi, "orange");
    setForm((old) => ({ ...old, phone: "", amount: "" }));
  };

  const payTV = () => {
    if (!form.smartcard.trim()) { toast("Enter your smartcard or IUC number."); return; }
    if (Number(form.amount) <= 0) { toast("Enter a valid subscription amount."); return; }
    completeDemoPayment(`${form.provider} subscription`, form.amount, Tv, "pink");
    setForm((old) => ({ ...old, smartcard: "", amount: "" }));
  };

  const payElectricity = () => {
    if (!form.meter.trim()) { toast("Enter your meter number."); return; }
    if (Number(form.amount) <= 0) { toast("Enter a valid amount."); return; }
    completeDemoPayment("Electricity bill", form.amount, Zap, "orange");
    setForm((old) => ({ ...old, meter: "Prepaid", amount: "" }));
  };

  const displayBalance = balanceVisible ? "₦629,000.00" : "₦ ••••••";
  const navItems = [
    { name: "Overview", icon: Home }, { name: "Send money", icon: Send },
    { name: "Airtime & data", icon: Smartphone }, { name: "Pay bills", icon: Zap },
    { name: "Transactions", icon: History }, { name: "Profile", icon: UserRound }
  ];

  return (
    <div className={`app-shell ${dark ? "theme-dark" : "theme-light"}`}>
      <aside className="sidebar">
        <button className="brand" onClick={() => go("Overview")} aria-label="Go to overview">
          <span className="brand-mark"><Wallet size={22} strokeWidth={2.5} /></span>
          <span>moni<span className="brand-accent">flow</span><small>YOUR MONEY, IN MOTION</small></span>
        </button>
        <div className="workspace-label">WORKSPACE</div>
        <nav className="side-nav">
          {navItems.map(({ name, icon: Icon }) => (
            <button key={name} onClick={() => name === "Send money" ? setModal("send") : name === "Airtime & data" ? setModal("airtime") : name === "Pay bills" ? setModal("bills") : go(name)}
              className={`nav-item ${activeTab === name && !modal ? "active" : ""}`}>
              <Icon size={18} /><span>{name}</span>
              {name === "Transactions" && <span className="nav-count">{transactions.length}</span>}
            </button>
          ))}
        </nav>
        <div className="sidebar-bottom">
          <div className="help-card">
            <div className="help-icon"><CircleHelp size={19} /></div>
            <strong>Need a hand?</strong>
            <p>Our support team is here for you.</p>
            <button onClick={() => toast("Support centre is a demo placeholder.")}>Visit help centre <ArrowRight size={14} /></button>
          </div>
          <button className="nav-item" onClick={() => setDark(!dark)}>{dark ? <Sun size={18} /> : <Moon size={18} />}<span>{dark ? "Light appearance" : "Dark appearance"}</span></button>
          <div className="user-mini">
            <div className="avatar">{profileName.split(" ").map((s) => s[0]).join("").slice(0, 2).toUpperCase()}</div>
            <div className="user-mini-text"><strong>{profileName}</strong><small>Personal account</small></div>
            <button className="icon-button subtle" onClick={() => go("Profile")} aria-label="Open profile"><MoreHorizontal size={19} /></button>
          </div>
        </div>
      </aside>

      <main className="main-area">
        <header className="topbar">
          <div className="mobile-brand"><span className="brand-mark"><Wallet size={19} /></span><strong>moni<span className="brand-accent">flow</span></strong></div>
          <div className="breadcrumb"><span>Workspace</span><span className="crumb-slash">/</span><strong>{activeTab}</strong></div>
          <div className="topbar-actions">
            <div className="secure-pill"><span className="secure-dot" /><ShieldCheck size={14} /> Secure wallet</div>
            <button className="icon-button notification-button" onClick={() => toast("You're all caught up!")} aria-label="Notifications"><Bell size={18} /><i /></button>
            <button className="top-avatar" onClick={() => go("Profile")} aria-label="Open profile">{profileName.split(" ").map((s) => s[0]).join("").slice(0, 2).toUpperCase()}</button>
          </div>
        </header>

        <div className="page-content">
          {activeTab === "Profile" ? (
            <ProfilePage profileName={profileName} draftName={draftName} setDraftName={setDraftName} saveName={() => { if (!draftName.trim()) { toast("Your name cannot be empty."); return; } setProfileName(draftName.trim()); toast("Profile name updated."); }} dark={dark} setDark={setDark} toast={toast} />
          ) : activeTab === "Transactions" ? (
            <TransactionsPage transactions={filteredTransactions} search={search} setSearch={setSearch} showAll={showAllTransactions} setShowAll={setShowAllTransactions} />
          ) : activeTab === "Send money" ? (
            <SendPage form={form} updateForm={updateForm} sendMoney={sendMoney} />
          ) : activeTab === "Airtime & data" ? (
            <AirtimePage form={form} updateForm={updateForm} payAirtimeData={payAirtimeData} />
          ) : activeTab === "Pay bills" ? (
            <BillsPage form={form} updateForm={updateForm} payTV={payTV} payElectricity={payElectricity} />
          ) : (
            <Overview
              profileName={profileName} displayBalance={displayBalance} balanceVisible={balanceVisible}
              setBalanceVisible={setBalanceVisible} setModal={setModal} go={go}
              transactions={transactions} setShowAllTransactions={setShowAllTransactions}
            />
          )}
          <footer className="footer"><span>© 2026 MoniFlow Financial UI</span><span><LockKeyhole size={12} /> Your money space, thoughtfully designed</span><span className="demo-disclaimer">DEMO ONLY · NO REAL PAYMENTS</span></footer>
        </div>
      </main>

      {modal && <div className="modal-backdrop" onMouseDown={(e) => { if (e.target === e.currentTarget) setModal(""); }}>
        <div className="modal-card">
          <button className="modal-close icon-button" onClick={() => setModal("")} aria-label="Close"><X size={19} /></button>
          {modal === "send" && <SendPage form={form} updateForm={updateForm} sendMoney={sendMoney} inModal />}
          {modal === "airtime" && <AirtimePage form={form} updateForm={updateForm} payAirtimeData={payAirtimeData} inModal />}
          {modal === "bills" && <BillsPage form={form} updateForm={updateForm} payTV={payTV} payElectricity={payElectricity} inModal />}
        </div>
      </div>}

      {notice && <div className="toast"><CheckCircle2 size={18} /><span>{notice}</span><button onClick={() => setNotice("")}><X size={15} /></button></div>}
    </div>
  );
}

function PageHeading({ eyebrow, title, subtitle, right }) {
  return <div className="page-heading"><div><div className="eyebrow">{eyebrow}</div><h1>{title}</h1><p>{subtitle}</p></div>{right}</div>;
}

function Overview({ profileName, displayBalance, balanceVisible, setBalanceVisible, setModal, go, transactions, setShowAllTransactions }) {
  const [copied, setCopied] = useState(false);
  return <>
    <PageHeading eyebrow="MONDAY, OCTOBER 20, 2026" title={`Good afternoon, ${profileName.split(" ")[0]} 👋`} subtitle="Here's what's happening with your money today." right={<button className="button-secondary" onClick={() => setModal("send")}><Plus size={17} /> New transfer</button>} />
    <section className="hero-grid">
      <div className="balance-card">
        <div className="balance-card-top"><span className="balance-label"><span className="balance-dot" /> TOTAL WALLET BALANCE</span><button className="balance-eye" onClick={() => setBalanceVisible(!balanceVisible)} aria-label={balanceVisible ? "Hide balance" : "Show balance"}>{balanceVisible ? <Eye size={18} /> : <EyeOff size={18} />}<span>{balanceVisible ? "Hide" : "Show"}</span></button></div>
        <div className="balance-amount">{displayBalance}</div>
        <div className="balance-foot"><span><span className="trend-icon"><Activity size={13} /></span> Your available balance</span><span className="balance-chip"><LockKeyhole size={12} /> Protected</span></div>
        <div className="balance-decoration decor-one" /><div className="balance-decoration decor-two" />
      </div>
      <div className="account-card">
        <div className="account-card-heading"><div className="small-icon mint-bg"><Landmark size={18} /></div><span>Wallet details</span><button className="icon-button subtle" onClick={() => { navigator.clipboard?.writeText("0123456789"); setCopied(true); window.setTimeout(() => setCopied(false), 1800); }} aria-label="Copy account number">{copied ? <Check size={16} /> : <Copy size={16} />}</button></div>
        <div className="account-number">0123 456 789</div>
        <div className="account-holder">{profileName}</div>
        <div className="account-divider" />
        <div className="account-meta"><span>Wallet ID</span><strong>MF-2084-629</strong></div>
        <div className="account-meta"><span>Status</span><strong className="status-active"><i /> Active</strong></div>
      </div>
    </section>

    <section className="section-block">
      <div className="section-heading"><div><h2>Quick actions</h2><p>Everything you need, one tap away.</p></div><span className="section-kicker">YOUR SHORTCUTS</span></div>
      <div className="quick-grid">
        <QuickAction icon={Send} title="Send money" subtitle="To any bank" color="violet" onClick={() => setModal("send")} />
        <QuickAction icon={Phone} title="Buy airtime" subtitle="All networks" color="orange" onClick={() => setModal("airtime")} />
        <QuickAction icon={Wifi} title="Buy data" subtitle="Stay connected" color="blue" onClick={() => setModal("airtime")} />
        <QuickAction icon={Tv} title="Pay TV" subtitle="DSTV, GOtv & more" color="pink" onClick={() => setModal("bills")} />
        <QuickAction icon={Zap} title="Electricity" subtitle="Pay your power bill" color="yellow" onClick={() => setModal("bills")} />
      </div>
    </section>

    <section className="section-block transaction-section">
      <div className="section-heading"><div><h2>Recent activity</h2><p>A clear view of where your money goes.</p></div><button className="text-button" onClick={() => { go("Transactions"); setShowAllTransactions(true); }}>View all activity <ArrowRight size={15} /></button></div>
      <div className="transaction-card">
        <div className="transaction-table-head"><span>TRANSACTION</span><span>DATE</span><span>AMOUNT</span><span>STATUS</span></div>
        {transactions.slice(0, 4).map((tx) => <TransactionRow key={tx.id} tx={tx} />)}
      </div>
    </section>
  </>;
}

function QuickAction({ icon: Icon, title, subtitle, color, onClick }) {
  return <button className="quick-action" onClick={onClick}><span className={`quick-icon ${color}`}><Icon size={21} strokeWidth={2.1} /></span><span className="quick-title">{title}</span><span className="quick-subtitle">{subtitle}</span><span className="quick-arrow"><ArrowRight size={15} /></span></button>;
}

function TransactionRow({ tx }) {
  const Icon = tx.icon || ArrowUpRight;
  return <div className="transaction-row"><div className="transaction-name-cell"><span className={`transaction-icon ${tx.color || "violet"}`}><Icon size={17} /></span><div><strong>{tx.title}</strong><small>{tx.subtitle}</small></div></div><span className="transaction-date">{tx.subtitle.split("·")[0].trim()}</span><strong className={`transaction-amount ${tx.amount > 0 ? "positive" : ""}`}>{tx.amount > 0 ? "+" : "−"}{naira(tx.amount)}</strong><span className="transaction-status"><i /> Completed</span></div>;
}

function SendPage({ form, updateForm, sendMoney, inModal }) {
  return <div className={inModal ? "modal-form-page" : "subpage"}>
    <PageHeading eyebrow="TRANSFERS" title="Send money" subtitle="Move money to a bank account in a few simple steps." />
    <div className="form-layout"><div className="form-card"><div className="form-card-title"><span className="form-icon violet"><Send size={19} /></span><div><h2>Transfer details</h2><p>Recipient details and transfer amount</p></div></div>
      <label>Recipient account number<input value={form.recipient} onChange={(e) => updateForm("recipient", e.target.value)} placeholder="Enter account number or name" /></label>
      <label>Recipient bank<div className="select-wrap"><select value={form.bank} onChange={(e) => updateForm("bank", e.target.value)}>{banks.map((bank) => <option key={bank}>{bank}</option>)}</select><ChevronDown size={16} /></div></label>
      <label>Amount (NGN)<div className="amount-input"><span>₦</span><input type="number" min="1" value={form.amount} onChange={(e) => updateForm("amount", e.target.value)} placeholder="0.00" /></div></label>
      <div className="helper-note"><ShieldCheck size={16} /> Review the recipient details before confirming.</div>
      <button className="button-primary full-button" onClick={sendMoney}>Continue transfer <ArrowRight size={17} /></button>
    </div><div className="side-info-card"><div className="side-info-icon"><Fingerprint size={24} /></div><h3>Transfer with confidence</h3><p>Take a moment to verify the recipient and account details. This sample app simulates the flow without connecting to a bank.</p><div className="side-info-line"><ShieldCheck size={16} /> Secure-by-design interface</div><div className="side-info-line"><Activity size={16} /> Instant demo activity</div></div></div>
  </div>;
}

function AirtimePage({ form, updateForm, payAirtimeData, inModal }) {
  return <div className={inModal ? "modal-form-page" : "subpage"}>
    <PageHeading eyebrow="STAY CONNECTED" title="Airtime & data" subtitle="Top up any major Nigerian mobile network." />
    <div className="form-layout"><div className="form-card"><div className="form-card-title"><span className="form-icon orange"><Smartphone size={19} /></span><div><h2>Mobile top-up</h2><p>Choose a network and enter the details.</p></div></div>
      <div className="toggle-tabs"><button className={form.service === "Airtime" ? "selected" : ""} onClick={() => updateForm("service", "Airtime")}><Phone size={16} /> Airtime</button><button className={form.service === "Data" ? "selected" : ""} onClick={() => updateForm("service", "Data")}><Wifi size={16} /> Data bundle</button></div>
      <label>Choose network<div className="network-grid">{networks.map((n) => <button key={n} className={`network-option ${form.network === n ? "chosen" : ""} network-${n.toLowerCase()}`} onClick={() => updateForm("network", n)}><span className="network-logo">{n === "9mobile" ? "9" : n.slice(0, 1)}</span><strong>{n}</strong>{form.network === n && <CheckCircle2 size={15} />}</button>)}</div></label>
      <label>Phone number<input type="tel" value={form.phone} onChange={(e) => updateForm("phone", e.target.value)} placeholder="080 1234 5678" /></label>
      {form.service === "Data" && <label>Popular data bundle<div className="select-wrap"><select value={form.plan} onChange={(e) => updateForm("plan", e.target.value)}><option>1.5GB · ₦1,000</option><option>3.5GB · ₦2,000</option><option>6GB · ₦3,000</option><option>10GB · ₦5,000</option></select><ChevronDown size={16} /></div></label>}
      <label>Amount (NGN)<div className="amount-input"><span>₦</span><input type="number" min="1" value={form.amount} onChange={(e) => updateForm("amount", e.target.value)} placeholder={form.service === "Airtime" ? "e.g. 500" : "e.g. 1000"} /></div></label>
      <button className="button-primary full-button" onClick={payAirtimeData}>Buy {form.service.toLowerCase()} <ArrowRight size={17} /></button>
    </div><div className="side-info-card orange-side"><div className="side-info-icon"><Wifi size={24} /></div><h3>Connected in seconds</h3><p>Recharge your line or choose a data bundle that suits your day. All four major networks are represented in this demo.</p><div className="network-pills">{networks.map((n) => <span key={n}>{n}</span>)}</div></div></div>
  </div>;
}

function BillsPage({ form, updateForm, payTV, payElectricity, inModal }) {
  const [billType, setBillType] = useState("TV");
  return <div className={inModal ? "modal-form-page" : "subpage"}>
    <PageHeading eyebrow="EVERYDAY PAYMENTS" title="Pay bills" subtitle="Take care of your subscriptions and utilities." />
    <div className="form-layout"><div className="form-card"><div className="form-card-title"><span className="form-icon pink"><Zap size={19} /></span><div><h2>Bill payment</h2><p>Select a service to get started.</p></div></div>
      <div className="toggle-tabs"><button className={billType === "TV" ? "selected" : ""} onClick={() => setBillType("TV")}><Tv size={16} /> TV subscription</button><button className={billType === "Electricity" ? "selected" : ""} onClick={() => setBillType("Electricity")}><Zap size={16} /> Electricity</button></div>
      {billType === "TV" ? <>
        <label>TV provider<div className="provider-grid">{tvProviders.map((p) => <button key={p} className={`provider-option ${form.provider === p ? "chosen" : ""}`} onClick={() => updateForm("provider", p)}><span className={`provider-logo ${p.toLowerCase()}`}>{p === "Startimes" ? "S" : p === "DSTV" ? "D" : "G"}</span><strong>{p}</strong>{form.provider === p && <CheckCircle2 size={15} />}</button>)}</div></label>
        <label>Smartcard / IUC number<input value={form.smartcard} onChange={(e) => updateForm("smartcard", e.target.value)} placeholder="Enter decoder number" /></label>
        <label>Subscription amount (NGN)<div className="amount-input"><span>₦</span><input type="number" min="1" value={form.amount} onChange={(e) => updateForm("amount", e.target.value)} placeholder="e.g. 7200" /></div></label>
        <button className="button-primary full-button" onClick={payTV}>Pay {form.provider} <ArrowRight size={17} /></button>
      </> : <>
        <label>Distribution company<div className="select-wrap"><select value={form.customer} onChange={(e) => updateForm("customer", e.target.value)}><option value="">Select your disco</option><option>EKEDC · Eko Electricity</option><option>IKEDC · Ikeja Electric</option><option>Abuja Electricity</option><option>Enugu Electricity</option><option>Port Harcourt Electricity</option><option>Ibadan Electricity</option></select><ChevronDown size={16} /></div></label>
        <label>Meter number<input value={form.meter === "Prepaid" ? "" : form.meter} onChange={(e) => updateForm("meter", e.target.value)} placeholder="Enter meter number" /></label>
        <label>Meter type<div className="select-wrap"><select value={form.meterType || "Prepaid"} onChange={(e) => updateForm("meterType", e.target.value)}><option>Prepaid</option><option>Postpaid</option></select><ChevronDown size={16} /></div></label>
        <label>Amount (NGN)<div className="amount-input"><span>₦</span><input type="number" min="1" value={form.amount} onChange={(e) => updateForm("amount", e.target.value)} placeholder="e.g. 5000" /></div></label>
        <button className="button-primary full-button" onClick={payElectricity}>Pay electricity bill <ArrowRight size={17} /></button>
      </>}
      <div className="helper-note"><ShieldCheck size={16} /> Demo only. No provider is contacted and no payment is processed.</div>
    </div><div className="side-info-card pink-side"><div className="side-info-icon"><CreditCard size={24} /></div><h3>Your bills, simplified</h3><p>Manage home entertainment and utility payments from one clean dashboard.</p><div className="service-list"><span><Tv size={16} /> DSTV, GOtv, Startimes</span><span><Zap size={16} /> Electricity providers</span></div></div></div>
  </div>;
}

function TransactionsPage({ transactions, search, setSearch, showAll, setShowAll }) {
  return <div className="subpage"><PageHeading eyebrow="YOUR MONEY HISTORY" title="Transactions" subtitle="Track the ins and outs of your wallet." right={<button className="button-secondary" onClick={() => setShowAll(!showAll)}><FileText size={16} /> {showAll ? "Show recent" : "All activity"}</button>} />
    <div className="search-row"><div className="search-box"><Search size={17} /><input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search transactions..." /></div><button className="button-secondary filter-button" onClick={() => setSearch("")}>Clear search</button></div>
    <div className="transaction-card full-transactions"><div className="transaction-table-head"><span>TRANSACTION</span><span>DATE</span><span>AMOUNT</span><span>STATUS</span></div>
      {(showAll ? transactions : transactions.slice(0, 5)).map((tx) => <TransactionRow key={tx.id} tx={tx} />)}
      {transactions.length === 0 && <div className="empty-state"><Search size={25} /><strong>No matching transactions</strong><p>Try another search term.</p></div>}
    </div>
  </div>;
}

function ProfilePage({ profileName, draftName, setDraftName, saveName, dark, setDark, toast }) {
  const [email, setEmail] = useState("charles@example.com");
  return <div className="subpage"><PageHeading eyebrow="ACCOUNT SETTINGS" title="Your profile" subtitle="Make MoniFlow feel like your own." />
    <div className="profile-layout"><div className="profile-main-card"><div className="profile-banner"><div className="profile-avatar-large">{profileName.split(" ").map((s) => s[0]).join("").slice(0, 2).toUpperCase()}</div><div><h2>{profileName}</h2><p>Personal wallet member</p></div><span className="verified-tag"><ShieldCheck size={14} /> Verified demo</span></div>
      <div className="profile-form"><div className="profile-section-heading"><h3>Personal information</h3><p>Update the details shown on your account.</p></div>
        <label>Full name<input value={draftName} onChange={(e) => setDraftName(e.target.value)} placeholder="Enter your name" /></label>
        <label>Email address<input type="email" value={email} onChange={(e) => setEmail(e.target.value)} /></label>
        <div className="profile-save-row"><span>Your name updates across the dashboard.</span><button className="button-primary" onClick={saveName}>Save changes <Check size={16} /></button></div>
      </div>
    </div>
    <div className="profile-settings-card"><div className="profile-section-heading"><h3>Appearance</h3><p>Choose how MoniFlow looks on your device.</p></div>
      <button className={`theme-choice ${!dark ? "theme-selected" : ""}`} onClick={() => { setDark(false); toast("Light theme enabled."); }}><span className="theme-preview light-preview"><Sun size={20} /></span><span><strong>Light mode</strong><small>Bright, clean and airy</small></span><span className="radio-dot">{!dark && <i />}</span></button>
      <button className={`theme-choice ${dark ? "theme-selected" : ""}`} onClick={() => { setDark(true); toast("Dark theme enabled."); }}><span className="theme-preview dark-preview"><Moon size={20} /></span><span><strong>Dark mode</strong><small>Easy on the eyes, day or night</small></span><span className="radio-dot">{dark && <i />}</span></button>
      <div className="settings-divider" />
      <div className="setting-line"><span className="setting-icon"><LockKeyhole size={17} /></span><span><strong>Privacy & security</strong><small>Demo interface · no financial account connected</small></span><ShieldCheck className="setting-trailing" size={18} /></div>
      <button className="setting-line" onClick={() => toast("You're using the MoniFlow UI demo.")}><span className="setting-icon"><CircleHelp size={17} /></span><span><strong>About MoniFlow</strong><small>Wallet dashboard concept · v1.0</small></span><ArrowRight className="setting-trailing" size={17} /></button>
    </div></div>
  </div>;
}

export default App;
