window.Utils = {
  uid() {
    return Date.now().toString(36) + Math.random().toString(36).slice(2);
  },
  fmt(dateStr) {
    if (!dateStr) return '—';
    const d = new Date(dateStr);
    if (isNaN(d)) return dateStr;
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  },
  fmtNum(n) {
    if (!n && n !== 0) return '—';
    if (n >= 1000000) return (n / 1000000).toFixed(1) + 'M';
    if (n >= 1000) return (n / 1000).toFixed(0) + 'K';
    return n.toString();
  },
  now() {
    return new Date().toISOString();
  },
  today() {
    return new Date().toISOString().slice(0, 10);
  },
  isOverdue(dateStr) {
    if (!dateStr) return false;
    return new Date(dateStr) < new Date(new Date().toISOString().slice(0, 10));
  },
  isDueSoon(dateStr, days = 7) {
    if (!dateStr) return false;
    const d = new Date(dateStr);
    const now = new Date();
    const diff = (d - now) / (1000 * 60 * 60 * 24);
    return diff >= 0 && diff <= days;
  },
  statusColor(status) {
    const map = {
      'Not contacted': 'bg-gray-100 text-gray-600',
      'Contacted': 'bg-blue-100 text-blue-700',
      'Responded': 'bg-cyan-100 text-cyan-700',
      'Interested': 'bg-teal-100 text-teal-700',
      'Negotiating': 'bg-yellow-100 text-yellow-700',
      'Approved internally': 'bg-indigo-100 text-indigo-700',
      'Contract sent': 'bg-purple-100 text-purple-700',
      'Contract signed': 'bg-violet-100 text-violet-700',
      'Content in progress': 'bg-orange-100 text-orange-700',
      'Content submitted': 'bg-amber-100 text-amber-700',
      'In review': 'bg-pink-100 text-pink-700',
      'Approved': 'bg-emerald-100 text-emerald-700',
      'Scheduled': 'bg-sky-100 text-sky-700',
      'Posted': 'bg-green-100 text-green-700',
      'Paid': 'bg-green-200 text-green-800',
      'Archived': 'bg-gray-200 text-gray-500',
      'Draft': 'bg-gray-100 text-gray-600',
      'Cancelled': 'bg-red-100 text-red-600',
      'Signed': 'bg-violet-100 text-violet-700',
      'Awaiting Draft': 'bg-yellow-100 text-yellow-700',
      'Draft Submitted': 'bg-orange-100 text-orange-700',
      'Revision Needed': 'bg-red-100 text-red-700',
      'Overdue': 'bg-red-200 text-red-800',
      'Not started': 'bg-gray-100 text-gray-500',
      'Ready to pay': 'bg-green-100 text-green-700',
      'On hold': 'bg-yellow-100 text-yellow-600',
      'Sent': 'bg-blue-100 text-blue-700',
      'Needed': 'bg-orange-100 text-orange-700',
      'Not needed': 'bg-gray-100 text-gray-500',
      'Repostable': 'bg-emerald-100 text-emerald-700',
      'Reposted': 'bg-green-200 text-green-800',
      'Active': 'bg-green-100 text-green-700',
      'Completed': 'bg-gray-200 text-gray-600',
      'Pending approval': 'bg-yellow-100 text-yellow-700',
      'Payment info needed': 'bg-orange-100 text-orange-700',
      'Invoice needed': 'bg-red-100 text-red-600',
    };
    return map[status] || 'bg-gray-100 text-gray-600';
  },
  productColor(product) {
    if (product === 'Viggle') return 'bg-blue-100 text-blue-700';
    if (product === 'PINOC') return 'bg-purple-100 text-purple-700';
    return 'bg-indigo-100 text-indigo-700';
  },
  parseThumbnail(url) {
    if (!url) return null;
    const yt = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([A-Za-z0-9_-]{11})/);
    if (yt) return 'https://img.youtube.com/vi/' + yt[1] + '/mqdefault.jpg';
    return null;
  },
  platformBg(platform) {
    const m = { TikTok:'bg-gray-900', Instagram:'bg-pink-600', YouTube:'bg-red-600', 'X / Twitter':'bg-sky-500' };
    return m[platform] || 'bg-gray-500';
  },
  platformLabel(platform) {
    const m = { TikTok:'TT', Instagram:'IG', YouTube:'YT', 'X / Twitter':'X' };
    return m[platform] || '🎬';
  },
};
