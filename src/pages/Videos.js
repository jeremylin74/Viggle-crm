const VIDEO_STATUSES = ['Signed','Awaiting Draft','Draft Submitted','In Review','Revision Needed','Approved','Scheduled','Posted','Cancelled','Overdue','Paid'];
const APPROVAL_STATUSES = ['Not submitted','Pending review','Approved','Needs changes','Rejected'];

function VideoForm({ video, data, setData, onSave, onClose }) {
  const [form, setForm] = React.useState(video || {
    creator_id:'', deal_id:'', campaign_id:'', project:'Viggle', video_title:'',
    platform:'TikTok', deliverable_type:'TikTok video', contract_signed_date:'',
    draft_due_date:'', draft_submitted_date:'', review_due_date:'', scheduled_post_date:'',
    actual_post_date:'', video_status:'Awaiting Draft', approval_status:'Not submitted',
    repost_allowed:false, post_url:'', file_url:'', payment_status:'Not started',
    views:'', likes:'', comments:'', shares:'',
    owner_id:data.current_user_id, notes:'',
  });
  const set = (k,v) => setForm(f=>({...f,[k]:v}));

  return (
    <form onSubmit={e=>{e.preventDefault();onSave(form);}} className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <Input label="Video Title" value={form.video_title} onChange={v=>set('video_title',v)} required className="col-span-2" />
        <Select label="Creator" value={form.creator_id} onChange={v=>set('creator_id',v)} options={data.creators.map(c=>({value:c.id,label:c.name}))} required />
        <Select label="Deal" value={form.deal_id} onChange={v=>set('deal_id',v)} options={data.deals.filter(d=>!form.creator_id||d.creator_id===form.creator_id).map(d=>({value:d.id,label:d.deal_name}))} />
        <CampaignSelect label="Campaign" value={form.campaign_id} onChange={v=>set('campaign_id',v)} data={data} setData={setData} />
        <Select label="Project" value={form.project} onChange={v=>set('project',v)} options={['Viggle','PINOC','Both']} />
        <Select label="Platform" value={form.platform} onChange={v=>set('platform',v)} options={['TikTok','Instagram','YouTube','X / Twitter']} />
        <Select label="Video Status" value={form.video_status} onChange={v=>set('video_status',v)} options={VIDEO_STATUSES} />
        <Select label="Approval Status" value={form.approval_status} onChange={v=>set('approval_status',v)} options={APPROVAL_STATUSES} />
        <Input label="Contract Signed" value={form.contract_signed_date} onChange={v=>set('contract_signed_date',v)} type="date" />
        <Input label="Draft Due" value={form.draft_due_date} onChange={v=>set('draft_due_date',v)} type="date" />
        <Input label="Draft Submitted" value={form.draft_submitted_date} onChange={v=>set('draft_submitted_date',v)} type="date" />
        <Input label="Review Due" value={form.review_due_date} onChange={v=>set('review_due_date',v)} type="date" />
        <Input label="Scheduled Post" value={form.scheduled_post_date} onChange={v=>set('scheduled_post_date',v)} type="date" />
        <Input label="Actual Post" value={form.actual_post_date} onChange={v=>set('actual_post_date',v)} type="date" />
        <Input label="Post URL" value={form.post_url} onChange={v=>set('post_url',v)} placeholder="https://..." className="col-span-2" />
        <Input label="Views" value={form.views} onChange={v=>set('views',v)} type="number" placeholder="0" />
        <Input label="Likes" value={form.likes} onChange={v=>set('likes',v)} type="number" placeholder="0" />
        <Input label="Comments" value={form.comments} onChange={v=>set('comments',v)} type="number" placeholder="0" />
        <Input label="Shares" value={form.shares} onChange={v=>set('shares',v)} type="number" placeholder="0" />
        <Select label="Payment Status" value={form.payment_status} onChange={v=>set('payment_status',v)} options={['Not started','Pending approval','Ready to pay','Paid','On hold']} />
        <Select label="Owner" value={form.owner_id} onChange={v=>set('owner_id',v)} options={data.team_members.map(m=>({value:m.id,label:m.name}))} />
      </div>
      <Toggle value={form.repost_allowed} onChange={v=>set('repost_allowed',v)} label="Repost allowed" />
      <Textarea label="Notes" value={form.notes} onChange={v=>set('notes',v)} />
      <div className="flex justify-end gap-2 pt-2">
        <Btn variant="secondary" onClick={onClose}>Cancel</Btn>
        <Btn type="submit">Save Video</Btn>
      </div>
    </form>
  );
}

