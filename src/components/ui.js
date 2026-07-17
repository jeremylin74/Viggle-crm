// Shared UI components
const { useState, useRef, useEffect } = React;

// Badge
window.Badge = function({ children, className = '' }) {
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${className}`}>
      {children}
    </span>
  );
};

// Button
window.Btn = function({ children, onClick, variant = 'primary', size = 'md', disabled = false, className = '', type = 'button' }) {
  const base = 'inline-flex items-center gap-1.5 font-medium rounded-lg transition-all focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed';
  const sizes = { sm: 'px-2.5 py-1.5 text-xs', md: 'px-3.5 py-2 text-sm', lg: 'px-5 py-2.5 text-base' };
  const variants = {
    primary: 'bg-lime-500 text-white hover:bg-lime-600 shadow-sm',
    secondary: 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50 shadow-sm',
    danger: 'bg-red-600 text-white hover:bg-red-700 shadow-sm',
    ghost: 'text-gray-600 hover:bg-gray-100',
    success: 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-sm',
  };
  return (
    <button type={type} onClick={onClick} disabled={disabled} className={`${base} ${sizes[size]} ${variants[variant]} ${className}`}>
      {children}
    </button>
  );
};

// Input
window.Input = function({ label, value, onChange, placeholder = '', type = 'text', className = '', required = false, disabled = false }) {
  return (
    <div className={className}>
      {label && <label className="block text-xs font-medium text-gray-600 mb-1">{label}{required && <span className="text-red-500 ml-0.5">*</span>}</label>}
      <input
        type={type}
        value={value || ''}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white focus:border-lime-400 focus:ring-2 focus:ring-lime-100 transition-all disabled:bg-gray-50"
      />
    </div>
  );
};

// Select
window.Select = function({ label, value, onChange, options = [], className = '', required = false, disabled = false }) {
  return (
    <div className={className}>
      {label && <label className="block text-xs font-medium text-gray-600 mb-1">{label}{required && <span className="text-red-500 ml-0.5">*</span>}</label>}
      <select
        value={value || ''}
        onChange={e => onChange(e.target.value)}
        disabled={disabled}
        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white focus:border-lime-400 focus:ring-2 focus:ring-lime-100 transition-all disabled:bg-gray-50"
      >
        <option value="">Select...</option>
        {options.map(o => (
          <option key={typeof o === 'string' ? o : o.value} value={typeof o === 'string' ? o : o.value}>
            {typeof o === 'string' ? o : o.label}
          </option>
        ))}
      </select>
    </div>
  );
};

// Textarea
window.Textarea = function({ label, value, onChange, placeholder = '', rows = 3, className = '' }) {
  return (
    <div className={className}>
      {label && <label className="block text-xs font-medium text-gray-600 mb-1">{label}</label>}
      <textarea
        value={value || ''}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white focus:border-lime-400 focus:ring-2 focus:ring-lime-100 transition-all resize-none"
      />
    </div>
  );
};

// Modal
window.Modal = function({ open, onClose, title, children, size = 'md' }) {
  if (!open) return null;
  const sizes = { sm: 'max-w-md', md: 'max-w-xl', lg: 'max-w-2xl', xl: 'max-w-4xl', '2xl': 'max-w-6xl' };
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
      <div
        className={`relative bg-white rounded-2xl shadow-2xl w-full ${sizes[size]} max-h-[90vh] overflow-y-auto fade-in`}
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-5 border-b border-gray-100 sticky top-0 bg-white rounded-t-2xl z-10">
          <h2 className="text-base font-semibold text-gray-900">{title}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 p-1 rounded-lg hover:bg-gray-100 transition-all">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>
        <div className="p-5">{children}</div>
      </div>
    </div>
  );
};

// Card
window.Card = function({ children, className = '', onClick }) {
  return (
    <div
      className={`bg-white rounded-xl border border-gray-100 shadow-sm ${onClick ? 'cursor-pointer hover:border-blue-200 hover:shadow-md transition-all' : ''} ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
};

// Stat card
window.StatCard = function({ label, value, sub, color = 'blue', icon, onClick }) {
  const colors = {
    blue: 'bg-blue-50 text-blue-600',
    green: 'bg-emerald-50 text-emerald-600',
    yellow: 'bg-yellow-50 text-yellow-600',
    red: 'bg-red-50 text-red-600',
    purple: 'bg-purple-50 text-purple-600',
    gray: 'bg-gray-50 text-gray-500',
  };
  return (
    <Card onClick={onClick} className="p-4">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">{label}</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
          {sub && <p className="text-xs text-gray-400 mt-0.5">{sub}</p>}
        </div>
        {icon && <div className={`p-2 rounded-lg ${colors[color]}`}>{icon}</div>}
      </div>
    </Card>
  );
};

