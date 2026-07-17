const CONTENT_STATUSES_A = ['Awaiting submission','Submitted','Needs review','Approved','Repostable','Reposted','Archived'];

function ContentForm({ asset, data, onSave, onClose }) {
  const [form, setForm] = React.useState(asset || {
    creator_id:'', deal_id:'', campaign_id:'', content_title:'', product:'Viggle',
    platform:'TikTok', original_post_url:'', caption:'',
    repost_permission:false, usage_rights:'Full usage rights', content_status:'Submitted',
    views:'', likes:'', comments:'', shares:'', reposted_by_viggle:false,
    reposted_by_pinoc:false, notes:'',
  });
  const set = (k,v) => setForm(f=>({...f,[k]:v}));

  return (
    <form onSubmit={e=>{e.preventDefault();onSave(form);}} className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div className="col-span-2 flex items-start gap-3">
          <Thumb url={form.original_post_url} platform={form.platform} size="md" />
          <Input label="Content Title" value={form.content_title} onChange={v=>set('content_title',v)} required className="flex-1" />
        </div>
        <Select label="Creator" value={form.creator_id} onChange={v=>set('creator_id',v)} options={data.creators.map(c=>({value:c.id,label:c.name}))} required />
        <Select label="Campaign" value={form.campaign_id} onChange={v=>set('campaign_id',v)} options={(data.campaigns||[]).map(c=>({value:c.id,label:c.campaign_name}))} />
        <Select label="Product" value={form.product} onChange={v=>set('product',v)} options={['Viggle','PINOC','Both']} />
        <Select label="Platform" value={form.platform} onChange={v=>set('platform',v)} options={['TikTok','Instagram','YouTube','X / Twitter']} />
        <Select label="Status" value={form.content_status} onChange={v=>set('content_status',v)} options={CONTENT_STATUSES_A} />
        <Input label="Post URL (paste link — thumbnail auto-loads)" value={form.original_post_url} onChange={v=>set('original_post_url',v)} placeholder="https://..." className="col-span-2" />
        <Input label="Views" value={form.views} onChange={v=>set('views',v)} type="number" />
        <Input label="Likes" value={form.likes} onChange={v=>set('likes',v)} type="number" />
        <Input label="Comments" value={form.comments} onChange={v=>set('comments',v)} type="number" />
        <Input label="Shares" value={form.shares} onChange={v=>set('shares',v)} type="number" />
        <Input label="Usage Rights" value={form.usage_rights} onChange={v=>set('usage_rights',v)} className="col-span-2" />
      </div>
      <Textarea label="Caption" value={form.caption} onChange={v=>set('caption',v)} rows={2} />
      <div className="grid grid-cols-3 gap-3">
        <Toggle value={form.repost_permission} onChange={v=>set('repost_permission',v)} label="Repost permission" />
        <Toggle value={form.reposted_by_viggle} onChange={v=>set('reposted_by_viggle',v)} label="Reposted by Viggle" />
        <Toggle value={form.reposted_by_pinoc} onChange={v=>set('reposted_by_pinoc',v)} label="Reposted by PINOC" />
      </div>
      <Textarea label="Notes" value={form.notes} onChange={v=>set('notes',v)} />
      <div className="flex justify-end gap-2 pt-2">
        <Btn variant="secondary" onClick={onClose}>Cancel</Btn>
        <Btn type="submit">Save</Btn>
      </div>
    </form>
  );
}

