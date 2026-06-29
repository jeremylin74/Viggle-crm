// CampaignLinks, Templates, ActivityLog, Settings pages

function CampaignLinks({ data, setData }) {
  const [modal, setModal] = React.useState(null);
  const [form, setForm] = React.useState(null);
  const setF = (k,v) => setForm(f=>({...f,[k]:v}));

  const blankForm = { campaign_id:'', campaign_name:'', product:'Viggle', landing_page_url:'', cta_link:'', utm_link:'', creator_specific_link:'', tracking_link:'', notes:'' };

  function openModal(link) {
    setForm(link ? {...link} : {...blankForm});
    setModal(true);
  }

  function save() {
    const now = Utils.now();
    if (!form.id) {
      setData(d=>({...d,campaign_links:[...d.campaign_links,{...form,id:Utils.uid(),created_at:now,updated_at:now}]}));
    } else {
      setData(d=>({...d,campaign_links:d.campaign_links.map(x=>x.id===form.id?{...form,updated_at:now}:x)}));
    }
    setModal(null);
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-gray-900">Campaign Links</h1>
        <Btn onClick={()=>openModal(null)}>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
          Add Link Set
        </Btn>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {data.campaign_links.map(link => (
          <Card key={link.id} className="p-4">
            <div className="flex items-start justify-between mb-3">
              <div>
                <p className="font-semibold text-gray-800">{link.campaign_name || data.campaigns.find(c=>c.id===link.campaign_id)?.campaign_name || 'Unnamed'}</p>
                <Badge className={Utils.productColor(link.product)}>{link.product}</Badge>
              </div>
              <Btn size="sm" variant="ghost" onClick={()=>openModal(link)}>Edit</Btn>
            </div>
            <div className="space-y-2 text-xs">
              {[
                ['Landing Page', link.landing_page_url],
                ['CTA Link', link.cta_link],
                ['UTM Link', link.utm_link],
                ['Creator Link', link.creator_specific_link],
                ['Tracking', link.tracking_link],
              ].filter(([,v])=>v).map(([label,url]) => (
                <div key={label} className="flex items-center gap-2">
                  <span className="text-gray-400 w-24 shrink-0">{label}</span>
                  <a href={url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline truncate">{url}</a>
                  <button onClick={()=>navigator.clipboard.writeText(url)} className="text-gray-300 hover:text-gray-500 shrink-0">
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                  </button>
                </div>
              ))}
            </div>
            {link.notes && <p className="text-xs text-gray-400 mt-2 bg-gray-50 rounded p-2">{link.notes}</p>}
          </Card>
        ))}
        {data.campaign_links.length === 0 && <EmptyState title="No campaign links yet" description="Add links for your campaigns to keep tracking URLs organized." />}
      </div>

      <Modal open={!!modal} onClose={()=>setModal(null)} title={form?.id?'Edit Link Set':'New Link Set'}>
        {form && (
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <Input label="Campaign Name" value={form.campaign_name} onChange={v=>setF('campaign_name',v)} className="col-span-2" />
              <Select label="Campaign" value={form.campaign_id} onChange={v=>setF('campaign_id',v)} options={data.campaigns.map(c=>({value:c.id,label:c.campaign_name}))} />
              <Select label="Product" value={form.product} onChange={v=>setF('product',v)} options={['Viggle','PINOC','Both']} />
            </div>
            <Input label="Landing Page URL" value={form.landing_page_url} onChange={v=>setF('landing_page_url',v)} placeholder="https://..." />
            <Input label="CTA Link" value={form.cta_link} onChange={v=>setF('cta_link',v)} placeholder="https://..." />
            <Input label="UTM Link" value={form.utm_link} onChange={v=>setF('utm_link',v)} placeholder="https://...?utm_..." />
            <Input label="Creator-Specific Link" value={form.creator_specific_link} onChange={v=>setF('creator_specific_link',v)} placeholder="https://...?ref=[CREATOR]" />
            <Input label="Tracking Link" value={form.tracking_link} onChange={v=>setF('tracking_link',v)} />
            <Textarea label="Notes" value={form.notes} onChange={v=>setF('notes',v)} rows={2} />
            <div className="flex justify-end gap-2 pt-2">
              <Btn variant="secondary" onClick={()=>setModal(null)}>Cancel</Btn>
              <Btn onClick={save}>Save</Btn>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

const TEMPLATE_CATEGORIES = ['Outreach','Follow-up','Contract','Brief','Payment','Other'];

function Templates({ data, setData }) {
  const [modal, setModal] = React.useState(null);
  const [viewModal, setViewModal] = React.useState(null);
  const [form, setForm] = React.useState(null);
  const [filterType, setFilterType] = React.useState('');
  const setF = (k,v) => setForm(f=>({...f,[k]:v}));

  const filtered = data.templates.filter(t => !filterType || t.template_type===filterType);

  function openAdd() { setForm({template_name:'',template_type:'Outreach',product:'Both',template_text:'',notes:'',attached_files:[]}); setModal(true); }
  function openEdit(t) { setForm({...t, attached_files: t.attached_files||[]}); setModal(true); }

  function addFiles(fileList) {
    Array.from(fileList).forEach(file => {
      const sizeStr = file.size > 1024*1024 ? (file.size/1024/1024).toFixed(1)+' MB' : (file.size/1024).toFixed(0)+' KB';
      const reader = new FileReader();
      reader.onload = ev => {
        setForm(f => ({
          ...f,
          attached_files: [...(f.attached_files||[]), {
            id: Utils.uid(), name: file.name, size: sizeStr, type: file.type, data: ev.target.result
          }]
        }));
      };
      reader.readAsDataURL(file);
    });
  }

  function removeFile(id) { setForm(f=>({...f, attached_files:(f.attached_files||[]).filter(x=>x.id!==id)})); }

  function openFile(f) {
    const w = window.open();
    if (f.type === 'application/pdf') {
      w.document.write('<iframe src="'+f.data+'" style="width:100%;height:100%;border:none;position:fixed;top:0;left:0;"></iframe>');
    } else if (f.type.startsWith('image/')) {
      w.document.write('<img src="'+f.data+'" style="max-width:100%;display:block;margin:auto;">');
    } else {
      const a = w.document.createElement('a'); a.href = f.data; a.download = f.name; w.document.body.appendChild(a); a.click();
    }
  }
  function save() {
    const now = Utils.now();
    if (!form.id) setData(d=>({...d,templates:[...d.templates,{...form,id:Utils.uid(),created_at:now,updated_at:now}]}));
    else setData(d=>({...d,templates:d.templates.map(x=>x.id===form.id?{...form,updated_at:now}:x)}));
    setModal(null);
  }
  function del(id) { if(!confirm('Delete template?'))return; setData(d=>({...d,templates:d.templates.filter(x=>x.id!==id)})); }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-gray-900">Templates</h1>
        <Btn onClick={openAdd}>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
          New Template
        </Btn>
      </div>

      <div className="flex gap-2 flex-wrap">
        {['', ...TEMPLATE_CATEGORIES].map(t => (
          <button key={t} onClick={()=>setFilterType(t)}
            className={`px-3 py-1.5 text-sm rounded-lg border transition-all ${filterType===t?'bg-lime-500 text-white border-lime-500':'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'}`}>
            {t||'All'}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {filtered.map(t => (
          <Card key={t.id} className="p-4">
            <div className="flex items-start justify-between mb-2">
              <div className="min-w-0 flex-1">
                <p className="font-semibold text-gray-800 text-sm truncate">{t.template_name}</p>
                <div className="flex gap-1 mt-1">
                  <Badge className="bg-blue-100 text-blue-600">{t.template_type}</Badge>
                  <Badge className={Utils.productColor(t.product)}>{t.product}</Badge>
                </div>
              </div>
              <div className="flex gap-1 ml-2 shrink-0">
                <button onClick={()=>openEdit(t)} className="text-gray-400 hover:text-gray-600 p-1"><svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg></button>
                <button onClick={()=>del(t.id)} className="text-gray-400 hover:text-red-500 p-1"><svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg></button>
              </div>
            </div>
            <p className="text-xs text-gray-500 line-clamp-3 whitespace-pre-line">{t.template_text}</p>
            {(t.attached_files||[]).length > 0 && (
              <div className="mt-2 flex flex-wrap gap-1">
                {(t.attached_files||[]).map(f => (
                  <button key={f.id} onClick={()=>openFile(f)}
                    className="flex items-center gap-1 px-2 py-1 bg-gray-50 border border-gray-200 rounded-md text-xs text-gray-600 hover:border-lime-400 hover:text-lime-700 transition-all">
                    <span>{f.type==='application/pdf'?'📄':f.type.startsWith('image/')?'🖼️':'📎'}</span>
                    <span className="max-w-24 truncate">{f.name}</span>
                  </button>
                ))}
              </div>
            )}
            <div className="flex gap-2 mt-3">
              <Btn size="sm" variant="secondary" onClick={()=>setViewModal(t)}>View</Btn>
              <Btn size="sm" variant="ghost" onClick={()=>navigator.clipboard.writeText(t.template_text)}>Copy</Btn>
            </div>
          </Card>
        ))}
        {filtered.length===0 && <div className="col-span-3"><EmptyState title="No templates" /></div>}
      </div>

      <Modal open={!!modal} onClose={()=>setModal(null)} title={form?.id?'Edit Template':'New Template'} size="lg">
        {form && (
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <Input label="Template Name" value={form.template_name} onChange={v=>setF('template_name',v)} required className="col-span-2" />
              <Select label="Type" value={form.template_type} onChange={v=>setF('template_type',v)} options={TEMPLATE_CATEGORIES} />
              <Select label="Product" value={form.product} onChange={v=>setF('product',v)} options={['Viggle','PINOC','Both']} />
            </div>
            <Textarea label="Template Text" value={form.template_text} onChange={v=>setF('template_text',v)} rows={8} />
            <Textarea label="Notes" value={form.notes} onChange={v=>setF('notes',v)} rows={2} />
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-2">Attached Files</label>
              {(form.attached_files||[]).length > 0 && (
                <div className="space-y-1.5 mb-2">
                  {(form.attached_files||[]).map(f => (
                    <div key={f.id} className="flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-lg border border-gray-100">
                      <span className="text-base">{f.type==='application/pdf'?'📄':f.type.startsWith('image/')? '🖼️':'📎'}</span>
                      <span className="text-xs font-medium text-gray-700 flex-1 truncate">{f.name}</span>
                      <span className="text-xs text-gray-400 shrink-0">{f.size}</span>
                      <button type="button" onClick={()=>openFile(f)} className="text-xs text-lime-600 hover:underline shrink-0">View</button>
                      <button type="button" onClick={()=>removeFile(f.id)} className="text-xs text-red-400 hover:underline shrink-0">✕</button>
                    </div>
                  ))}
                </div>
              )}
              <label className="flex flex-col items-center justify-center w-full h-20 border-2 border-dashed border-gray-200 rounded-lg cursor-pointer hover:border-lime-400 hover:bg-lime-50/40 transition-all">
                <svg className="w-5 h-5 text-gray-400 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" /></svg>
                <span className="text-xs text-gray-500">Click to attach files</span>
                <span className="text-xs text-gray-400">PDF, images, docs — any format</span>
                <input type="file" multiple className="hidden" onChange={e=>addFiles(e.target.files)} />
              </label>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <Btn variant="secondary" onClick={()=>setModal(null)}>Cancel</Btn>
              <Btn onClick={save}>Save Template</Btn>
            </div>
          </div>
        )}
      </Modal>

      <Modal open={!!viewModal} onClose={()=>setViewModal(null)} title={viewModal?.template_name||'Template'} size="lg">
        {viewModal && (
          <div>
            <pre className="bg-gray-50 rounded-xl p-4 text-xs text-gray-700 whitespace-pre-wrap leading-relaxed overflow-auto max-h-72">{viewModal.template_text}</pre>
            {(viewModal.attached_files||[]).length > 0 && (
              <div className="mt-4">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Attached Files</p>
                <div className="space-y-1.5">
                  {(viewModal.attached_files||[]).map(f => (
                    <div key={f.id} className="flex items-center gap-3 px-3 py-2 bg-gray-50 rounded-lg border border-gray-100">
                      <span className="text-lg">{f.type==='application/pdf'?'📄':f.type.startsWith('image/')?'🖼️':'📎'}</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-700 truncate">{f.name}</p>
                        <p className="text-xs text-gray-400">{f.size}</p>
                      </div>
                      <button onClick={()=>openFile(f)} className="text-xs text-lime-600 hover:underline font-medium">Open</button>
                      <a href={f.data} download={f.name} className="text-xs text-gray-500 hover:underline font-medium">Download</a>
                    </div>
                  ))}
                </div>
              </div>
            )}
            <div className="flex gap-2 mt-4">
              <Btn onClick={()=>navigator.clipboard.writeText(viewModal.template_text)}>Copy Text</Btn>
              <Btn variant="ghost" onClick={()=>setViewModal(null)}>Close</Btn>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

function ActivityLog({ data }) {
  const [search, setSearch] = React.useState('');
  const creatorName = id => data.creators.find(c=>c.id===id)?.name||'';
  const userName = id => data.team_members.find(m=>m.id===id)?.name||'System';

  const logs = [...data.activity_log]
    .sort((a,b)=>new Date(b.timestamp)-new Date(a.timestamp))
    .filter(l => !search || l.action.toLowerCase().includes(search.toLowerCase()) || creatorName(l.related_creator_id).toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-gray-900">Activity Log</h1>
        <SearchInput value={search} onChange={setSearch} placeholder="Search activity..." />
      </div>

      <Card className="divide-y divide-gray-50">
        {logs.length === 0 && <div className="py-12 text-center text-gray-400 text-sm">No activity yet</div>}
        {logs.map((log, i) => (
          <div key={log.id||i} className="flex items-start gap-4 px-5 py-3 hover:bg-gray-50/50">
            <div className="w-7 h-7 rounded-full bg-blue-100 flex items-center justify-center shrink-0 mt-0.5">
              <span className="text-blue-600 text-xs font-bold">{userName(log.user_id)?.[0]||'?'}</span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="text-sm font-medium text-gray-800">{userName(log.user_id)}</span>
                  <span className="text-sm text-gray-600 ml-1">{log.action}</span>
                  {log.related_creator_id && (
                    <span className="text-sm text-blue-500 ml-1">· {creatorName(log.related_creator_id)}</span>
                  )}
                </div>
                <span className="text-xs text-gray-400 shrink-0">{Utils.fmt(log.timestamp?.slice(0,10))}</span>
              </div>
              {log.old_value && log.new_value && (
                <p className="text-xs text-gray-400 mt-0.5">
                  <span className="line-through">{log.old_value}</span> → <span className="text-gray-600">{log.new_value}</span>
                </p>
              )}
            </div>
          </div>
        ))}
      </Card>
    </div>
  );
}

function Settings({ data, setData, supaEnabled, onSupabaseConnect }) {
  const [supaUrl, setSupaUrl] = React.useState(localStorage.getItem('crm_supabase_url')||data.supabase_url||'');
  const [supaKey, setSupaKey] = React.useState(localStorage.getItem('crm_supabase_key')||data.supabase_key||'');
  const [saved, setSaved] = React.useState(false);
  const [testing, setTesting] = React.useState(false);
  const [testResult, setTestResult] = React.useState(null);
  const [newMember, setNewMember] = React.useState({name:'',email:'',role:'Team Member'});
  const [newLabel, setNewLabel] = React.useState('');
  const [newCreatorType, setNewCreatorType] = React.useState('');
  const productLabels = data.product_labels || ['Viggle','PINOC','Both'];
  const DEFAULT_CREATOR_TYPES = ['Football editor','3D animator','AI creator','Meme creator','Game developer','Tutorial creator','TikTok creator','YouTube creator','Instagram creator','Other'];
  const creatorTypes = data.creator_types || DEFAULT_CREATOR_TYPES;

  function addLabel() {
    const lbl = newLabel.trim();
    if (!lbl || productLabels.includes(lbl)) return;
    setData(d=>({...d, product_labels:[...(d.product_labels||['Viggle','PINOC','Both']), lbl]}));
    setNewLabel('');
  }

  function removeLabel(lbl) {
    setData(d=>({...d, product_labels:(d.product_labels||['Viggle','PINOC','Both']).filter(l=>l!==lbl)}));
  }

  function addCreatorType() {
    const t = newCreatorType.trim();
    if (!t || creatorTypes.includes(t)) return;
    setData(d=>({...d, creator_types:[...(d.creator_types||DEFAULT_CREATOR_TYPES), t]}));
    setNewCreatorType('');
  }

  function removeCreatorType(t) {
    setData(d=>({...d, creator_types:(d.creator_types||DEFAULT_CREATOR_TYPES).filter(x=>x!==t)}));
  }

  function saveSupabase() {
    // Save to both the data blob and dedicated localStorage keys (used on startup)
    localStorage.setItem('crm_supabase_url', supaUrl);
    localStorage.setItem('crm_supabase_key', supaKey);
    DB.resetClient();
    setData(d=>({...d,supabase_url:supaUrl,supabase_key:supaKey}));
    setSaved(true);
    setTestResult(null);
    setTimeout(()=>setSaved(false),2000);
  }

  async function testConnection() {
    setTesting(true);
    setTestResult(null);
    localStorage.setItem('crm_supabase_url', supaUrl);
    localStorage.setItem('crm_supabase_key', supaKey);
    DB.resetClient();
    try {
      const session = await DB.getSession();
      if (session) {
        setTestResult({ ok: true, msg: 'Connected! You are signed in.' });
        onSupabaseConnect && onSupabaseConnect();
      } else {
        setTestResult({ ok: true, msg: 'Connection works. Sign in or create an account.' });
        onSupabaseConnect && onSupabaseConnect();
      }
    } catch(e) {
      setTestResult({ ok: false, msg: 'Could not connect: ' + (e.message || 'check URL and key') });
    }
    setTesting(false);
  }

  async function pushToSupabase() {
    const ok = await DB.saveData(data);
    if (ok) alert('Data pushed to Supabase successfully! All team members will see this data on next load.');
    else alert('Push failed — make sure you are signed in and the crm_data table exists.');
  }

  function addMember() {
    if(!newMember.name||!newMember.email) return;
    const now = Utils.now();
    setData(d=>({...d,team_members:[...d.team_members,{...newMember,id:Utils.uid(),created_at:now,updated_at:now}]}));
    setNewMember({name:'',email:'',role:'Team Member'});
  }

  function deleteMember(id) {
    if(id===data.current_user_id){alert('Cannot delete yourself.');return;}
    if(!confirm('Remove team member?'))return;
    setData(d=>({...d,team_members:d.team_members.filter(m=>m.id!==id)}));
  }

  return (
    <div className="space-y-5 max-w-2xl">
      <h1 className="text-xl font-bold text-gray-900">Settings</h1>

      <Card className="p-5">
        <div className="flex items-center gap-2 mb-1">
          <h2 className="text-sm font-semibold text-gray-800">Supabase Integration</h2>
          {supaEnabled && (
            <span className="flex items-center gap-1 text-xs text-lime-600 bg-lime-50 px-2 py-0.5 rounded-full border border-lime-200">
              <span className="w-1.5 h-1.5 bg-lime-500 rounded-full" />
              Connected
            </span>
          )}
        </div>
        <p className="text-xs text-gray-500 mb-4">Connect your Supabase project so your whole team shares the same live data.</p>
        <div className="space-y-3">
          <Input label="Supabase Project URL" value={supaUrl} onChange={setSupaUrl} placeholder="https://xxxx.supabase.co" />
          <Input label="Supabase Anon Key" value={supaKey} onChange={setSupaKey} placeholder="eyJ..." />
          {testResult && (
            <div className={`text-xs rounded-lg px-3 py-2 border ${testResult.ok ? 'bg-lime-50 text-lime-700 border-lime-200' : 'bg-red-50 text-red-600 border-red-100'}`}>
              {testResult.msg}
            </div>
          )}
          <div className="flex gap-2 flex-wrap">
            <Btn onClick={saveSupabase}>{saved ? 'Saved!' : 'Save Config'}</Btn>
            <Btn variant="secondary" onClick={testConnection} disabled={!supaUrl || !supaKey}>
              {testing ? 'Testing…' : 'Test Connection'}
            </Btn>
            {supaEnabled && (
              <Btn variant="secondary" onClick={pushToSupabase}>Push Local Data → Supabase</Btn>
            )}
          </div>
        </div>
        {!supaUrl && (
          <div className="mt-4 bg-blue-50 rounded-lg p-3 text-xs text-blue-700">
            <p className="font-semibold mb-1">Setup steps:</p>
            <ol className="list-decimal list-inside space-y-1 text-blue-600">
              <li>Go to supabase.com → create a free project</li>
              <li>Project Settings → API → copy URL and anon key</li>
              <li>Run the SQL schema below in the Supabase SQL editor</li>
              <li>Paste URL + key above → Save Config → Test Connection</li>
              <li>Click "Push Local Data → Supabase" to upload your existing data</li>
              <li>Share the CRM URL with your team — they sign in with their own accounts</li>
            </ol>
          </div>
        )}
      </Card>

      <Card className="p-5">
        <h2 className="text-sm font-semibold text-gray-800 mb-1">Campaign / Product Fit Labels</h2>
        <p className="text-xs text-gray-500 mb-3">These labels appear in the Creator database as the "Product Fit / Campaign" field. Add your own to match any campaign.</p>
        <div className="flex flex-wrap gap-2 mb-3">
          {productLabels.map(lbl => (
            <span key={lbl} className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-medium">
              {lbl}
              <button onClick={()=>removeLabel(lbl)} className="ml-1 text-blue-400 hover:text-red-500 font-bold leading-none">×</button>
            </span>
          ))}
        </div>
        <div className="flex gap-2">
          <input value={newLabel} onChange={e=>setNewLabel(e.target.value)} onKeyDown={e=>e.key==='Enter'&&addLabel()} placeholder="New label (e.g. Summer Drop, Viggle v2...)" className="border border-gray-200 rounded-lg px-3 py-2 text-sm flex-1 focus:outline-none focus:border-blue-400" />
          <Btn size="sm" onClick={addLabel}>Add</Btn>
        </div>
      </Card>

      <Card className="p-5">
        <h2 className="text-sm font-semibold text-gray-800 mb-1">Creator Types</h2>
        <p className="text-xs text-gray-500 mb-3">These appear in the Creator Type dropdown when adding or editing a creator.</p>
        <div className="flex flex-wrap gap-2 mb-3">
          {creatorTypes.map(t => (
            <span key={t} className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-purple-100 text-purple-700 text-xs font-medium">
              {t}
              <button onClick={()=>removeCreatorType(t)} className="ml-1 text-purple-400 hover:text-red-500 font-bold leading-none">×</button>
            </span>
          ))}
        </div>
        <div className="flex gap-2">
          <input value={newCreatorType} onChange={e=>setNewCreatorType(e.target.value)} onKeyDown={e=>e.key==='Enter'&&addCreatorType()} placeholder="New type (e.g. Podcaster, Streamer...)" className="border border-gray-200 rounded-lg px-3 py-2 text-sm flex-1 focus:outline-none focus:border-purple-400" />
          <Btn size="sm" onClick={addCreatorType}>Add</Btn>
        </div>
      </Card>

      <Card className="p-5">
        <h2 className="text-sm font-semibold text-gray-800 mb-3">Team Members</h2>
        <div className="space-y-2 mb-4">
          {data.team_members.map(m => (
            <div key={m.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center text-white text-sm font-bold">{m.name[0]}</div>
                <div>
                  <p className="text-sm font-medium text-gray-800">{m.name} {m.id===data.current_user_id&&<span className="text-xs text-blue-500">(you)</span>}</p>
                  <p className="text-xs text-gray-500">{m.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge className={m.role==='Admin'?'bg-blue-100 text-blue-600':m.role==='Finance'?'bg-purple-100 text-purple-600':'bg-gray-100 text-gray-600'}>{m.role}</Badge>
                {m.id!==data.current_user_id && <Btn size="sm" variant="ghost" onClick={()=>deleteMember(m.id)}>Remove</Btn>}
              </div>
            </div>
          ))}
        </div>
        <div className="grid grid-cols-3 gap-2">
          <Input label="Name" value={newMember.name} onChange={v=>setNewMember(m=>({...m,name:v}))} />
          <Input label="Email" value={newMember.email} onChange={v=>setNewMember(m=>({...m,email:v}))} />
          <Select label="Role" value={newMember.role} onChange={v=>setNewMember(m=>({...m,role:v}))} options={['Admin','Team Member','Finance']} />
        </div>
        <Btn className="mt-2" variant="secondary" size="sm" onClick={addMember}>Add Member</Btn>
      </Card>

      <Card className="p-5">
        <h2 className="text-sm font-semibold text-gray-800 mb-1">Data</h2>
        <p className="text-xs text-gray-500 mb-3">Your data is saved in browser localStorage. Export or reset below.</p>
        <div className="flex gap-2">
          <Btn variant="secondary" onClick={()=>{
            const blob = new Blob([JSON.stringify(data,null,2)],{type:'application/json'});
            const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download='creator-crm-backup.json';a.click();
          }}>Export JSON</Btn>
          <Btn variant="danger" onClick={()=>{if(confirm('Reset all data to defaults?')){setData(CRM.resetData());}}}>Reset to Defaults</Btn>
        </div>
      </Card>

      <Card className="p-5">
        <h2 className="text-sm font-semibold text-gray-800 mb-2">Supabase SQL Schema</h2>
        <p className="text-xs text-gray-500 mb-3">Run this in your Supabase SQL editor to create all tables.</p>
        <button onClick={()=>navigator.clipboard.writeText(SUPABASE_SQL)} className="text-xs text-blue-500 hover:underline mb-2">Copy SQL</button>
        <pre className="bg-gray-900 text-green-300 rounded-xl p-4 text-xs overflow-auto max-h-64 font-mono">{SUPABASE_SQL}</pre>
      </Card>
    </div>
  );
}

const SUPABASE_SQL = `-- Creator CRM — Supabase Setup
-- Run this once in your Supabase SQL editor (Dashboard → SQL Editor → New query)

-- 1. Create the data table (single JSON blob, simplest approach)
create table if not exists crm_data (
  id text primary key default 'main',
  data jsonb not null,
  updated_at timestamptz default now()
);

-- 2. Enable Row Level Security
alter table crm_data enable row level security;

-- 3. Allow any signed-in team member to read and write
create policy "team read" on crm_data
  for select to authenticated using (true);

create policy "team write" on crm_data
  for all to authenticated using (true) with check (true);

-- 4. Enable Realtime so all browsers sync instantly
-- Go to: Supabase Dashboard → Database → Replication → Tables → enable crm_data
`;

