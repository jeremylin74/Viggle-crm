const CREATOR_STATUSES = ['Not contacted','Contacted','Responded','Interested','Negotiating','Approved internally','Contract sent','Contract signed','Content in progress','Content submitted','In review','Approved','Scheduled','Posted','Paid','Archived'];
const CREATOR_TYPES = ['Football editor','3D animator','AI creator','Meme creator','Game developer','Tutorial creator','TikTok creator','YouTube creator','Instagram creator','Other'];
const CREATOR_SOURCES = ['TikTok','Instagram','YouTube','X / Twitter','Discord','Referral','Inbound','Manual research','Existing partner'];
const PLATFORMS = ['TikTok','Instagram','YouTube','X / Twitter','Discord','Multiple'];
const PRODUCT_FIT = ['Viggle','PINOC','Both'];

function getProductLabels(data) {
  return (data.product_labels && data.product_labels.length > 0) ? data.product_labels : PRODUCT_FIT;
}

function getCreatorTypes(data) {
  return (data.creator_types && data.creator_types.length > 0) ? data.creator_types : CREATOR_TYPES;
}

function CreatorForm({ creator, data, setData, onSave, onClose }) {
  const [form, setForm] = React.useState(creator || {
    name:'', handle:'', primary_platform:'TikTok', tiktok_url:'', instagram_url:'', youtube_url:'',
    twitter_url:'', discord_username:'', email:'', whatsapp:'', country:'', timezone:'', niche:'',
    audience_size:'', average_views:'', engagement_notes:'', product_fit:'Viggle', campaign_id:'', creator_type:'',
    source:'TikTok', owner_id:data.current_user_id, current_status:'Not contacted', notes:'',
  });
  const set = (k, v) => setForm(f => ({...f, [k]: v}));

  return (
    <form onSubmit={e => { e.preventDefault(); onSave(form); }} className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <Input label="Name" value={form.name} onChange={v => set('name',v)} required className="col-span-2 md:col-span-1" />
        <Input label="Handle / Username" value={form.handle} onChange={v => set('handle',v)} placeholder="@handle" />
        <Select label="Primary Platform" value={form.primary_platform} onChange={v => set('primary_platform',v)} options={PLATFORMS} />
        <ProductFitSelect label="Product Fit" value={form.product_fit} onChange={v => set('product_fit',v)} data={data} setData={setData} />
        <CampaignSelect label="Campaign" value={form.campaign_id} onChange={v => set('campaign_id',v)} data={data} setData={setData} />
        <Select label="Creator Type" value={form.creator_type} onChange={v => set('creator_type',v)} options={getCreatorTypes(data)} />
        <Select label="Source" value={form.source} onChange={v => set('source',v)} options={CREATOR_SOURCES} />
        <Select label="Current Status" value={form.current_status} onChange={v => set('current_status',v)} options={CREATOR_STATUSES} />
        <Select label="Owner" value={form.owner_id} onChange={v => set('owner_id',v)} options={data.team_members.map(m=>({value:m.id,label:m.name}))} />
      </div>
      <div className="border-t border-gray-100 pt-3">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Platform Links</p>
        <div className="grid grid-cols-2 gap-3">
          <Input label="TikTok URL" value={form.tiktok_url} onChange={v => set('tiktok_url',v)} placeholder="https://tiktok.com/@..." />
          <Input label="Instagram URL" value={form.instagram_url} onChange={v => set('instagram_url',v)} placeholder="https://instagram.com/..." />
          <Input label="YouTube URL" value={form.youtube_url} onChange={v => set('youtube_url',v)} placeholder="https://youtube.com/@..." />
          <Input label="X / Twitter URL" value={form.twitter_url} onChange={v => set('twitter_url',v)} placeholder="https://x.com/..." />
          <Input label="Discord Username" value={form.discord_username} onChange={v => set('discord_username',v)} placeholder="user#1234" />
        </div>
      </div>
      <div className="border-t border-gray-100 pt-3">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Contact</p>
        <div className="grid grid-cols-2 gap-3">
          <Input label="Email" value={form.email} onChange={v => set('email',v)} type="email" />
          <Input label="WhatsApp" value={form.whatsapp} onChange={v => set('whatsapp',v)} placeholder="+1..." />
          <Input label="Country" value={form.country} onChange={v => set('country',v)} />
          <Input label="Time Zone" value={form.timezone} onChange={v => set('timezone',v)} placeholder="EST, CET, PST..." />
        </div>
      </div>
      <div className="border-t border-gray-100 pt-3">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Audience</p>
        <div className="grid grid-cols-2 gap-3">
          <Input label="Niche" value={form.niche} onChange={v => set('niche',v)} />
          <Input label="Audience Size" value={form.audience_size} onChange={v => set('audience_size',v)} type="number" />
          <Input label="Avg Views" value={form.average_views} onChange={v => set('average_views',v)} type="number" />
          <Textarea label="Engagement Notes" value={form.engagement_notes} onChange={v => set('engagement_notes',v)} rows={2} />
        </div>
      </div>
      <Textarea label="Internal Notes" value={form.notes} onChange={v => set('notes',v)} rows={2} />
      <div className="flex justify-end gap-2 pt-2">
        <Btn variant="secondary" onClick={onClose}>Cancel</Btn>
        <Btn type="submit" variant="primary">Save Creator</Btn>
      </div>
    </form>
  );
}

