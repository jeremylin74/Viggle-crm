const NAV = [
  { id: 'dashboard',        label: 'Dashboard',      icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
  { id: 'creators',         label: 'Creators',        icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z' },
  { id: 'pipeline',         label: 'Pipeline',        icon: 'M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2' },
  { id: 'deals',            label: 'Deals',           icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z' },
  { id: 'contracts',        label: 'Contracts',       icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' },
  { id: 'videos',           label: 'Video Schedule',  icon: 'M15 10l4.553-2.069A1 1 0 0121 8.82v6.36a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z' },
  { id: 'analytics',        label: 'Analytics',       icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z' },
  { id: 'payments',         label: 'Payments',        icon: 'M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z' },
  { id: 'links',            label: 'Campaign Links',  icon: 'M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1' },
  { id: 'templates',        label: 'Templates',       icon: 'M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2' },
  { id: 'activity',         label: 'Activity Log',    icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z' },
  { id: 'settings',         label: 'Settings',        icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z' },
];

function LoadingScreen() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="w-14 h-14 rounded-2xl flex items-center justify-center font-black text-gray-900 text-2xl mx-auto mb-4"
          style={{background:'linear-gradient(135deg,#d9ff00 0%,#84cc16 100%)'}}>V</div>
        <p className="text-gray-400 text-sm">Loading…</p>
      </div>
    </div>
  );
}

function LoginScreen({ onSuccess }) {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [mode, setMode] = React.useState('login');
  const [error, setError] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [signedUp, setSignedUp] = React.useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      if (mode === 'signup') {
        await DB.signUp(email, password);
        setSignedUp(true);
      } else {
        await DB.signIn(email, password);
        onSuccess();
      }
    } catch(err) {
      setError(err.message || 'Authentication failed');
    }
    setLoading(false);
  }

  if (signedUp) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 w-full max-w-sm p-8 text-center">
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center font-black text-gray-900 text-2xl mx-auto mb-4"
            style={{background:'linear-gradient(135deg,#d9ff00 0%,#84cc16 100%)'}}>V</div>
          <h2 className="text-lg font-semibold text-gray-800 mb-2">Check your email</h2>
          <p className="text-sm text-gray-500 mb-6">We sent a confirmation link to <strong>{email}</strong>. Click it to activate your account, then sign in.</p>
          <button onClick={() => { setMode('login'); setSignedUp(false); }}
            className="w-full py-2.5 rounded-xl font-semibold text-sm text-gray-900 transition-all"
            style={{background:'linear-gradient(135deg,#d9ff00 0%,#84cc16 100%)'}}>
            Back to Sign In
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 w-full max-w-sm p-8">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center font-black text-gray-900 text-lg shrink-0"
            style={{background:'linear-gradient(135deg,#d9ff00 0%,#84cc16 100%)'}}>V</div>
          <div>
            <p className="font-bold text-gray-900 leading-tight">Creator CRM</p>
            <p className="text-xs text-gray-400">Viggle &amp; PINOC</p>
          </div>
        </div>
        <h2 className="text-base font-semibold text-gray-800 mb-1">
          {mode === 'login' ? 'Sign in to your team' : 'Create an account'}
        </h2>
        <p className="text-xs text-gray-400 mb-6">
          {mode === 'login' ? 'Access your creator partnerships.' : 'Invite yourself — your admin can approve.'}
        </p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Email</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} required autoFocus
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-lime-400 transition-colors"
              placeholder="you@viggle.ai" />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Password</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} required
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-lime-400 transition-colors"
              placeholder="••••••••" />
          </div>
          {error && (
            <p className="text-xs text-red-600 bg-red-50 rounded-lg px-3 py-2 border border-red-100">{error}</p>
          )}
          <button type="submit" disabled={loading}
            className="w-full py-2.5 rounded-xl font-semibold text-sm text-gray-900 transition-all hover:opacity-90 disabled:opacity-60"
            style={{background:'linear-gradient(135deg,#d9ff00 0%,#84cc16 100%)'}}>
            {loading ? 'Please wait…' : (mode === 'login' ? 'Sign In' : 'Create Account')}
          </button>
        </form>
        <button onClick={() => { setMode(mode === 'login' ? 'signup' : 'login'); setError(''); }}
          className="w-full text-center text-xs text-gray-400 hover:text-gray-600 mt-4 transition-colors">
          {mode === 'login' ? "Need an account? Sign up" : 'Already have an account? Sign in'}
        </button>
      </div>
    </div>
  );
}