const STATUS_COLORS_CAL = {
  'Signed':           { dot:'bg-violet-400', pill:'bg-violet-100 text-violet-700' },
  'Awaiting Draft':   { dot:'bg-yellow-400', pill:'bg-yellow-100 text-yellow-700' },
  'Draft Submitted':  { dot:'bg-orange-400', pill:'bg-orange-100 text-orange-700' },
  'In Review':        { dot:'bg-pink-400',   pill:'bg-pink-100 text-pink-700' },
  'Revision Needed':  { dot:'bg-red-400',    pill:'bg-red-100 text-red-700' },
  'Approved':         { dot:'bg-emerald-400',pill:'bg-emerald-100 text-emerald-700' },
  'Scheduled':        { dot:'bg-sky-400',    pill:'bg-sky-100 text-sky-700' },
  'Posted':           { dot:'bg-green-500',  pill:'bg-green-100 text-green-700' },
  'Cancelled':        { dot:'bg-gray-400',   pill:'bg-gray-100 text-gray-500' },
  'Overdue':          { dot:'bg-red-600',    pill:'bg-red-100 text-red-800' },
  'Paid':             { dot:'bg-teal-400',   pill:'bg-teal-100 text-teal-700' },
};
function calDot(v) { return (STATUS_COLORS_CAL[v.video_status]||{dot:'bg-gray-300'}).dot; }
function calPill(v) { return (STATUS_COLORS_CAL[v.video_status]||{pill:'bg-gray-100 text-gray-500'}).pill; }
function addDays(d,n){const r=new Date(d);r.setDate(r.getDate()+n);return r;}
function ymd(d){return d.toISOString().slice(0,10);}