function Creators({ data, setData, navigate, myView }) {
  const [search, setSearch] = React.useState('');
  const [filterStatus, setFilterStatus] = React.useState('');
  const [filterProduct, setFilterProduct] = React.useState('');
  const [filterPlatform, setFilterPlatform] = React.useState('');
  const [filterSource, setFilterSource] = React.useState('');
  const [modal, setModal] = React.useState(null); // null | 'add' | creatorObj
  const productLabels = getProductLabels(data);

  const filtered = data.creators.filter(c => {
    const q = search.toLowerCase();
    const matchSearch = !q || c.name.toLowerCase().includes(q) || (c.handle||'').toLowerCase().includes(q) || (c.niche||'').toLowerCase().includes(q);
    const matchStatus = !filterStatus || c.current_status === filterStatus;
    const matchProduct = !filterProduct || c.product_fit === filterProduct;
    const matchPlatform = !filterPlatform || c.primary_platform === filterPlatform;
    const matchSource = !filterSource || c.source === filterSource;
    const matchOwner = !myView || c.owner_id === data.current_user_id;
    return matchSearch && matchStatus && matchProduct && matchPlatform && matchSource && matchOwner;
  });

  function ownerName(id) {
    return data.team_members.find(m => m.id === id)?.name || '—';
  }

  function saveCreator(form) {
    const now = Utils.now();
    if (modal === 'add') {
      const newCreator = { ...form, id: Utils.uid(), created_at: now, updated_at: now };
      const log = { id: Utils.uid(), user_id: data.current_user_id, action: 'Creator added', related_creator_id: newCreator.id, related_deal_id: null, related_campaign_id: null, related_payment_id: null, related_video_id: null, old_value: null, new_value: form.name, timestamp: now };
      setData(d => ({ ...d, creators: [...d.creators, newCreator], activity_log: [log, ...d.activity_log] }));
    } else {
      const log = { id: Utils.uid(), user_id: data.current_user_id, action: 'Creator updated', related_creator_id: form.id, related_deal_id: null, related_campaign_id: null, related_payment_id: null, related_video_id: null, old_value: null, new_value: form.name, timestamp: now };
      setData(d => ({ ...d, creators: d.creators.map(c => c.id === form.id ? { ...form, updated_at: now } : c), activity_log: [log, ...d.activity_log] }));
    }
    setModal(null);
  }

  function deleteCreator(id) {
    if (!confirm('Delete this creator?')) return;
    setData(d => ({ ...d, creators: d.creators.filter(c => c.id !== id) }));
  }

  const columns = [
    { key: 'name', label: 'Creator', render: (v, row) => (
      <div className="flex items-center gap-2">
        <div className="w-7 h-7 rounded-full bg-gradient-to-br from-lime-400 to-green-600 flex items-center justify-center text-white text-xs font-bold shrink-0">
          {v?.[0]?.toUpperCase()}
        </div>
        <div>
          <p className="font-medium text-gray-900 text-xs">{v}</p>
          <p className="text-gray-400 text-xs">{row.handle}</p>
        </div>
      </div>
    )},
    { key: 'primary_platform', label: 'Platform', render: v => <Badge className="bg-gray-100 text-gray-600">{v}</Badge> },
    { key: 'product_fit', label: 'Product', render: v => <Badge className={Utils.productColor(v)}>{v}</Badge> },
    { key: 'current_status', label: 'Status', render: v => <Badge className={Utils.statusColor(v)}>{v}</Badge> },
    { key: 'audience_size', label: 'Audience', render: v => Utils.fmtNum(v) },
    { key: 'niche', label: 'Niche' },
    { key: 'owner_id', label: 'Owner', render: v => ownerName(v) },
    { key: 'updated_at', label: 'Updated', render: v => Utils.fmt(v) },
    { key: 'id', label: '', render: (v, row) => (
      <div className="flex items-center gap-1" onClick={e => e.stopPropagation()}>
        <Btn size="sm" variant="ghost" onClick={() => setModal(row)}>Edit</Btn>
        <Btn size="sm" variant="ghost" onClick={() => deleteCreator(row.id)}>
          <svg className="w-3.5 h-3.5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
        </Btn>
      </div>
    )},
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Creator Database</h1>
          <p className="text-sm text-gray-500 mt-0.5">{data.creators.length} creators total</p>
        </div>
        <Btn onClick={() => setModal('add')}>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
          Add Creator
        </Btn>
      </div>

      <Card className="p-4">
        <div className="flex flex-wrap items-center gap-2">
          <SearchInput value={search} onChange={setSearch} placeholder="Search creators..." />
          <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} className="border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white focus:border-lime-400 transition-all">
            <option value="">All statuses</option>
            {CREATOR_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
          <select value={filterProduct} onChange={e => setFilterProduct(e.target.value)} className="border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white focus:border-lime-400 transition-all">
            <option value="">All products</option>
            {productLabels.map(p => <option key={p} value={p}>{p}</option>)}
          </select>
          <select value={filterPlatform} onChange={e => setFilterPlatform(e.target.value)} className="border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white focus:border-lime-400 transition-all">
            <option value="">All platforms</option>
            {PLATFORMS.map(p => <option key={p} value={p}>{p}</option>)}
          </select>
          <button
            onClick={() => setFilterSource(s => s === 'Viggler' ? '' : 'Viggler')}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium border transition-all ${filterSource === 'Viggler' ? 'bg-lime-400 text-gray-900 border-lime-500' : 'bg-white text-gray-500 border-gray-200 hover:border-gray-300'}`}
          >
            ⚡ Vigglers
          </button>
          {(search || filterStatus || filterProduct || filterPlatform || filterSource) && (
            <Btn size="sm" variant="ghost" onClick={() => { setSearch(''); setFilterStatus(''); setFilterProduct(''); setFilterPlatform(''); setFilterSource(''); }}>Clear</Btn>
          )}
          <span className="ml-auto text-xs text-gray-400">{filtered.length} result{filtered.length !== 1 ? 's' : ''}</span>
        </div>
      </Card>

      <Card>
        <Table
          columns={columns}
          rows={filtered}
          onRowClick={row => navigate('creator-profile', row.id)}
          emptyMessage="No creators match your filters"
        />
      </Card>

      <Modal open={!!modal} onClose={() => setModal(null)} title={modal === 'add' ? 'Add Creator' : 'Edit Creator'} size="lg">
        {modal && (
          <CreatorForm
            creator={modal === 'add' ? null : modal}
            data={data}
            setData={setData}
            onSave={saveCreator}
            onClose={() => setModal(null)}
          />
        )}
      </Modal>
    </div>
  );
}
