const PIPELINE_STATUSES = ['Not contacted','Contacted','Responded','Interested','Negotiating','Approved internally','Contract sent','Contract signed','Content in progress','Content submitted','In review','Approved','Scheduled','Posted','Paid','Archived'];

function Pipeline({ data, setData, navigate, myView }) {
  const [view, setView] = React.useState('kanban');
  const [search, setSearch] = React.useState('');
  const [filterProduct, setFilterProduct] = React.useState('');
  const [filterOwner, setFilterOwner] = React.useState('');
  const [dragging, setDragging] = React.useState(null);
  const [dragOver, setDragOver] = React.useState(null);
  const [selected, setSelected] = React.useState(new Set());
  const [bulkTarget, setBulkTarget] = React.useState('');

  const ownerName = id => data.team_members.find(m => m.id === id)?.name || '—';
  const productLabels = (data.product_labels && data.product_labels.length > 0) ? data.product_labels : ['Viggle','PINOC','Both'];

  const filtered = data.creators.filter(c => {
    const q = search.toLowerCase();
    const matchSearch = !q || c.name.toLowerCase().includes(q) || (c.handle||'').toLowerCase().includes(q);
    const matchProduct = !filterProduct || c.product_fit === filterProduct;
    const matchOwner = !filterOwner || c.owner_id === filterOwner;
    const matchMyView = !myView || c.owner_id === data.current_user_id;
    return matchSearch && matchProduct && matchOwner && matchMyView;
  });

  function moveCreator(creatorId, newStatus) {
    const now = Utils.now();
    const creator = data.creators.find(c => c.id === creatorId);
    if (!creator || creator.current_status === newStatus) return;
    const log = { id: Utils.uid(), user_id: data.current_user_id, action: `Status changed to ${newStatus}`, related_creator_id: creatorId, related_deal_id: null, related_campaign_id: null, related_payment_id: null, related_video_id: null, old_value: creator.current_status, new_value: newStatus, timestamp: now };
    setData(d => ({
      ...d,
      creators: d.creators.map(c => c.id === creatorId ? { ...c, current_status: newStatus, updated_at: now } : c),
      activity_log: [log, ...d.activity_log],
    }));
  }

  function moveMany(ids, newStatus) {
    const now = Utils.now();
    const logs = ids.map(id => {
      const c = data.creators.find(x => x.id === id);
      return { id: Utils.uid(), user_id: data.current_user_id, action: `Status changed to ${newStatus}`, related_creator_id: id, related_deal_id: null, related_campaign_id: null, related_payment_id: null, related_video_id: null, old_value: c?.current_status, new_value: newStatus, timestamp: now };
    });
    setData(d => ({
      ...d,
      creators: d.creators.map(c => ids.includes(c.id) ? { ...c, current_status: newStatus, updated_at: now } : c),
      activity_log: [...logs, ...d.activity_log],
    }));
    setSelected(new Set());
    setBulkTarget('');
  }

  function toggleSelect(e, id) {
    e.stopPropagation();
    setSelected(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  function onDrop(e, col) {
    e.preventDefault();
    if (!dragging) { setDragOver(null); return; }
    // If the dragged card is part of a selection, move all selected; otherwise just move it
    const toMove = selected.size > 1 && selected.has(dragging) ? [...selected] : [dragging];
    moveMany(toMove, col.statuses[0]);
    setDragging(null); setDragOver(null);
  }

  // Kanban columns — group statuses into visible columns
  const kanbanCols = [
    { key: 'Not contacted', statuses: ['Not contacted'] },
    { key: 'Contacted', statuses: ['Contacted','Responded'] },
    { key: 'Interested', statuses: ['Interested','Negotiating','Approved internally'] },
    { key: 'Contract', statuses: ['Contract sent','Contract signed'] },
    { key: 'In progress', statuses: ['Content in progress','Content submitted','In review'] },
    { key: 'Done', statuses: ['Approved','Scheduled','Posted','Paid','Archived'] },
  ];

  const colColors = {
    'Not contacted': 'bg-gray-100',
    'Contacted': 'bg-blue-50',
    'Interested': 'bg-yellow-50',
    'Contract': 'bg-purple-50',
    'In progress': 'bg-orange-50',
    'Done': 'bg-green-50',
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Outreach Pipeline</h1>
          <p className="text-sm text-gray-500 mt-0.5">{filtered.length} creators</p>
        </div>
        <Tabs
          tabs={[{key:'kanban',label:'Kanban'},{key:'table',label:'Table'}]}
          active={view}
          onChange={setView}
        />
      </div>

      <Card className="p-3">
        <div className="flex flex-wrap gap-2">
          <SearchInput value={search} onChange={setSearch} placeholder="Search creators..." />
          <select value={filterProduct} onChange={e => setFilterProduct(e.target.value)} className="border border-gray-200 rounded-lg px-3 py-2 text-sm">
            <option value="">All products</option>
            {productLabels.map(p => <option key={p} value={p}>{p}</option>)}
          </select>
          <select value={filterOwner} onChange={e => setFilterOwner(e.target.value)} className="border border-gray-200 rounded-lg px-3 py-2 text-sm">
            <option value="">All owners</option>
            {data.team_members.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
          </select>
        </div>
      </Card>

      {view === 'kanban' && (
        <div className="relative">
          {selected.size > 0 && (
            <div className="sticky top-2 z-20 mb-3 flex items-center gap-3 bg-gray-900 text-white px-4 py-2.5 rounded-xl shadow-lg border border-gray-700">
              <span className="text-sm font-semibold">{selected.size} selected</span>
              <select value={bulkTarget} onChange={e => setBulkTarget(e.target.value)}
                className="flex-1 text-xs bg-gray-800 border border-gray-600 rounded-lg px-2 py-1.5 text-gray-200 focus:border-lime-400 focus:outline-none">
                <option value="">Move to column…</option>
                {kanbanCols.map(col => <option key={col.key} value={col.statuses[0]}>{col.key}</option>)}
              </select>
              <button
                onClick={() => { if (bulkTarget) moveMany([...selected], bulkTarget); }}
                disabled={!bulkTarget}
                className="px-3 py-1.5 rounded-lg bg-lime-400 text-gray-900 text-xs font-bold disabled:opacity-40 hover:bg-lime-300 transition-colors"
              >Move</button>
              <button onClick={() => { setSelected(new Set()); setBulkTarget(''); }}
                className="text-gray-400 hover:text-white text-lg leading-none px-1">×</button>
            </div>
          )}
          <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-hide">
            {kanbanCols.map(col => {
              const cards = filtered.filter(c => col.statuses.includes(c.current_status));
              const isOver = dragOver === col.key;
              return (
                <div
                  key={col.key}
                  className={`shrink-0 w-60 rounded-xl border kanban-col transition-all ${colColors[col.key]} ${isOver?'border-lime-400 ring-2 ring-lime-200 scale-[1.01]':'border-gray-100'}`}
                  onDragOver={e=>{e.preventDefault();setDragOver(col.key);}}
                  onDragLeave={e=>{if(!e.currentTarget.contains(e.relatedTarget))setDragOver(null);}}
                  onDrop={e=>onDrop(e,col)}
                >
                  <div className="p-3 border-b border-gray-200/60">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-gray-600">{col.key}</span>
                      <span className="text-xs bg-white/80 text-gray-500 px-1.5 py-0.5 rounded-full">{cards.length}</span>
                    </div>
                    <p className="text-xs text-gray-400 mt-0.5">{col.statuses.join(' · ')}</p>
                  </div>
                  <div className="p-2 space-y-2 min-h-12">
                    {cards.map(c => {
                      const isSel = selected.has(c.id);
                      const isDragging = dragging === c.id;
                      return (
                        <div
                          key={c.id}
                          draggable
                          onDragStart={e=>{e.dataTransfer.effectAllowed='move';setDragging(c.id);}}
                          onDragEnd={()=>{setDragging(null);setDragOver(null);}}
                          onClick={e=>{
                            if (dragging) return;
                            if (selected.size > 0 || e.shiftKey || e.metaKey || e.ctrlKey) {
                              toggleSelect(e, c.id);
                            } else {
                              navigate('creator-profile', c.id);
                            }
                          }}
                          className={`rounded-lg p-3 shadow-sm border transition-all select-none cursor-grab active:cursor-grabbing
                            ${isDragging ? 'opacity-40 shadow-none' : ''}
                            ${isSel ? 'bg-lime-50 border-lime-400 ring-1 ring-lime-300' : 'bg-white border-gray-100 hover:border-lime-300 hover:shadow-md'}`}
                        >
                          <div className="flex items-center gap-2 mb-1.5">
                            <div
                              onClick={e=>toggleSelect(e,c.id)}
                              className={`w-6 h-6 rounded-full shrink-0 flex items-center justify-center text-xs font-bold transition-all cursor-pointer
                                ${isSel ? 'bg-lime-400 text-gray-900' : 'bg-gradient-to-br from-lime-400 to-green-600 text-white'}`}
                            >
                              {isSel ? '✓' : c.name[0]}
                            </div>
                            <div className="min-w-0">
                              <p className="text-xs font-semibold text-gray-800 truncate">{c.name}</p>
                              <p className="text-xs text-gray-400 truncate">{c.handle}</p>
                            </div>
                          </div>
                          <div className="flex flex-wrap gap-1 mt-1">
                            <Badge className={Utils.productColor(c.product_fit)}>{c.product_fit}</Badge>
                            <Badge className="bg-gray-100 text-gray-500">{c.primary_platform}</Badge>
                          </div>
                          <div className="flex items-center justify-between mt-2">
                            <Badge className={Utils.statusColor(c.current_status)}>{c.current_status}</Badge>
                            <span className="text-xs text-gray-400">{ownerName(c.owner_id).split(' ')[0]}</span>
                          </div>
                        </div>
                      );
                    })}
                    {isOver && (
                      <div className="border-2 border-dashed border-lime-400 rounded-lg h-10 flex items-center justify-center">
                        <span className="text-xs text-lime-500 font-medium">
                          {selected.size > 1 && dragging && selected.has(dragging) ? `Move ${selected.size} → ${col.key}` : `Drop → ${col.key}`}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {view === 'table' && (
        <Card>
          <Table
            columns={[
              { key:'name', label:'Creator', render:(v,r) => (
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center text-white text-xs font-bold">{v[0]}</div>
                  <div><p className="font-medium text-xs">{v}</p><p className="text-gray-400 text-xs">{r.handle}</p></div>
                </div>
              )},
              { key:'product_fit', label:'Product', render: v => <Badge className={Utils.productColor(v)}>{v}</Badge> },
              { key:'primary_platform', label:'Platform' },
              { key:'current_status', label:'Status', render:(v,r) => (
                <select value={v} onChange={e => { e.stopPropagation(); moveCreator(r.id, e.target.value); }}
                  onClick={e => e.stopPropagation()}
                  className={`text-xs font-medium px-2 py-1 rounded-full border-0 cursor-pointer ${Utils.statusColor(v)}`}>
                  {PIPELINE_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              )},
              { key:'niche', label:'Niche' },
              { key:'owner_id', label:'Owner', render: v => ownerName(v) },
              { key:'updated_at', label:'Updated', render: v => Utils.fmt(v) },
            ]}
            rows={filtered}
            onRowClick={row => navigate('creator-profile', row.id)}
          />
        </Card>
      )}
    </div>
  );
}