// Table
window.Table = function({ columns, rows, onRowClick, emptyMessage = 'No records found' }) {
  if (!rows || rows.length === 0) {
    return (
      <div className="text-center py-12 text-gray-400">
        <p className="text-sm">{emptyMessage}</p>
      </div>
    );
  }
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-100">
            {columns.map(col => (
              <th key={col.key} className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap">
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {rows.map((row, i) => (
            <tr
              key={row.id || i}
              onClick={() => onRowClick && onRowClick(row)}
              className={`${onRowClick ? 'cursor-pointer hover:bg-lime-50/60' : ''} transition-colors`}
            >
              {columns.map(col => (
                <td key={col.key} className="py-3 px-4 text-gray-700 whitespace-nowrap">
                  {col.render ? col.render(row[col.key], row) : (row[col.key] || '—')}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

// Search input
window.SearchInput = function({ value, onChange, placeholder = 'Search...' }) {
  return (
    <div className="relative">
      <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
      <input
        type="text"
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className="pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm bg-white focus:border-lime-400 focus:ring-2 focus:ring-lime-100 transition-all w-64"
      />
    </div>
  );
};

// Tabs
window.Tabs = function({ tabs, active, onChange }) {
  return (
    <div className="flex gap-1 bg-gray-100 rounded-lg p-1">
      {tabs.map(t => (
        <button
          key={t.key}
          onClick={() => onChange(t.key)}
          className={`px-3 py-1.5 text-sm font-medium rounded-md transition-all ${active === t.key ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
        >
          {t.label}
        </button>
      ))}
    </div>
  );
};

// Toggle
window.Toggle = function({ value, onChange, label }) {
  return (
    <label className="flex items-center gap-2 cursor-pointer">
      <div
        onClick={() => onChange(!value)}
        className={`relative w-9 h-5 rounded-full transition-colors ${value ? 'bg-lime-500' : 'bg-gray-200'}`}
      >
        <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${value ? 'translate-x-4' : 'translate-x-0.5'}`} />
      </div>
      {label && <span className="text-sm text-gray-700">{label}</span>}
    </label>
  );
};

// Product Fit select with inline add
window.ProductFitSelect = function({ value, onChange, data, setData, label = 'Product Fit', required = false, className = '' }) {
  const [adding, setAdding] = useState(false);
  const [newName, setNewName] = useState('');
  const labels = (data.product_labels && data.product_labels.length > 0) ? data.product_labels : ['Viggle','PINOC','Both'];

  function createLabel() {
    const lbl = newName.trim();
    if (!lbl) return;
    if (!labels.includes(lbl)) {
      setData(d => ({ ...d, product_labels: [...(d.product_labels || ['Viggle','PINOC','Both']), lbl] }));
    }
    onChange(lbl);
    setNewName('');
    setAdding(false);
  }

  return (
    <div className={className}>
      {label && <label className="block text-xs font-medium text-gray-600 mb-1">{label}{required && <span className="text-red-500 ml-0.5">*</span>}</label>}
      {adding ? (
        <div className="flex gap-1">
          <input
            autoFocus
            value={newName}
            onChange={e => setNewName(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); createLabel(); } if (e.key === 'Escape') { setAdding(false); setNewName(''); } }}
            placeholder="Label name..."
            className="flex-1 border border-lime-400 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-lime-100"
          />
          <button type="button" onClick={createLabel} className="px-3 py-2 bg-lime-500 text-white text-sm rounded-lg hover:bg-lime-600 font-medium">Add</button>
          <button type="button" onClick={() => { setAdding(false); setNewName(''); }} className="px-3 py-2 text-gray-500 text-sm rounded-lg hover:bg-gray-100">✕</button>
        </div>
      ) : (
        <div className="flex gap-1">
          <select
            value={value || ''}
            onChange={e => onChange(e.target.value)}
            className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white focus:border-lime-400 focus:ring-2 focus:ring-lime-100 transition-all"
          >
            <option value="">Select...</option>
            {labels.map(l => <option key={l} value={l}>{l}</option>)}
          </select>
          <button type="button" onClick={() => setAdding(true)} title="Add new label"
            className="px-2.5 py-2 border border-gray-200 rounded-lg text-gray-500 hover:bg-lime-50 hover:border-lime-400 hover:text-lime-600 text-sm font-bold transition-all">+</button>
        </div>
      )}
    </div>
  );
};

// Campaign select with inline add
window.CampaignSelect = function({ value, onChange, data, setData, label = 'Campaign', required = false, className = '' }) {
  const [adding, setAdding] = useState(false);
  const [newName, setNewName] = useState('');

  function createCampaign() {
    const name = newName.trim();
    if (!name) return;
    const id = Utils.uid();
    const now = Utils.now();
    setData(d => ({
      ...d,
      campaigns: [...d.campaigns, {
        id, campaign_name: name, product: '', campaign_type: 'Paid partnership',
        start_date: '', end_date: '', campaign_status: 'Active',
        landing_page_url: '', cta_link: '', utm_link: '', notes: '',
        created_at: now, updated_at: now,
      }],
    }));
    onChange(id);
    setNewName('');
    setAdding(false);
  }

  return (
    <div className={className}>
      {label && <label className="block text-xs font-medium text-gray-600 mb-1">{label}{required && <span className="text-red-500 ml-0.5">*</span>}</label>}
      {adding ? (
        <div className="flex gap-1">
          <input
            autoFocus
            value={newName}
            onChange={e => setNewName(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); createCampaign(); } if (e.key === 'Escape') { setAdding(false); setNewName(''); } }}
            placeholder="Campaign name..."
            className="flex-1 border border-lime-400 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-lime-100"
          />
          <button type="button" onClick={createCampaign} className="px-3 py-2 bg-lime-500 text-white text-sm rounded-lg hover:bg-lime-600 font-medium">Create</button>
          <button type="button" onClick={() => { setAdding(false); setNewName(''); }} className="px-3 py-2 text-gray-500 text-sm rounded-lg hover:bg-gray-100">✕</button>
        </div>
      ) : (
        <div className="flex gap-1">
          <select
            value={value || ''}
            onChange={e => onChange(e.target.value)}
            className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white focus:border-lime-400 focus:ring-2 focus:ring-lime-100 transition-all"
          >
            <option value="">Select...</option>
            {(data.campaigns || []).map(c => (
              <option key={c.id} value={c.id}>{c.campaign_name}</option>
            ))}
          </select>
          <button type="button" onClick={() => setAdding(true)} title="Add new campaign"
            className="px-2.5 py-2 border border-gray-200 rounded-lg text-gray-500 hover:bg-lime-50 hover:border-lime-400 hover:text-lime-600 text-sm font-bold transition-all">+</button>
        </div>
      )}
    </div>
  );
};

// Thumbnail — extracts YouTube thumb from URL, tries TikTok oEmbed, falls back to platform icon
window.Thumb = function({ url, platform, size }) {
  const s = size || 'sm';
  const [src, setSrc] = React.useState(() => Utils.parseThumbnail(url));
  React.useEffect(() => {
    const parsed = Utils.parseThumbnail(url);
    setSrc(parsed || null);
    if (parsed || !url) return;
    if (url.includes('tiktok.com') || url.includes('vm.tiktok')) {
      fetch('https://www.tiktok.com/oembed?url=' + encodeURIComponent(url))
        .then(r => r.json()).then(j => { if (j.thumbnail_url) setSrc(j.thumbnail_url); }).catch(() => {});
    }
  }, [url]);
  const sizes = { xs:'w-8 h-5', sm:'w-20 h-12', md:'w-28 h-16', lg:'w-40 h-24' };
  return src ? (
    <img src={src} alt="" className={sizes[s] + ' object-cover rounded-lg shrink-0'} onError={() => setSrc(null)} />
  ) : (
    <div className={sizes[s] + ' rounded-lg shrink-0 flex items-center justify-center text-white text-xs font-bold ' + Utils.platformBg(platform)}>
      {Utils.platformLabel(platform)}
    </div>
  );
};

// Empty state
window.EmptyState = function({ title, description, action }) {
  return (
    <div className="text-center py-16">
      <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
        </svg>
      </div>
      <p className="font-medium text-gray-900 mb-1">{title}</p>
      {description && <p className="text-sm text-gray-500 mb-4">{description}</p>}
      {action}
    </div>
  );
};