function VideoCalendar({ videos, data, setData }) {
  const creatorName = id => data.creators.find(c=>c.id===id)?.name || '?';
  const [calView, setCalView] = React.useState('monthly');
  const [anchorDate, setAnchorDate] = React.useState(ymd(new Date()));
  const [selectedDay, setSelectedDay] = React.useState(null);
  const [dragCalVideo, setDragCalVideo] = React.useState(null);
  const [dragCalOver, setDragCalOver] = React.useState(null);

  const todayStr = ymd(new Date());
  const anchor = new Date(anchorDate + 'T00:00:00');

  function shiftAnchor(dir) {
    const d = new Date(anchor);
    if (calView==='daily') d.setDate(d.getDate()+dir);
    else if (calView==='3day') d.setDate(d.getDate()+dir*3);
    else if (calView==='weekly') d.setDate(d.getDate()+dir*7);
    else d.setMonth(d.getMonth()+dir);
    setAnchorDate(ymd(d)); setSelectedDay(null);
  }
  function goToday(){setAnchorDate(todayStr);setSelectedDay(null);}

  const byDate = {};
  videos.forEach(v=>{
    const d=v.scheduled_post_date||v.actual_post_date; if(!d)return;
    const ds=d.slice(0,10); if(!byDate[ds])byDate[ds]=[]; byDate[ds].push(v);
  });

  function dropOnDate(ds){
    if(!dragCalVideo||dragCalVideo.date===ds){setDragCalVideo(null);setDragCalOver(null);return;}
    const now=Utils.now();
    setData(d=>({...d,videos:d.videos.map(x=>x.id===dragCalVideo.id?{...x,scheduled_post_date:ds,updated_at:now}:x)}));
    setDragCalVideo(null);setDragCalOver(null);
  }

  let days=[];
  if(calView==='daily') days=[ymd(anchor)];
  else if(calView==='3day') for(let i=0;i<3;i++) days.push(ymd(addDays(anchor,i)));
  else if(calView==='weekly'){const dow=anchor.getDay();const sun=addDays(anchor,-dow);for(let i=0;i<7;i++)days.push(ymd(addDays(sun,i)));}

  let label='';
  if(calView==='monthly') label=anchor.toLocaleDateString('en-US',{month:'long',year:'numeric'});
  else if(calView==='daily') label=anchor.toLocaleDateString('en-US',{weekday:'long',month:'long',day:'numeric',year:'numeric'});
  else{
    const first=new Date(days[0]+'T00:00:00'),last=new Date(days[days.length-1]+'T00:00:00');
    label=first.toLocaleDateString('en-US',{month:'short',day:'numeric'})+' – '+last.toLocaleDateString('en-US',{month:'short',day:'numeric',year:'numeric'});
  }

  function DayCell({ds,isToday,minH,compact}){
    const dayVideos=byDate[ds]||[];
    const dayNum=parseInt(ds.split('-')[2]);
    const isOver=dragCalOver===ds;
    const sel=selectedDay===ds;
    return (
      <div className={`rounded-lg p-1.5 border transition-all cursor-pointer ${isToday?'border-blue-400 bg-blue-50':sel?'border-lime-400 bg-lime-50':'border-gray-100 bg-gray-50/40'} ${isOver?'ring-2 ring-lime-300 border-lime-400':''}` }
        style={{minHeight:minH||64}}
        onClick={()=>setSelectedDay(sel?null:ds)}
        onDragOver={e=>{e.preventDefault();setDragCalOver(ds);}}
        onDragLeave={e=>{if(!e.currentTarget.contains(e.relatedTarget))setDragCalOver(null);}}
        onDrop={e=>{e.preventDefault();dropOnDate(ds);}}
      >
        <div className={`text-xs font-bold mb-1 ${isToday?'text-blue-600':'text-gray-400'}`}>{dayNum}</div>
        <div className="space-y-0.5">
          {(compact?dayVideos.slice(0,3):dayVideos).map(v=>(
            <div key={v.id} draggable
              onDragStart={e=>{e.stopPropagation();e.dataTransfer.effectAllowed='move';setDragCalVideo({id:v.id,date:ds});}}
              onDragEnd={()=>{setDragCalVideo(null);setDragCalOver(null);}}
              onClick={e=>e.stopPropagation()}
            >
              {compact?(
                <div className={`flex items-center gap-1 rounded px-1 py-0.5 ${calPill(v)} truncate`} title={v.video_title}>
                  <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${calDot(v)}`}/>
                  <span className="text-xs truncate font-medium leading-tight">{creatorName(v.creator_id).split(' ')[0]}</span>
                </div>
              ):(
                <div className={`rounded-lg px-2 py-1.5 ${calPill(v)} border border-black/5`}>
                  <div className="flex items-center gap-1 mb-0.5">
                    <span className={`w-2 h-2 rounded-full shrink-0 ${calDot(v)}`}/>
                    <span className="text-xs font-semibold truncate">{creatorName(v.creator_id)}</span>
                  </div>
                  <p className="text-xs truncate opacity-80 leading-tight">{v.video_title}</p>
                  <div className="flex items-center gap-1.5 mt-0.5 flex-wrap">
                    <span className="text-xs opacity-70">{v.video_status}</span>
                    {v.platform && <span className="text-xs opacity-60">· {v.platform.split('/')[0]}</span>}
                  </div>
                </div>
              )}
            </div>
          ))}
          {compact&&dayVideos.length>3&&<div className="text-xs text-gray-400 px-1">+{dayVideos.length-3}</div>}
        </div>
        {isOver&&<div className="border border-dashed border-lime-400 rounded h-6 flex items-center justify-center mt-1"><span className="text-xs text-lime-500">Drop to reschedule</span></div>}
      </div>
    );
  }

  function MonthlyGrid(){
    const year=anchor.getFullYear(),month=anchor.getMonth();
    const firstDay=new Date(year,month,1).getDay();
    const daysInMonth=new Date(year,month+1,0).getDate();
    const cells=[];
    for(let i=0;i<firstDay;i++)cells.push(null);
    for(let d=1;d<=daysInMonth;d++)cells.push(d);
    return (
      <div>
        <div className="grid grid-cols-7 gap-0.5 mb-1">
          {['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].map(d=>(
            <div key={d} className="text-center text-xs font-semibold text-gray-400 py-1">{d}</div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-0.5">
          {cells.map((day,i)=>{
            if(!day) return <div key={'e'+i}/>;
            const ds=`${year}-${String(month+1).padStart(2,'0')}-${String(day).padStart(2,'0')}`;
            return <DayCell key={ds} ds={ds} isToday={ds===todayStr} minH={72} compact />;
          })}
        </div>
      </div>
    );
  }

  function MultiDayGrid(){
    return (
      <div className="grid gap-2" style={{gridTemplateColumns:`repeat(${days.length},1fr)`}}>
        {days.map(ds=>{
          const d=new Date(ds+'T00:00:00');
          const dayLabel=d.toLocaleDateString('en-US',{weekday:'short',month:'short',day:'numeric'});
          const isToday=ds===todayStr;
          return (
            <div key={ds}>
              <div className={`text-center text-xs font-semibold py-1 mb-1 rounded ${isToday?'text-blue-600 bg-blue-50':'text-gray-500'}`}>{dayLabel}</div>
              <DayCell ds={ds} isToday={isToday} minH={calView==='daily'?320:180} compact={false}/>
            </div>
          );
        })}
      </div>
    );
  }

  const selectedVideos=selectedDay?(byDate[selectedDay]||[]):[];

  return (
    <div className="space-y-3">
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
        <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <button onClick={()=>shiftAnchor(-1)} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500 text-lg leading-none">‹</button>
            <button onClick={goToday} className="text-xs px-2 py-1 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-600 font-medium">Today</button>
            <button onClick={()=>shiftAnchor(1)} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500 text-lg leading-none">›</button>
            <h3 className="font-semibold text-gray-800 text-sm">{label}</h3>
          </div>
          <div className="flex rounded-lg border border-gray-200 overflow-hidden">
            {[{key:'daily',label:'Day'},{key:'3day',label:'3-Day'},{key:'weekly',label:'Week'},{key:'monthly',label:'Month'}].map(t=>(
              <button key={t.key} onClick={()=>{setCalView(t.key);setSelectedDay(null);}}
                className={`px-3 py-1.5 text-xs font-medium transition-colors ${calView===t.key?'bg-gray-900 text-white':'bg-white text-gray-600 hover:bg-gray-50'}`}>
                {t.label}
              </button>
            ))}
          </div>
        </div>
        {calView==='monthly'?<MonthlyGrid/>:<MultiDayGrid/>}
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-3 pt-3 border-t border-gray-100">
          {Object.entries(STATUS_COLORS_CAL).map(([s,c])=>(
            <span key={s} className="flex items-center gap-1 text-xs text-gray-500">
              <span className={`w-2 h-2 rounded-full inline-block ${c.dot}`}/>{s}
            </span>
          ))}
        </div>
      </div>

      {selectedDay&&selectedVideos.length>0&&(
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
          <h4 className="text-sm font-semibold text-gray-700 mb-3">
            {new Date(selectedDay+'T00:00:00').toLocaleDateString('en-US',{weekday:'long',month:'long',day:'numeric',year:'numeric'})}
            <span className="ml-2 text-gray-400 font-normal">{selectedVideos.length} video{selectedVideos.length!==1?'s':''}</span>
          </h4>
          <div className="space-y-2">
            {selectedVideos.map(v=>(
              <div key={v.id} className={`rounded-xl border border-black/5 overflow-hidden ${calPill(v)}`}>
                {v.post_url ? (
                  <div className="flex gap-3 p-3">
                    <div className="shrink-0 w-24 h-14 rounded-lg overflow-hidden bg-gray-200">
                      <Thumb url={v.post_url} platform={v.platform} size="md"/>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-1">
                        <p className="text-sm font-semibold truncate">{v.video_title}</p>
                        <span className={`text-xs font-medium px-2 py-0.5 rounded-full whitespace-nowrap shrink-0 ${calPill(v)}`}>{v.video_status}</span>
                      </div>
                      <p className="text-xs opacity-70 mt-0.5">{creatorName(v.creator_id)} · {v.platform}</p>
                      {v.views&&<p className="text-xs opacity-60 mt-0.5">👁 {Utils.fmtNum(v.views)}</p>}
                      <a href={v.post_url} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-500 hover:underline mt-0.5 inline-block">View post ↗</a>
                    </div>
                  </div>
                ) : (
                  <div className="p-3">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5 mb-0.5">
                          {v.video_status==='Scheduled'&&<span className="text-xs bg-sky-200 text-sky-700 px-1.5 py-0.5 rounded font-medium">📅 Incoming</span>}
                          <p className="text-sm font-semibold truncate">{v.video_title}</p>
                        </div>
                        <p className="text-xs opacity-70">{creatorName(v.creator_id)} · {v.platform}</p>
                      </div>
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-full whitespace-nowrap ${calPill(v)}`}>{v.video_status}</span>
                    </div>
                    {v.scheduled_post_date&&<p className="text-xs opacity-60 mt-1">Scheduled: {Utils.fmt(v.scheduled_post_date)}</p>}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function Videos({ data, setData, navigate, myView }) {
  const [view, setView] = React.useState('kanban');
  const [modal, setModal] = React.useState(null);
  const [filterProject, setFilterProject] = React.useState('');
  const [filterCreator, setFilterCreator] = React.useState('');
  const [search, setSearch] = React.useState('');
  const [dragging, setDragging] = React.useState(null);
  const [dragOver, setDragOver] = React.useState(null);

  const creatorName = id => data.creators.find(c=>c.id===id)?.name || '—';
  const campaignName = id => data.campaigns.find(c=>c.id===id)?.campaign_name || '—';

  const filtered = data.videos.filter(v => {
    const q = search.toLowerCase();
    const matchSearch = !q || v.video_title.toLowerCase().includes(q) || creatorName(v.creator_id).toLowerCase().includes(q);
    const matchMyView = !myView || v.owner_id === data.current_user_id;
    return matchSearch && (!filterProject || v.project===filterProject) && (!filterCreator || v.creator_id===filterCreator) && matchMyView;
  });

  function saveVideo(form) {
    const now = Utils.now();
    if (!form.id) {
      const newV = {...form, id:Utils.uid(), created_at:now, updated_at:now};
      const log = {id:Utils.uid(),user_id:data.current_user_id,action:'Video added',related_creator_id:form.creator_id,related_deal_id:form.deal_id,related_campaign_id:form.campaign_id,related_payment_id:null,related_video_id:newV.id,old_value:null,new_value:form.video_title,timestamp:now};
      setData(d=>({...d,videos:[...d.videos,newV],activity_log:[log,...d.activity_log]}));
    } else {
      setData(d=>({...d,videos:d.videos.map(x=>x.id===form.id?{...form,updated_at:now}:x)}));
    }
    setModal(null);
  }

  function updateStatus(id, newStatus) {
    const now = Utils.now();
    const v = data.videos.find(x=>x.id===id);
    const log = {id:Utils.uid(),user_id:data.current_user_id,action:`Video status → ${newStatus}`,related_creator_id:v?.creator_id,related_deal_id:v?.deal_id,related_campaign_id:null,related_payment_id:null,related_video_id:id,old_value:v?.video_status,new_value:newStatus,timestamp:now};
    const updates = {video_status:newStatus, updated_at:now};
    if (newStatus==='Posted') updates.actual_post_date = Utils.today();
    setData(d=>({...d,videos:d.videos.map(x=>x.id===id?{...x,...updates}:x),activity_log:[log,...d.activity_log]}));
  }

  const kanbanCols = VIDEO_STATUSES.slice(0,-1); // exclude Paid from kanban top
  const kanbanColsFull = ['Signed','Awaiting Draft','Draft Submitted','In Review','Revision Needed','Approved','Scheduled','Posted'];

  const colBg = {
    'Signed':'bg-violet-50','Awaiting Draft':'bg-yellow-50','Draft Submitted':'bg-orange-50',
    'In Review':'bg-pink-50','Revision Needed':'bg-red-50','Approved':'bg-emerald-50',
    'Scheduled':'bg-sky-50','Posted':'bg-green-50',
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Creator Video Schedule</h1>
          <p className="text-sm text-gray-500 mt-0.5">{data.videos.length} videos total</p>
        </div>
        <div className="flex gap-2">
          <Tabs tabs={[{key:'kanban',label:'Kanban'},{key:'calendar',label:'Calendar'},{key:'timeline',label:'Timeline'},{key:'table',label:'Table'}]} active={view} onChange={setView} />
          <Btn onClick={()=>setModal({})}>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
            Add Video
          </Btn>
        </div>
      </div>

      <Card className="p-3">
        <div className="flex flex-wrap gap-2">
          <SearchInput value={search} onChange={setSearch} placeholder="Search videos..." />
          <select value={filterProject} onChange={e=>setFilterProject(e.target.value)} className="border border-gray-200 rounded-lg px-3 py-2 text-sm">
            <option value="">All projects</option>
            <option>Viggle</option><option>PINOC</option>
          </select>
          <select value={filterCreator} onChange={e=>setFilterCreator(e.target.value)} className="border border-gray-200 rounded-lg px-3 py-2 text-sm">
            <option value="">All creators</option>
            {data.creators.map(c=><option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>
      </Card>

      {view === 'kanban' && (
        <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-hide">
          {kanbanColsFull.map(col => {
            const cards = filtered.filter(v=>v.video_status===col);
            const isOver = dragOver === col;
            return (
              <div key={col}
                className={`shrink-0 w-56 rounded-xl border kanban-col transition-all ${colBg[col]||'bg-gray-50'} ${isOver ? 'border-lime-400 ring-2 ring-lime-200 scale-[1.01]' : 'border-gray-100'}`}
                onDragOver={e=>{e.preventDefault();setDragOver(col);}}
                onDragLeave={e=>{if(!e.currentTarget.contains(e.relatedTarget))setDragOver(null);}}
                onDrop={e=>{e.preventDefault();if(dragging){updateStatus(dragging,col);}setDragging(null);setDragOver(null);}}
              >
                <div className="p-3 border-b border-gray-200/60">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-gray-600">{col}</span>
                    <span className="text-xs bg-white/80 text-gray-500 px-1.5 py-0.5 rounded-full">{cards.length}</span>
                  </div>
                </div>
                <div className={`p-2 space-y-2 min-h-12 transition-all ${isOver&&cards.length===0?'bg-lime-50/60':''}`}>
                  {cards.map(v => (
                    <div key={v.id}
                      draggable
                      onDragStart={e=>{e.dataTransfer.effectAllowed='move';setDragging(v.id);}}
                      onDragEnd={()=>{setDragging(null);setDragOver(null);}}
                      className={`bg-white rounded-lg shadow-sm border transition-all select-none overflow-hidden
                        ${dragging===v.id?'opacity-40 border-lime-300 shadow-none':'border-gray-100 hover:border-lime-300 hover:shadow-md'}
                        cursor-grab active:cursor-grabbing`}
                      onClick={()=>{if(!dragging)setModal(v);}}
                    >
                      {v.post_url && (
                        <div className="relative w-full aspect-video bg-gray-100">
                          <div className="absolute inset-0"><Thumb url={v.post_url} platform={v.platform} size="lg"/></div>
                          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"/>
                          <a href={v.post_url} target="_blank" rel="noopener noreferrer" onClick={e=>e.stopPropagation()}
                            className="absolute top-1 right-1 bg-black/60 text-white text-xs px-1.5 py-0.5 rounded">↗</a>
                        </div>
                      )}
                      {!v.post_url && v.video_status === 'Scheduled' && (
                        <div className="w-full aspect-video bg-sky-50 flex flex-col items-center justify-center border-b border-sky-100">
                          <span className="text-sky-400 text-2xl">📅</span>
                          <span className="text-xs text-sky-500 font-medium mt-1">Incoming</span>
                          {v.scheduled_post_date && <span className="text-xs text-sky-400">{Utils.fmt(v.scheduled_post_date)}</span>}
                        </div>
                      )}
                      <div className="p-3">
                        <p className="text-xs font-semibold text-gray-800 leading-tight mb-1">{v.video_title}</p>
                        <p className="text-xs text-gray-500">{creatorName(v.creator_id)}</p>
                        <div className="flex items-center justify-between mt-2">
                          <Badge className={Utils.productColor(v.project)}>{v.project}</Badge>
                          {v.draft_due_date && (
                            <span className={`text-xs ${Utils.isOverdue(v.draft_due_date)?'text-red-500 font-medium':'text-gray-400'}`}>
                              Due {Utils.fmt(v.draft_due_date)}
                            </span>
                          )}
                        </div>
                        {v.views && <p className="text-xs text-gray-400 mt-1">👁 {Utils.fmtNum(v.views)}</p>}
                      </div>
                    </div>
                  ))}
                  {isOver && (
                    <div className="border-2 border-dashed border-lime-400 rounded-lg h-10 flex items-center justify-center">
                      <span className="text-xs text-lime-500 font-medium">Drop here → {col}</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {view === 'calendar' && <VideoCalendar videos={filtered} data={data} setData={setData} />}

      {view === 'timeline' && (
        <Card className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left py-3 px-4 font-semibold text-gray-500 w-40">Creator</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-500">Video</th>
                <th className="text-left py-3 px-3 font-semibold text-gray-500 whitespace-nowrap">Contract</th>
                <th className="text-left py-3 px-3 font-semibold text-gray-500 whitespace-nowrap">Draft Due</th>
                <th className="text-left py-3 px-3 font-semibold text-gray-500 whitespace-nowrap">Review Due</th>
                <th className="text-left py-3 px-3 font-semibold text-gray-500 whitespace-nowrap">Sched. Post</th>
                <th className="text-left py-3 px-3 font-semibold text-gray-500 whitespace-nowrap">Posted</th>
                <th className="text-left py-3 px-3 font-semibold text-gray-500">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map(v => (
                <tr key={v.id} className="hover:bg-blue-50/50 cursor-pointer" onClick={()=>setModal(v)}>
                  <td className="py-3 px-4 font-medium text-gray-700">{creatorName(v.creator_id)}</td>
                  <td className="py-3 px-4 text-gray-600 max-w-xs truncate">{v.video_title}</td>
                  <td className="py-3 px-3 text-gray-500">{Utils.fmt(v.contract_signed_date)}</td>
                  <td className={`py-3 px-3 ${Utils.isOverdue(v.draft_due_date)&&v.video_status==='Awaiting Draft'?'text-red-500 font-semibold':''}`}>{Utils.fmt(v.draft_due_date)}</td>
                  <td className="py-3 px-3 text-gray-500">{Utils.fmt(v.review_due_date)}</td>
                  <td className="py-3 px-3 text-gray-500">{Utils.fmt(v.scheduled_post_date)}</td>
                  <td className="py-3 px-3 text-green-600 font-medium">{Utils.fmt(v.actual_post_date)}</td>
                  <td className="py-3 px-3"><Badge className={Utils.statusColor(v.video_status)}>{v.video_status}</Badge></td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && <div className="py-12 text-center text-gray-400 text-sm">No videos match filters</div>}
        </Card>
      )}

      {view === 'table' && (
        <Card>
          <Table
            columns={[
              {key:'video_title', label:'Video'},
              {key:'creator_id', label:'Creator', render: v => creatorName(v)},
              {key:'project', label:'Project', render: v => <Badge className={Utils.productColor(v)}>{v}</Badge>},
              {key:'video_status', label:'Status', render: v => <Badge className={Utils.statusColor(v)}>{v}</Badge>},
              {key:'approval_status', label:'Approval', render: v => <Badge className={Utils.statusColor(v)}>{v}</Badge>},
              {key:'draft_due_date', label:'Draft Due', render: v => <span className={Utils.isOverdue(v)?'text-red-500 font-medium':''}>{Utils.fmt(v)}</span>},
              {key:'scheduled_post_date', label:'Post Date', render: v => Utils.fmt(v)},
              {key:'actual_post_date', label:'Posted', render: v => v?<span className="text-green-600">{Utils.fmt(v)}</span>:'—'},
              {key:'repost_allowed', label:'Repost', render: v => v?'✓':'—'},
              {key:'payment_status', label:'Payment', render: v => <Badge className={Utils.statusColor(v)}>{v}</Badge>},
            ]}
            rows={filtered}
            onRowClick={row=>setModal(row)}
          />
        </Card>
      )}

      <Modal open={!!modal} onClose={()=>setModal(null)} title={modal?.id?'Edit Video':'Add Video'} size="lg">
        {modal!==null && <VideoForm video={modal?.id?modal:null} data={data} setData={setData} onSave={saveVideo} onClose={()=>setModal(null)} />}
      </Modal>
    </div>
  );
}