function Analytics({ data, setData, navigate, initialTab }) {
  const [tab, setTab] = React.useState(initialTab || 'performance');

  // Performance state
  const [sortBy, setSortBy] = React.useState('views');
  const [filterPlatform, setFilterPlatform] = React.useState('');
  const [filterProject, setFilterProject] = React.useState('');
  const [filterCreator, setFilterCreator] = React.useState('');
  const [editingStats, setEditingStats] = React.useState(null);
  const [statsForm, setStatsForm] = React.useState({});
  const [perfView, setPerfView] = React.useState('table');

  // Content library state
  const [contentModal, setContentModal] = React.useState(null);
  const [contentSearch, setContentSearch] = React.useState('');
  const [filterContentStatus, setFilterContentStatus] = React.useState('');
  const [filterContentPlatform, setFilterContentPlatform] = React.useState('');
  const [contentView, setContentView] = React.useState('grid');

  const creatorName = id => data.creators.find(c=>c.id===id)?.name || '—';

  // Performance data
  const posted = data.videos.filter(v => v.video_status==='Posted' || v.actual_post_date);
  const filtered = posted.filter(v =>
    (!filterPlatform || v.platform===filterPlatform) &&
    (!filterProject  || v.project===filterProject) &&
    (!filterCreator  || v.creator_id===filterCreator)
  );
  const sorted = [...filtered].sort((a,b) => {
    const n = k => Number(b[k]||0)-Number(a[k]||0);
    if (sortBy==='views')    return n('views');
    if (sortBy==='likes')    return n('likes');
    if (sortBy==='comments') return n('comments');
    if (sortBy==='date')     return (b.actual_post_date||'')>(a.actual_post_date||'')?1:-1;
    return 0;
  });
  const totalViews    = posted.reduce((s,v)=>s+Number(v.views||0),0);
  const totalLikes    = posted.reduce((s,v)=>s+Number(v.likes||0),0);
  const totalComments = posted.reduce((s,v)=>s+Number(v.comments||0),0);
  const avgEng = totalViews>0 ? ((totalLikes+totalComments)/totalViews*100).toFixed(1) : '0.0';
  const topVideo = [...posted].sort((a,b)=>Number(b.views||0)-Number(a.views||0))[0];
  const topCreatorMap = {};
  posted.forEach(v=>{const id=v.creator_id;topCreatorMap[id]=(topCreatorMap[id]||0)+Number(v.views||0);});
  const topCreatorId = Object.entries(topCreatorMap).sort((a,b)=>b[1]-a[1])[0]?.[0];
  const chartData = [...posted].sort((a,b)=>Number(b.views||0)-Number(a.views||0)).slice(0,8);
  const maxViews = Math.max(...chartData.map(v=>Number(v.views||0)),1);
  const byCreator = Object.entries(topCreatorMap).sort((a,b)=>b[1]-a[1]).slice(0,6);
  const maxCreatorViews = Math.max(...byCreator.map(x=>x[1]),1);
  const byPlatform = {};
  posted.forEach(v=>{const p=v.platform||'Other';byPlatform[p]=(byPlatform[p]||0)+Number(v.views||0);});
  const platformBadge = {TikTok:'bg-gray-900',Instagram:'bg-pink-500',YouTube:'bg-red-500','X / Twitter':'bg-blue-400'};

  function fmtN(n){n=Number(n||0);if(n>=1000000)return(n/1000000).toFixed(1)+'M';if(n>=1000)return(n/1000).toFixed(1)+'K';return n?String(n):'—';}
  function engRate(v){const views=Number(v.views||0);if(!views)return'—';return((Number(v.likes||0)+Number(v.comments||0))/views*100).toFixed(1)+'%';}
  function startEdit(v){setEditingStats(v.id);setStatsForm({views:v.views||'',likes:v.likes||'',comments:v.comments||'',shares:v.shares||''});}
  function saveStats(videoId){const now=Utils.now();setData(d=>({...d,videos:d.videos.map(v=>v.id===videoId?{...v,...statsForm,updated_at:now}:v)}));setEditingStats(null);}
  const statCard = (label,value,sub,color) => (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
      <p className="text-xs text-gray-500 font-medium mb-1">{label}</p>
      <p className={`text-2xl font-bold ${color||'text-gray-900'}`}>{value}</p>
      {sub&&<p className="text-xs text-gray-400 mt-0.5">{sub}</p>}
    </div>
  );

  // Content library
  const contentFiltered = (data.content_assets||[]).filter(a=>{
    const q=contentSearch.toLowerCase();
    return (!q||a.content_title.toLowerCase().includes(q)||creatorName(a.creator_id).toLowerCase().includes(q)) &&
      (!filterContentStatus||a.content_status===filterContentStatus) &&
      (!filterContentPlatform||a.platform===filterContentPlatform);
  });
  function saveContent(form){
    const now=Utils.now();const isNew=!form.id;const id=form.id||Utils.uid();
    const log={id:Utils.uid(),user_id:data.current_user_id,action:isNew?'Content added':'Content updated',related_creator_id:form.creator_id,related_deal_id:null,related_campaign_id:form.campaign_id||null,related_payment_id:null,related_video_id:null,old_value:null,new_value:form.content_title,timestamp:now};
    if(isNew)setData(d=>({...d,content_assets:[...d.content_assets,{...form,id,created_at:now,updated_at:now}],activity_log:[log,...d.activity_log]}));
    else setData(d=>({...d,content_assets:d.content_assets.map(x=>x.id===form.id?{...form,updated_at:now}:x),activity_log:[log,...d.activity_log]}));
    setContentModal(null);
  }
  function markReposted(id,brand){
    const now=Utils.now();
    setData(d=>({...d,content_assets:d.content_assets.map(x=>{
      if(x.id!==id)return x;
      const u={updated_at:now};
      if(brand==='viggle')u.reposted_by_viggle=true;
      if(brand==='pinoc')u.reposted_by_pinoc=true;
      const both=(brand==='viggle'?true:x.reposted_by_viggle)&&(brand==='pinoc'?true:x.reposted_by_pinoc);
      if(both)u.content_status='Reposted';
      return{...x,...u};
    })}));
  }
  const repostable = (data.content_assets||[]).filter(a=>a.content_status==='Repostable');

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-xl font-bold text-gray-900">{tab==='performance'?'Content Performance':'Content Library'}</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            {tab==='performance'?`${posted.length} posted videos · click any row or card to update stats`:`${(data.content_assets||[]).length} assets · ${repostable.length} repostable`}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex rounded-lg border border-gray-200 overflow-hidden">
            {[{key:'performance',label:'Performance'},{key:'content',label:'Content Library'}].map(t=>(
              <button key={t.key} onClick={()=>setTab(t.key)}
                className={`px-4 py-2 text-sm font-medium transition-colors ${tab===t.key?'bg-gray-900 text-white':'bg-white text-gray-600 hover:bg-gray-50'}`}>
                {t.label}
              </button>
            ))}
          </div>
          {tab==='content'&&<Btn onClick={()=>setContentModal({})}>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4"/></svg>
            Add
          </Btn>}
        </div>
      </div>

      {tab==='performance' && (
        <div className="space-y-5">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {statCard('Total Views',fmtN(totalViews),`across ${posted.length} videos`,'text-blue-600')}
            {statCard('Total Likes',fmtN(totalLikes),posted.length?`avg ${fmtN(Math.round(totalLikes/posted.length))}/video`:null)}
            {statCard('Comments',fmtN(totalComments))}
            {statCard('Avg Engagement',avgEng+'%','likes + comments / views',Number(avgEng)>=5?'text-green-600':null)}
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
              <p className="text-xs text-gray-500 font-medium mb-2">Best Video</p>
              {topVideo?(
                <div className="flex items-center gap-3">
                  <Thumb url={topVideo.post_url} platform={topVideo.platform} size="sm" />
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-gray-900 truncate">{topVideo.video_title}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{creatorName(topVideo.creator_id)} · {fmtN(topVideo.views)} views</p>
                  </div>
                </div>
              ):<p className="text-sm text-gray-400">No data yet</p>}
            </div>
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
              <p className="text-xs text-gray-500 font-medium mb-2">Top Creator</p>
              {topCreatorId?(
                <>
                  <p className="text-sm font-bold text-gray-900">{creatorName(topCreatorId)}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{fmtN(topCreatorMap[topCreatorId])} total views</p>
                </>
              ):<p className="text-sm text-gray-400">No data yet</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
              <h3 className="text-sm font-semibold text-gray-700 mb-3">Top Videos by Views</h3>
              {chartData.length===0?<p className="text-xs text-gray-400 text-center py-8">No view data yet</p>:(
                <div className="space-y-2">
                  {chartData.map(v=>(
                    <div key={v.id} className="flex items-center gap-2">
                      <Thumb url={v.post_url} platform={v.platform} size="xs" />
                      <div className="w-16 text-xs text-gray-600 truncate shrink-0">{creatorName(v.creator_id).split(' ')[0]}</div>
                      <div className="flex-1 bg-gray-100 rounded-full h-5 overflow-hidden">
                        <div className="h-5 rounded-full bg-gradient-to-r from-lime-400 to-green-500 flex items-center justify-end pr-2 transition-all"
                          style={{width:Math.max(8,(Number(v.views||0)/maxViews)*100)+'%'}}>
                          <span className="text-xs font-bold text-gray-900 whitespace-nowrap">{fmtN(v.views)}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
              <h3 className="text-sm font-semibold text-gray-700 mb-3">Views by Creator</h3>
              {byCreator.length===0?<p className="text-xs text-gray-400 text-center py-8">No data yet</p>:(
                <div className="space-y-2">
                  {byCreator.map(([id,views])=>(
                    <div key={id} className="flex items-center gap-2">
                      <div className="w-24 text-xs text-gray-600 truncate shrink-0">{creatorName(id)}</div>
                      <div className="flex-1 bg-gray-100 rounded-full h-5 overflow-hidden">
                        <div className="h-5 rounded-full bg-gradient-to-r from-blue-400 to-indigo-500 flex items-center justify-end pr-2 transition-all"
                          style={{width:Math.max(8,(views/maxCreatorViews)*100)+'%'}}>
                          <span className="text-xs font-bold text-white whitespace-nowrap">{fmtN(views)}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {Object.keys(byPlatform).length>0&&(
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
              <h3 className="text-sm font-semibold text-gray-700 mb-3">Views by Platform</h3>
              <div className="flex flex-wrap gap-3">
                {Object.entries(byPlatform).sort((a,b)=>b[1]-a[1]).map(([p,v])=>(
                  <div key={p} className="flex items-center gap-2 bg-gray-50 rounded-lg px-3 py-2">
                    <span className={`w-2.5 h-2.5 rounded-full ${platformBadge[p]||'bg-gray-400'}`}/>
                    <span className="text-xs font-medium text-gray-700">{p}</span>
                    <span className="text-xs font-bold text-gray-900">{fmtN(v)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
            <div className="p-3 border-b border-gray-100 flex flex-wrap gap-2 items-center">
              <select value={filterPlatform} onChange={e=>setFilterPlatform(e.target.value)} className="border border-gray-200 rounded-lg px-3 py-2 text-sm">
                <option value="">All platforms</option>
                {['TikTok','Instagram','YouTube','X / Twitter'].map(p=><option key={p}>{p}</option>)}
              </select>
              <select value={filterProject} onChange={e=>setFilterProject(e.target.value)} className="border border-gray-200 rounded-lg px-3 py-2 text-sm">
                <option value="">All projects</option><option>Viggle</option><option>PINOC</option>
              </select>
              <select value={filterCreator} onChange={e=>setFilterCreator(e.target.value)} className="border border-gray-200 rounded-lg px-3 py-2 text-sm">
                <option value="">All creators</option>
                {data.creators.map(c=><option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
              <div className="ml-auto flex items-center gap-2">
                <div className="flex rounded-lg border border-gray-200 overflow-hidden">
                  {[{k:'table',icon:'☰'},{k:'grid',icon:'⊞'}].map(v=>(
                    <button key={v.k} onClick={()=>setPerfView(v.k)}
                      className={`px-2.5 py-1.5 text-sm transition-colors ${perfView===v.k?'bg-gray-900 text-white':'bg-white text-gray-500 hover:bg-gray-50'}`}>{v.icon}</button>
                  ))}
                </div>
                <span className="text-xs text-gray-400">Sort:</span>
                {['views','likes','comments','date'].map(s=>(
                  <button key={s} onClick={()=>setSortBy(s)}
                    className={`px-2 py-1 rounded-md text-xs capitalize ${sortBy===s?'bg-gray-900 text-white':'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>{s}</button>
                ))}
              </div>
            </div>

            {perfView==='grid'&&(
              <div className="p-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
                {sorted.length===0&&<p className="col-span-full text-center text-gray-400 py-12 text-sm">No posted videos yet</p>}
                {sorted.map(v=>(
                  <div key={v.id} className="group cursor-pointer" onClick={()=>editingStats===v.id?null:startEdit(v)}>
                    <div className="relative rounded-xl overflow-hidden bg-gray-100 aspect-video mb-2">
                      <div className="absolute inset-0"><Thumb url={v.post_url} platform={v.platform} size="lg" /></div>
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all flex items-center justify-center">
                        {editingStats!==v.id&&<span className="opacity-0 group-hover:opacity-100 text-white text-xs font-medium bg-black/60 px-2 py-1 rounded-full">Update stats</span>}
                      </div>
                      {v.post_url&&<a href={v.post_url} target="_blank" rel="noopener noreferrer" onClick={e=>e.stopPropagation()}
                        className="absolute top-1.5 right-1.5 bg-black/60 text-white text-xs px-1.5 py-0.5 rounded hover:bg-black/80">↗</a>}
                    </div>
                    {editingStats===v.id?(
                      <div className="space-y-1.5" onClick={e=>e.stopPropagation()}>
                        <p className="text-xs font-medium text-gray-800 truncate">{v.video_title}</p>
                        <div className="grid grid-cols-2 gap-1">
                          {['views','likes','comments','shares'].map(k=>(
                            <input key={k} type="number" value={statsForm[k]} placeholder={k}
                              onChange={e=>setStatsForm(f=>({...f,[k]:e.target.value}))}
                              className="border border-lime-400 rounded px-1.5 py-1 text-xs w-full"
                              autoFocus={k==='views'} />
                          ))}
                        </div>
                        <div className="flex gap-1">
                          <Btn size="sm" onClick={()=>saveStats(v.id)}>Save</Btn>
                          <Btn size="sm" variant="ghost" onClick={()=>setEditingStats(null)}>✕</Btn>
                        </div>
                      </div>
                    ):(
                      <>
                        <p className="text-xs font-medium text-gray-800 truncate">{v.video_title}</p>
                        <p className="text-xs text-gray-500 truncate">{creatorName(v.creator_id)}</p>
                        <div className="flex gap-2 mt-1 text-xs text-gray-600">
                          {v.views?<span>👁 {fmtN(v.views)}</span>:<span className="text-gray-300">Tap to add stats</span>}
                          {v.likes&&v.views?<span>❤ {fmtN(v.likes)}</span>:null}
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </div>
            )}

            {perfView==='table'&&(
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b border-gray-100 bg-gray-50">
                      <th className="py-2.5 px-3 w-12"></th>
                      <th className="text-left py-2.5 px-3 font-semibold text-gray-500">Video</th>
                      <th className="text-left py-2.5 px-3 font-semibold text-gray-500">Creator</th>
                      <th className="text-left py-2.5 px-3 font-semibold text-gray-500">Platform</th>
                      <th className="text-left py-2.5 px-3 font-semibold text-gray-500">Posted</th>
                      <th className="text-right py-2.5 px-3 font-semibold text-gray-500">Views</th>
                      <th className="text-right py-2.5 px-3 font-semibold text-gray-500">Likes</th>
                      <th className="text-right py-2.5 px-3 font-semibold text-gray-500">Comments</th>
                      <th className="text-right py-2.5 px-3 font-semibold text-gray-500">Eng%</th>
                      <th className="py-2.5 px-3"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {sorted.length===0&&<tr><td colSpan={10} className="py-12 text-center text-gray-400">No posted videos yet</td></tr>}
                    {sorted.map(v=>(
                      <tr key={v.id} className="hover:bg-gray-50/80 transition-colors">
                        <td className="py-2 px-3"><Thumb url={v.post_url} platform={v.platform} size="xs" /></td>
                        {editingStats===v.id?(
                          <>
                            <td className="py-2 px-3 font-medium text-gray-800 max-w-xs truncate">{v.video_title}</td>
                            <td className="py-2 px-3 text-gray-500">{creatorName(v.creator_id)}</td>
                            <td className="py-2 px-3 text-gray-500">{v.platform}</td>
                            <td className="py-2 px-3 text-gray-500">{Utils.fmt(v.actual_post_date)}</td>
                            {['views','likes','comments','shares'].map(k=>(
                              <td key={k} className="py-2 px-2">
                                <input type="number" value={statsForm[k]}
                                  onChange={e=>setStatsForm(f=>({...f,[k]:e.target.value}))}
                                  className="w-16 text-right border border-lime-400 rounded px-1.5 py-0.5 text-xs"
                                  onKeyDown={e=>{if(e.key==='Enter')saveStats(v.id);if(e.key==='Escape')setEditingStats(null);}}
                                  autoFocus={k==='views'} />
                              </td>
                            ))}
                            <td className="py-2 px-3 text-gray-400">—</td>
                            <td className="py-2 px-3">
                              <div className="flex gap-1">
                                <Btn size="sm" onClick={()=>saveStats(v.id)}>Save</Btn>
                                <Btn size="sm" variant="ghost" onClick={()=>setEditingStats(null)}>✕</Btn>
                              </div>
                            </td>
                          </>
                        ):(
                          <>
                            <td className="py-2.5 px-3 font-medium text-gray-800 max-w-xs">
                              <div className="truncate">{v.video_title}</div>
                              <Badge className={Utils.productColor(v.project)}>{v.project}</Badge>
                            </td>
                            <td className="py-2.5 px-3 text-gray-600">{creatorName(v.creator_id)}</td>
                            <td className="py-2.5 px-3 text-gray-500">{v.platform}</td>
                            <td className="py-2.5 px-3 text-gray-500">{Utils.fmt(v.actual_post_date)}</td>
                            <td className="py-2.5 px-3 text-right font-semibold text-gray-800">{v.views?fmtN(v.views):<span className="text-gray-300">—</span>}</td>
                            <td className="py-2.5 px-3 text-right text-gray-600">{v.likes?fmtN(v.likes):<span className="text-gray-300">—</span>}</td>
                            <td className="py-2.5 px-3 text-right text-gray-600">{v.comments?fmtN(v.comments):<span className="text-gray-300">—</span>}</td>
                            <td className="py-2.5 px-3 text-right">
                              <span className={`font-medium ${Number(v.views)>0?(Number(v.likes||0)+Number(v.comments||0))/Number(v.views)*100>=5?'text-green-600':'text-gray-600':'text-gray-300'}`}>{engRate(v)}</span>
                            </td>
                            <td className="py-2.5 px-3">
                              <div className="flex items-center gap-1">
                                <Btn size="sm" variant="ghost" onClick={()=>startEdit(v)}>Edit stats</Btn>
                                {v.post_url&&<a href={v.post_url} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-600 text-xs px-1">↗</a>}
                              </div>
                            </td>
                          </>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {tab==='content' && (
        <div className="space-y-4">
          {repostable.length>0&&(
            <div className="p-4 border border-emerald-200 rounded-xl bg-emerald-50 border-l-4 border-l-emerald-400">
              <p className="text-sm font-semibold text-emerald-800 mb-2">🟢 {repostable.length} piece{repostable.length!==1?'s':''} ready to repost</p>
              <div className="flex flex-wrap gap-2">
                {repostable.map(a=>(
                  <div key={a.id} className="bg-white rounded-lg px-3 py-2 flex items-center gap-2 border border-emerald-200 text-sm">
                    <span className="font-medium">{creatorName(a.creator_id)}</span>
                    <span className="text-gray-400">·</span><span className="text-gray-600">{a.platform}</span>
                    {!a.reposted_by_viggle&&<Btn size="sm" variant="success" onClick={()=>markReposted(a.id,'viggle')}>Viggle ↗</Btn>}
                    {!a.reposted_by_pinoc&&<Btn size="sm" variant="secondary" onClick={()=>markReposted(a.id,'pinoc')}>PINOC ↗</Btn>}
                  </div>
                ))}
              </div>
            </div>
          )}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-3 flex flex-wrap gap-2 items-center">
            <SearchInput value={contentSearch} onChange={setContentSearch} placeholder="Search content..." />
            <select value={filterContentStatus} onChange={e=>setFilterContentStatus(e.target.value)} className="border border-gray-200 rounded-lg px-3 py-2 text-sm">
              <option value="">All statuses</option>
              {CONTENT_STATUSES_A.map(s=><option key={s}>{s}</option>)}
            </select>
            <select value={filterContentPlatform} onChange={e=>setFilterContentPlatform(e.target.value)} className="border border-gray-200 rounded-lg px-3 py-2 text-sm">
              <option value="">All platforms</option>
              {['TikTok','Instagram','YouTube','X / Twitter'].map(p=><option key={p}>{p}</option>)}
            </select>
            <div className="ml-auto flex rounded-lg border border-gray-200 overflow-hidden">
              {[{k:'grid',icon:'⊞'},{k:'table',icon:'☰'}].map(v=>(
                <button key={v.k} onClick={()=>setContentView(v.k)}
                  className={`px-2.5 py-1.5 text-sm transition-colors ${contentView===v.k?'bg-gray-900 text-white':'bg-white text-gray-500 hover:bg-gray-50'}`}>{v.icon}</button>
              ))}
            </div>
          </div>

          {contentView==='grid'&&(
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
              {contentFiltered.length===0&&(
                <div className="col-span-full text-center py-16 text-gray-400">
                  <p className="text-sm mb-3">No content yet. Paste a link to get started.</p>
                  <Btn onClick={()=>setContentModal({})}>Add first piece</Btn>
                </div>
              )}
              {contentFiltered.map(a=>(
                <div key={a.id} className="group cursor-pointer bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-all"
                  onClick={()=>setContentModal(a)}>
                  <div className="relative aspect-video bg-gray-100">
                    <div className="absolute inset-0"><Thumb url={a.original_post_url} platform={a.platform} size="lg" /></div>
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all"/>
                    <div className="absolute top-1.5 left-1.5">
                      <Badge className={Utils.statusColor(a.content_status)}>{a.content_status}</Badge>
                    </div>
                    {a.original_post_url&&<a href={a.original_post_url} target="_blank" rel="noopener noreferrer"
                      onClick={e=>e.stopPropagation()}
                      className="absolute top-1.5 right-1.5 bg-black/60 text-white text-xs px-1.5 py-0.5 rounded hover:bg-black/80">↗</a>}
                    <div className="absolute bottom-1.5 left-1.5 right-1.5 flex gap-1">
                      {a.reposted_by_viggle&&<span className="bg-blue-600 text-white text-xs px-1.5 py-0.5 rounded font-medium">Viggle ✓</span>}
                      {a.reposted_by_pinoc&&<span className="bg-purple-600 text-white text-xs px-1.5 py-0.5 rounded font-medium">PINOC ✓</span>}
                    </div>
                  </div>
                  <div className="p-3">
                    <p className="text-xs font-semibold text-gray-900 truncate">{a.content_title}</p>
                    <p className="text-xs text-gray-500 truncate mt-0.5">{creatorName(a.creator_id)} · {a.platform}</p>
                    {(a.views||a.likes)&&(
                      <div className="flex gap-3 mt-1.5 text-xs text-gray-600">
                        {a.views&&<span>👁 {fmtN(a.views)}</span>}
                        {a.likes&&<span>❤ {fmtN(a.likes)}</span>}
                      </div>
                    )}
                    {a.repost_permission&&!a.reposted_by_viggle&&!a.reposted_by_pinoc&&(
                      <p className="text-xs text-emerald-600 mt-1 font-medium">Repost OK</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {contentView==='table'&&(
            <Card>
              <Table
                columns={[
                  {key:'original_post_url',label:'',render:(v,r)=><Thumb url={v} platform={r.platform} size="xs"/>},
                  {key:'content_title',label:'Content'},
                  {key:'creator_id',label:'Creator',render:v=>creatorName(v)},
                  {key:'product',label:'Product',render:v=><Badge className={Utils.productColor(v)}>{v}</Badge>},
                  {key:'platform',label:'Platform'},
                  {key:'content_status',label:'Status',render:v=><Badge className={Utils.statusColor(v)}>{v}</Badge>},
                  {key:'views',label:'Views',render:v=>fmtN(v)},
                  {key:'likes',label:'Likes',render:v=>fmtN(v)},
                  {key:'repost_permission',label:'Repost OK',render:v=>v?<span className="text-emerald-600">✓</span>:'—'},
                  {key:'reposted_by_viggle',label:'Viggle',render:v=>v?<span className="text-green-600">✓</span>:'—'},
                  {key:'reposted_by_pinoc',label:'PINOC',render:v=>v?<span className="text-purple-600">✓</span>:'—'},
                  {key:'id',label:'',render:(v,r)=><div onClick={e=>e.stopPropagation()}><Btn size="sm" variant="ghost" onClick={()=>setContentModal(r)}>Edit</Btn></div>},
                ]}
                rows={contentFiltered}
                onRowClick={row=>setContentModal(row)}
                emptyMessage="No content assets yet"
              />
            </Card>
          )}
        </div>
      )}

      <Modal open={!!contentModal} onClose={()=>setContentModal(null)} title={contentModal?.id?'Edit Content':'Add Content — paste URL for thumbnail'} size="lg">
        {contentModal!==null&&<ContentForm asset={contentModal?.id?contentModal:null} data={data} onSave={saveContent} onClose={()=>setContentModal(null)}/>}
      </Modal>
    </div>
  );
}