function App() {
  const [data, setDataRaw] = React.useState(null);
  const [appState, setAppState] = React.useState('loading'); // loading | login | ready
  const [supaEnabled, setSupaEnabled] = React.useState(false);
  const [page, setPage] = React.useState('dashboard');
  const [creatorId, setCreatorId] = React.useState(null);
  const [sidebarOpen, setSidebarOpen] = React.useState(true);
  const [myView, setMyView] = React.useState(false);

  React.useEffect(() => {
    async function init() {
      const localData = CRM.loadData();
      setDataRaw(localData);

      if (!DB.isConfigured()) {
        setAppState('ready');
        return;
      }
      setSupaEnabled(true);
      try {
        const session = await DB.getSession();
        if (session) {
          const sbData = await DB.loadData();
          if (sbData) {
            const merged = CRM.mergeVigglers({ ...localData, ...sbData });
            setDataRaw(merged);
            CRM.saveData(merged);
            DB.saveData(merged);
          }
          setAppState('ready');
        } else {
          setAppState('login');
        }
      } catch(e) {
        console.warn('Supabase init error:', e);
        setAppState('ready');
      }
    }
    init();
  }, []);

  React.useEffect(() => {
    if (appState !== 'ready' || !supaEnabled) return;
    const sub = DB.subscribeToChanges(newData => {
      setDataRaw(prev => {
        const merged = { ...prev, ...newData };
        CRM.saveData(merged);
        return merged;
      });
    });
    return () => { if (sub) { try { sub.unsubscribe(); } catch(e){} } };
  }, [appState, supaEnabled]);

  async function handleLogin() {
    const sbData = await DB.loadData();
    if (sbData) {
      const merged = { ...CRM.loadData(), ...sbData };
      setDataRaw(merged);
      CRM.saveData(merged);
    }
    setAppState('ready');
  }

  async function handleSignOut() {
    await DB.signOut();
    setAppState('login');
  }

  function setData(updater) {
    setDataRaw(prev => {
      const next = typeof updater === 'function' ? updater(prev) : updater;
      CRM.saveData(next);
      if (supaEnabled) DB.saveData(next);
      return next;
    });
  }

  function navigate(pageId, id) {
    setPage(pageId);
    if (id !== undefined) setCreatorId(id);
  }

  if (appState === 'loading' || !data) return <LoadingScreen />;
  if (appState === 'login') return <LoginScreen onSuccess={handleLogin} />;

  const currentUser = data.team_members.find(m => m.id === data.current_user_id);
  const overdueCount = data.videos.filter(v => Utils.isOverdue(v.draft_due_date) && !['Posted','Cancelled','Draft Submitted','In Review','Approved','Scheduled'].includes(v.video_status)).length;
  const pendingPayCount = data.payments.filter(p => !['Paid','Cancelled'].includes(p.payment_status)).length;
  const repostableCount = data.content_assets.filter(a => a.content_status === 'Repostable').length;

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Sidebar */}
      <aside className={`${sidebarOpen ? 'w-56' : 'w-14'} bg-gray-900 flex flex-col shrink-0 transition-all duration-200 overflow-hidden`}>
        {/* Logo */}
        {sidebarOpen ? (
          <div className="flex items-center gap-2.5 px-4 py-4 border-b border-gray-800">
            <div className="w-7 h-7 rounded-lg shrink-0 flex items-center justify-center font-black text-gray-900 text-base" style={{background:'linear-gradient(135deg,#d9ff00 0%,#84cc16 100%)'}}>V</div>
            <div className="min-w-0">
              <p className="text-white font-bold text-sm leading-tight">Creator CRM</p>
              <p className="text-gray-400 text-xs">Viggle &amp; PINOC</p>
            </div>
            <button onClick={() => setSidebarOpen(false)} className="ml-auto text-gray-500 hover:text-gray-300 shrink-0 p-0.5">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
              </svg>
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center py-3 border-b border-gray-800 gap-2">
            <button onClick={() => setSidebarOpen(true)} className="w-9 h-9 rounded-lg flex items-center justify-center font-black text-gray-900 text-base hover:scale-105 transition-transform" style={{background:'linear-gradient(135deg,#d9ff00 0%,#84cc16 100%)'}}>V</button>
          </div>
        )}

        {/* Nav */}
        <nav className="flex-1 py-2 overflow-y-auto scrollbar-hide">
          {NAV.map(item => {
            const active = page === item.id || (page === 'creator-profile' && item.id === 'creators');
            return (
              <button
                key={item.id}
                onClick={() => navigate(item.id)}
                title={!sidebarOpen ? item.label : undefined}
                className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium transition-all relative
                  ${active ? 'bg-lime-500/15 text-lime-400' : 'text-gray-400 hover:bg-gray-800 hover:text-white'}`}
              >
                {active && <span className="absolute left-0 top-1 bottom-1 w-0.5 bg-lime-400 rounded-r" />}
                <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d={item.icon} />
                </svg>
                {sidebarOpen && <span className="truncate">{item.label}</span>}
              </button>
            );
          })}
        </nav>

        {/* Current user */}
        <div className="p-3 border-t border-gray-800 space-y-2">
          {sidebarOpen ? (
            <>
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-lime-400 to-green-600 flex items-center justify-center text-white text-xs font-bold shrink-0">
                  {currentUser?.name?.[0] || 'U'}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-medium text-gray-200 truncate">{currentUser?.name}</p>
                  <p className="text-xs text-gray-500 truncate">{currentUser?.role}</p>
                </div>
              </div>
              <select
                value={data.current_user_id}
                onChange={e => setData(d => ({ ...d, current_user_id: e.target.value }))}
                className="w-full text-xs bg-gray-800 border border-gray-700 rounded-lg px-2 py-1.5 text-gray-300 focus:border-lime-400 focus:outline-none"
              >
                {data.team_members.map(m => <option key={m.id} value={m.id}>{m.name} — {m.role}</option>)}
              </select>
              {supaEnabled && (
                <button onClick={handleSignOut}
                  className="w-full flex items-center justify-center gap-2 px-3 py-1.5 rounded-lg bg-gray-800 hover:bg-red-900/40 text-gray-400 hover:text-red-400 text-xs font-medium transition-all border border-gray-700 hover:border-red-800">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  Sign Out
                </button>
              )}
            </>
          ) : (
            <div className="flex flex-col items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-lime-400 to-green-600 flex items-center justify-center text-white text-xs font-bold">
                {currentUser?.name?.[0] || 'U'}
              </div>
              {supaEnabled && (
                <button onClick={handleSignOut} title="Sign out"
                  className="text-gray-500 hover:text-red-400 transition-colors p-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                </button>
              )}
            </div>
          )}
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top bar */}
        <header className="bg-white border-b border-gray-100 px-5 py-2.5 flex items-center gap-3 shrink-0">
          <p className="text-sm font-semibold text-gray-700">
            {NAV.find(n => n.id === page)?.label || (page === 'creator-profile' ? 'Creator Profile' : '')}
          </p>
          {supaEnabled && (
            <span className="flex items-center gap-1 text-xs text-lime-600 bg-lime-50 px-2 py-0.5 rounded-full border border-lime-200">
              <span className="w-1.5 h-1.5 bg-lime-500 rounded-full" />
              Live sync
            </span>
          )}
          <div className="ml-auto flex items-center gap-2 flex-wrap">
            <button
              onClick={() => setMyView(v => !v)}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold border transition-all ${myView ? 'bg-lime-400 text-gray-900 border-lime-500 shadow-sm' : 'bg-white text-gray-500 border-gray-200 hover:border-gray-300'}`}
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>
              {myView ? 'My Contacts' : 'Everyone'}
            </button>
            {overdueCount > 0 && (
              <button onClick={() => navigate('videos')}
                className="flex items-center gap-1.5 px-2.5 py-1.5 bg-red-50 text-red-600 rounded-lg text-xs font-medium hover:bg-red-100 transition-all">
                <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse" style={{animation:'pulse 2s infinite'}} />
                {overdueCount} overdue
              </button>
            )}
            {pendingPayCount > 0 && (
              <button onClick={() => navigate('payments')}
                className="flex items-center gap-1.5 px-2.5 py-1.5 bg-amber-50 text-amber-600 rounded-lg text-xs font-medium hover:bg-amber-100 transition-all">
                <span className="w-1.5 h-1.5 bg-amber-400 rounded-full" />
                {pendingPayCount} payment{pendingPayCount !== 1 ? 's' : ''} pending
              </button>
            )}
            {repostableCount > 0 && (
              <button onClick={() => navigate('content')}
                className="flex items-center gap-1.5 px-2.5 py-1.5 bg-emerald-50 text-emerald-600 rounded-lg text-xs font-medium hover:bg-emerald-100 transition-all">
                <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full" />
                {repostableCount} repostable
              </button>
            )}
          </div>
        </header>

        {/* Page */}
        <main className="flex-1 overflow-y-auto p-5">
          {page === 'dashboard'       && <Dashboard data={data} navigate={navigate} />}
          {page === 'creators'        && <Creators data={data} setData={setData} navigate={navigate} myView={myView} />}
          {page === 'creator-profile' && <CreatorProfile data={data} setData={setData} creatorId={creatorId} navigate={navigate} />}
          {page === 'pipeline'        && <Pipeline data={data} setData={setData} navigate={navigate} myView={myView} />}
          {page === 'deals'           && <Deals data={data} setData={setData} navigate={navigate} myView={myView} />}
          {page === 'contracts'       && <Contracts data={data} setData={setData} myView={myView} />}
          {page === 'videos'          && <Videos data={data} setData={setData} navigate={navigate} myView={myView} />}
          {page === 'analytics'       && <Analytics data={data} setData={setData} navigate={navigate} />}
          {page === 'payments'        && <Payments data={data} setData={setData} />}
          {page === 'content'         && <Analytics data={data} setData={setData} navigate={navigate} initialTab="content" />}
          {page === 'links'           && <CampaignLinks data={data} setData={setData} />}
          {page === 'templates'       && <Templates data={data} setData={setData} />}
          {page === 'activity'        && <ActivityLog data={data} />}
          {page === 'settings'        && <Settings data={data} setData={setData} supaEnabled={supaEnabled} onSupabaseConnect={() => setSupaEnabled(true)} />}
        </main>
      </div>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
