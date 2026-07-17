function CreatorProfile({ data, setData, creatorId, navigate }) {
  const [tab, setTab] = React.useState('overview');
  const [editing, setEditing] = React.useState(false);
  const creator = data.creators.find(c => c.id === creatorId);
  if (!creator) return <div className="p-8 text-gray-400">Creator not found. <button onClick={() => navigate('creators')} className="text-blue-500 underline">Back to creators</button></div>;

  function saveEdit(form) {
    const now = Utils.now();
    const log = { id: Utils.uid(), user_id: data.current_user_id, action: 'Creator updated', related_creator_id: form.id, related_deal_id: null, related_campaign_id: null, related_payment_id: null, related_video_id: null, old_value: null, new_value: form.name, timestamp: now };
    setData(d => ({ ...d, creators: d.creators.map(c => c.id === form.id ? { ...form, updated_at: now } : c), activity_log: [log, ...d.activity_log] }));
    setEditing(false);
  }

  const deals = data.deals.filter(d => d.creator_id === creatorId);
  const outreach = data.outreach.filter(o => o.creator_id === creatorId);
  const contracts = data.contracts.filter(c => c.creator_id === creatorId);
  const videos = data.videos.filter(v => v.creator_id === creatorId);
  const payments = data.payments.filter(p => p.creator_id === creatorId);
  const content = data.content_assets.filter(a => a.creator_id === creatorId);
  const logs = data.activity_log.filter(l => l.related_creator_id === creatorId).sort((a,b) => new Date(b.timestamp)-new Date(a.timestamp));

  const ownerName = id => data.team_members.find(m => m.id === id)?.name || '—';
  const campaignName = id => data.campaigns.find(c => c.id === id)?.campaign_name || '—';

  const tabs = [
    { key: 'overview', label: 'Overview' },
    { key: 'outreach', label: `Outreach (${outreach.length})` },
    { key: 'deals', label: `Deals (${deals.length})` },
    { key: 'videos', label: `Videos (${videos.length})` },
    { key: 'contracts', label: `Contracts (${contracts.length})` },
    { key: 'payments', label: `Payments (${payments.length})` },
    { key: 'content', label: `Content (${content.length})` },
    { key: 'activity', label: 'Activity' },
  ];

  const platformLinks = [
    { label: 'TikTok', url: creator.tiktok_url },
    { label: 'Instagram', url: creator.instagram_url },
    { label: 'YouTube', url: creator.youtube_url },
    { label: 'X / Twitter', url: creator.twitter_url },
  ].filter(p => p.url);

  return (
    <div className="space-y-4 fade-in">
      {/* Header */}
      <div className="flex items-center gap-3 mb-2">
        <button onClick={() => navigate('creators')} className="text-sm text-gray-400 hover:text-gray-600 flex items-center gap-1">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
          Creators
        </button>
        <span className="text-gray-200">/</span>
        <span className="text-sm text-gray-700 font-medium">{creator.name}</span>
      </div>

      <Card className="p-5">
        <div className="flex items-start gap-4">
          <div className="w-14 h-14 rounded-full bg-gradient-to-br from-lime-400 to-green-600 flex items-center justify-center text-white text-xl font-bold shrink-0">
            {creator.name?.[0]?.toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2 flex-wrap">
              <div>
                <h1 className="text-lg font-bold text-gray-900">{creator.name}</h1>
                <p className="text-sm text-gray-500">{creator.handle} · {creator.primary_platform}</p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <Badge className={Utils.statusColor(creator.current_status)}>{creator.current_status}</Badge>
                <Badge className={Utils.productColor(creator.product_fit)}>{creator.product_fit}</Badge>
                <Btn size="sm" variant="secondary" onClick={() => setEditing(true)}>Edit</Btn>
              </div>
            </div>
            <div className="flex flex-wrap gap-4 mt-3 text-sm text-gray-500">
              {creator.country && <span>📍 {creator.country}</span>}
              {creator.timezone && <span>🕐 {creator.timezone}</span>}
              {creator.niche && <span>🎯 {creator.niche}</span>}
              {creator.audience_size && <span>👥 {Utils.fmtNum(creator.audience_size)}</span>}
              {creator.average_views && <span>▶️ {Utils.fmtNum(creator.average_views)} avg views</span>}
            </div>
            <div className="flex flex-wrap gap-2 mt-3">
              {platformLinks.map(p => (
                <a key={p.label} href={p.url} target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs text-blue-600 hover:underline bg-blue-50 px-2 py-1 rounded-md">
                  {p.label} ↗
                </a>
              ))}
              {creator.email && <a href={`mailto:${creator.email}`} className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-md">{creator.email}</a>}
              {creator.whatsapp && <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-md">WA: {creator.whatsapp}</span>}
            </div>
          </div>
        </div>
      </Card>

      {/* Tabs */}
      <div className="flex gap-1 overflow-x-auto scrollbar-hide">
        {tabs.map(t => (
          <button key={t.key} onClick={() => setTab(t.key)}
            className={`px-3 py-2 text-xs font-medium rounded-lg whitespace-nowrap transition-all ${tab === t.key ? 'bg-blue-600 text-white' : 'bg-white text-gray-500 border border-gray-200 hover:bg-gray-50'}`}>
            {t.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      {tab === 'overview' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2 space-y-4">
            <Card className="p-4">
              <h3 className="text-sm font-semibold text-gray-700 mb-3">Partnership Summary</h3>
              <dl className="grid grid-cols-2 gap-x-6 gap-y-3 text-sm">
                <div><dt className="text-xs text-gray-400">Owner</dt><dd className="font-medium">{ownerName(creator.owner_id)}</dd></div>
                <div><dt className="text-xs text-gray-400">Creator Type</dt><dd className="font-medium">{creator.creator_type || '—'}</dd></div>
                <div><dt className="text-xs text-gray-400">Source</dt><dd className="font-medium">{creator.source || '—'}</dd></div>
                <div><dt className="text-xs text-gray-400">Active Deals</dt><dd className="font-medium">{deals.filter(d => !['Cancelled','Archived'].includes(d.deal_status)).length}</dd></div>
                <div><dt className="text-xs text-gray-400">Contract Status</dt><dd className="font-medium">{contracts[0]?.contract_status || 'None'}</dd></div>
                <div><dt className="text-xs text-gray-400">Payment Status</dt><dd className="font-medium">{payments[0]?.payment_status || 'None'}</dd></div>
              </dl>
            </Card>
            {creator.notes && (
              <Card className="p-4">
                <h3 className="text-sm font-semibold text-gray-700 mb-2">Notes</h3>
                <p className="text-sm text-gray-600">{creator.notes}</p>
              </Card>
            )}
            {creator.engagement_notes && (
              <Card className="p-4">
                <h3 className="text-sm font-semibold text-gray-700 mb-2">Engagement Notes</h3>
                <p className="text-sm text-gray-600">{creator.engagement_notes}</p>
              </Card>
            )}
          </div>
          <div className="space-y-4">
            <Card className="p-4">
              <h3 className="text-sm font-semibold text-gray-700 mb-3">Quick Stats</h3>
              <div className="space-y-2">
                <div className="flex justify-between text-sm"><span className="text-gray-500">Videos</span><span className="font-medium">{videos.length}</span></div>
                <div className="flex justify-between text-sm"><span className="text-gray-500">Posted</span><span className="font-medium text-green-600">{videos.filter(v=>v.video_status==='Posted').length}</span></div>
                <div className="flex justify-between text-sm"><span className="text-gray-500">Total paid</span><span className="font-medium">${payments.filter(p=>p.payment_status==='Paid').reduce((s,p)=>s+p.amount,0)}</span></div>
                <div className="flex justify-between text-sm"><span className="text-gray-500">Pending payment</span><span className="font-medium text-amber-600">${payments.filter(p=>p.payment_status!=='Paid').reduce((s,p)=>s+p.amount,0)}</span></div>
              </div>
            </Card>
            <Card className="p-4">
              <h3 className="text-sm font-semibold text-gray-700 mb-2">Timeline</h3>
              <div className="space-y-1 text-xs text-gray-500">
                <div className="flex justify-between"><span>Added</span><span>{Utils.fmt(creator.created_at)}</span></div>
                <div className="flex justify-between"><span>Last updated</span><span>{Utils.fmt(creator.updated_at)}</span></div>
              </div>
            </Card>
          </div>
        </div>
      )}

      {tab === 'outreach' && (
        <Card className="p-4">
          <h3 className="text-sm font-semibold text-gray-700 mb-3">Outreach History</h3>
          {outreach.length === 0 ? <p className="text-sm text-gray-400">No outreach records yet</p> : (
            <div className="space-y-4">
              {outreach.map(o => (
                <div key={o.id} className="border border-gray-100 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">{o.outreach_channel}</span>
                    <Badge className={Utils.statusColor(o.outreach_status)}>{o.outreach_status}</Badge>
                  </div>
                  <div className="grid grid-cols-3 gap-3 text-xs text-gray-500 mb-2">
                    <div><span className="text-gray-400">Contacted</span><br/>{Utils.fmt(o.date_contacted)}</div>
                    <div><span className="text-gray-400">Last response</span><br/>{Utils.fmt(o.last_response_date)}</div>
                    <div><span className="text-gray-400">Follow-up</span><br/>{Utils.fmt(o.next_follow_up_date)}</div>
                  </div>
                  {o.message_summary && <p className="text-sm text-gray-600 bg-gray-50 rounded-lg p-2">{o.message_summary}</p>}
                  {o.notes && <p className="text-xs text-gray-400 mt-1">{o.notes}</p>}
                </div>
              ))}
            </div>
          )}
        </Card>
      )}

      {tab === 'deals' && (
        <Card>
          <Table
            columns={[
              { key:'deal_name', label:'Deal' },
              { key:'product', label:'Product', render: v => <Badge className={Utils.productColor(v)}>{v}</Badge> },
              { key:'deal_status', label:'Status', render: v => <Badge className={Utils.statusColor(v)}>{v}</Badge> },
              { key:'rate', label:'Rate', render: (v, r) => `$${v} ${r.currency}` },
              { key:'campaign_id', label:'Campaign', render: v => campaignName(v) },
              { key:'due_date', label:'Due', render: v => Utils.fmt(v) },
            ]}
            rows={deals}
          />
        </Card>
      )}

      {tab === 'videos' && (
        <div className="space-y-4">
          {/* Posted videos — thumbnail grid */}
          {videos.filter(v=>v.video_status==='Posted'||v.actual_post_date).length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-gray-700 mb-3">Posted ({videos.filter(v=>v.video_status==='Posted'||v.actual_post_date).length})</h3>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                {videos.filter(v=>v.video_status==='Posted'||v.actual_post_date).map(v=>(
                  <div key={v.id} className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-all">
                    <div className="relative aspect-video bg-gray-100">
                      <div className="absolute inset-0"><Thumb url={v.post_url} platform={v.platform} size="lg"/></div>
                      <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"/>
                      {v.post_url && (
                        <a href={v.post_url} target="_blank" rel="noopener noreferrer"
                          className="absolute top-1.5 right-1.5 bg-black/60 text-white text-xs px-1.5 py-0.5 rounded hover:bg-black/80">↗</a>
                      )}
                    </div>
                    <div className="p-2.5">
                      <p className="text-xs font-semibold text-gray-900 truncate">{v.video_title}</p>
                      <p className="text-xs text-gray-400 mt-0.5">{v.platform} · {Utils.fmt(v.actual_post_date)}</p>
                      {v.views && (
                        <div className="flex gap-2 mt-1 text-xs text-gray-500">
                          <span>👁 {Utils.fmtNum(v.views)}</span>
                          {v.likes && <span>❤ {Utils.fmtNum(v.likes)}</span>}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          {/* Upcoming / in-progress */}
          {videos.filter(v=>v.video_status!=='Posted'||!v.actual_post_date).length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-gray-700 mb-3">In Progress ({videos.filter(v=>!(v.video_status==='Posted'||v.actual_post_date)).length})</h3>
              <Card>
                <Table
                  columns={[
                    { key:'video_title', label:'Video' },
                    { key:'video_status', label:'Status', render: v => <Badge className={Utils.statusColor(v)}>{v}</Badge> },
                    { key:'draft_due_date', label:'Draft Due', render: v => <span className={Utils.isOverdue(v)?'text-red-500 font-medium':''}>{Utils.fmt(v)}</span> },
                    { key:'scheduled_post_date', label:'Sched. Post', render: v => v ? (
                      <span className="flex items-center gap-1"><span className="text-xs">📅</span>{Utils.fmt(v)}</span>
                    ) : '—' },
                    { key:'approval_status', label:'Approval', render: v => <Badge className={Utils.statusColor(v)}>{v}</Badge> },
                  ]}
                  rows={videos.filter(v=>!(v.video_status==='Posted'||v.actual_post_date))}
                />
              </Card>
            </div>
          )}
          {videos.length === 0 && <Card className="p-8 text-center text-gray-400 text-sm">No videos yet for this creator</Card>}
        </div>
      )}

      {tab === 'contracts' && (
        <Card>
          <Table
            columns={[
              { key:'contract_name', label:'Contract' },
              { key:'contract_type', label:'Type' },
              { key:'contract_status', label:'Status', render: v => <Badge className={Utils.statusColor(v)}>{v}</Badge> },
              { key:'date_sent', label:'Sent', render: v => Utils.fmt(v) },
              { key:'date_signed', label:'Signed', render: v => v ? <span className="text-green-600">{Utils.fmt(v)}</span> : '—' },
              { key:'usage_rights_included', label:'Usage Rights', render: v => v ? '✓' : '—' },
              { key:'repost_rights_included', label:'Repost Rights', render: v => v ? '✓' : '—' },
            ]}
            rows={contracts}
          />
        </Card>
      )}

      {tab === 'payments' && (
        <Card>
          <Table
            columns={[
              { key:'amount', label:'Amount', render: (v, r) => `$${v} ${r.currency}` },
              { key:'payment_status', label:'Status', render: v => <Badge className={Utils.statusColor(v)}>{v}</Badge> },
              { key:'payment_method', label:'Method' },
              { key:'invoice_required', label:'Invoice', render: (v, r) => v ? (r.invoice_received ? '✓ Received' : '⚠ Needed') : 'Not required' },
              { key:'payment_date', label:'Paid Date', render: v => Utils.fmt(v) },
              { key:'notes', label:'Notes' },
            ]}
            rows={payments}
          />
        </Card>
      )}

      {tab === 'content' && (
        <Card>
          <Table
            columns={[
              { key:'content_title', label:'Content' },
              { key:'platform', label:'Platform' },
              { key:'content_status', label:'Status', render: v => <Badge className={Utils.statusColor(v)}>{v}</Badge> },
              { key:'views', label:'Views', render: v => Utils.fmtNum(v) },
              { key:'repost_permission', label:'Repost OK', render: v => v ? '✓' : '—' },
              { key:'reposted_by_viggle', label:'Viggle Repost', render: v => v ? '✓' : '—' },
              { key:'reposted_by_pinoc', label:'PINOC Repost', render: v => v ? '✓' : '—' },
              { key:'original_post_url', label:'Link', render: v => v ? <a href={v} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline text-xs">View ↗</a> : '—' },
            ]}
            rows={content}
          />
        </Card>
      )}

      {tab === 'activity' && (
        <Card className="p-4">
          <h3 className="text-sm font-semibold text-gray-700 mb-3">Activity Log</h3>
          {logs.length === 0 ? <p className="text-sm text-gray-400">No activity yet</p> : (
            <div className="space-y-3">
              {logs.map((log, i) => (
                <div key={log.id || i} className="flex items-start gap-3 text-sm">
                  <div className="w-1.5 h-1.5 bg-lime-400 rounded-full mt-1.5 shrink-0" />
                  <div className="flex-1">
                    <span className="text-gray-700">{log.action}</span>
                    {log.new_value && <span className="text-gray-500 ml-1">→ {log.new_value}</span>}
                    <p className="text-xs text-gray-400 mt-0.5">{Utils.fmt(log.timestamp?.slice(0,10))}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      )}

      <Modal open={editing} onClose={() => setEditing(false)} title="Edit Creator" size="lg">
        {editing && (
          <CreatorForm
            creator={creator}
            data={data}
            setData={setData}
            onSave={saveEdit}
            onClose={() => setEditing(false)}
          />
        )}
      </Modal>
    </div>
  );
}
