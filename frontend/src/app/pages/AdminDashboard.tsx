import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { LayoutDashboard, MapPin, Star, Users, Settings, Plus, Edit, Trash2, Check, XIcon, LogOut, Crown, Home } from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { API_BASE } from '../config/api';

type AdminView = 'overview' | 'places' | 'reviews' | 'users' | 'admins' | 'settings';

export const AdminDashboard: React.FC = () => {
  const { user, logout, language } = useApp();
  const navigate = useNavigate();
  const [currentView, setCurrentView] = useState<AdminView>('overview');
  const [reviewFilter, setReviewFilter] = useState<'pending' | 'approved' | 'rejected'>('pending');
  
  const [places, setPlaces] = useState<any[]>([]);
  const [allReviews, setAllReviews] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [admins, setAdmins] = useState<any[]>([]);
  const [stats, setStats] = useState({ totalPlaces: 0, pendingReviews: 0, totalUsers: 0, totalPhotos: 0 });
  const [loading, setLoading] = useState(true);
  
  const [showAddPlace, setShowAddPlace] = useState(false);
  const [editingPlace, setEditingPlace] = useState<any>(null);
  const [showAddAdmin, setShowAddAdmin] = useState(false);
  
  const [placeForm, setPlaceForm] = useState({ name: '', nameEn: '', category: 'religious', icon: '🕌', latitude: '24.4672', longitude: '39.6111', openingHours: '24/7', description: '', isFeatured: false });
  const [adminForm, setAdminForm] = useState({ username: '', password: '' });

  const token = localStorage.getItem('token');

  const fetchAll = async () => {
    try {
      const [pRes, rRes, uRes, aRes, sRes] = await Promise.all([
        fetch(`${API_BASE}/attractions`),
        fetch(`${API_BASE}/reviews/all`, { headers: { 'Authorization': `Bearer ${token}` } }),
        fetch(`${API_BASE}/users`, { headers: { 'Authorization': `Bearer ${token}` } }),
        fetch(`${API_BASE}/admins`, { headers: { 'Authorization': `Bearer ${token}` } }),
        fetch(`${API_BASE}/attractions/stats`, { headers: { 'Authorization': `Bearer ${token}` } })
      ]);
      if (pRes.ok) setPlaces(await pRes.json());
      if (rRes.ok) setAllReviews(await rRes.json());
      if (uRes.ok) setUsers(await uRes.json());
      if (aRes.ok) setAdmins(await aRes.json());
      if (sRes.ok) { const d = await sRes.json(); setStats({ totalPlaces: d.totalAttractions || 0, pendingReviews: d.pendingReviews || 0, totalUsers: d.totalUsers || 0, totalPhotos: d.totalPhotos || 0 }); }
    } catch (err) {} finally { setLoading(false); }
  };

  useEffect(() => { if (user?.role === 'admin') fetchAll(); else navigate('/'); }, [user]);

  const handleSavePlace = async () => {
    const method = editingPlace ? 'PUT' : 'POST';
    const url = editingPlace ? `${API_BASE}/attractions/${editingPlace.id}` : `${API_BASE}/attractions`;
    const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` }, body: JSON.stringify(placeForm) });
    if (res.ok) { setShowAddPlace(false); setEditingPlace(null); setPlaceForm({ name: '', nameEn: '', category: 'religious', icon: '🕌', latitude: '24.4672', longitude: '39.6111', openingHours: '24/7', description: '', isFeatured: false }); fetchAll(); }
  };

  const handleDeletePlace = async (id: number) => { if (confirm('Delete?')) { await fetch(`${API_BASE}/attractions/${id}`, { method: 'DELETE', headers: { 'Authorization': `Bearer ${token}` } }); fetchAll(); } };
  const handleUpdateReview = async (id: number, status: string) => { await fetch(`${API_BASE}/reviews/${id}/status`, { method: 'PATCH', headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` }, body: JSON.stringify(status) }); fetchAll(); };
  const handleDeleteUser = async (id: number) => { if (confirm('Delete?')) { await fetch(`${API_BASE}/users/${id}`, { method: 'DELETE', headers: { 'Authorization': `Bearer ${token}` } }); fetchAll(); } };
  const handleSaveAdmin = async () => { await fetch(`${API_BASE}/admins`, { method: 'POST', headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` }, body: JSON.stringify(adminForm) }); setShowAddAdmin(false); setAdminForm({ username: '', password: '' }); fetchAll(); };
  const handleDeleteAdmin = async (id: number) => { if (confirm('Delete?')) { await fetch(`${API_BASE}/admins/${id}`, { method: 'DELETE', headers: { 'Authorization': `Bearer ${token}` } }); fetchAll(); } };

  const filteredReviews = allReviews.filter(r => r.status === reviewFilter);
  const pendingCount = allReviews.filter(r => r.status === 'pending').length;
  const approvedCount = allReviews.filter(r => r.status === 'approved').length;
  const rejectedCount = allReviews.filter(r => r.status === 'rejected').length;

  const menuItems = [
    { id: 'overview' as AdminView, icon: LayoutDashboard, label: 'Overview' },
    { id: 'places' as AdminView, icon: MapPin, label: 'Places' },
    { id: 'reviews' as AdminView, icon: Star, label: 'Reviews' },
    { id: 'users' as AdminView, icon: Users, label: 'Users' },
    { id: 'admins' as AdminView, icon: Crown, label: 'Admins' },
    { id: 'settings' as AdminView, icon: Settings, label: 'Settings' },
  ];

  const handleLogout = () => { logout(); navigate('/auth'); };

  if (loading) return <div className="h-screen flex items-center justify-center"><div className="text-4xl">⏳</div></div>;

  return (
    <div className="min-h-screen bg-[var(--discover-bg)] flex" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      <aside className="w-64 bg-white dark:bg-[var(--discover-surface)] border-r border-[var(--discover-border)] flex flex-col">
        <div className="p-6 border-b border-[var(--discover-border)] flex items-center gap-3"><div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[var(--discover-primary)] to-[var(--discover-secondary)] flex items-center justify-center text-white">🗺️</div><span className="font-bold">Discover</span></div>
        <nav className="flex-1 p-4 space-y-2">
          <button onClick={() => navigate('/')} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-[var(--discover-text-secondary)] hover:bg-[var(--discover-card)] mb-4"><Home className="w-5 h-5" /><span>Back to Map</span></button>
          {menuItems.map((item) => <button key={item.id} onClick={() => setCurrentView(item.id)} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl ${currentView === item.id ? 'bg-[var(--discover-primary)] text-white' : 'text-[var(--discover-text-secondary)] hover:bg-[var(--discover-card)]'}`}><item.icon className="w-5 h-5" /><span>{item.label}</span></button>)}
        </nav>
        <div className="p-4 border-t"><button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-[var(--discover-danger)] hover:bg-red-50"><LogOut className="w-5 h-5" />Logout</button></div>
      </aside>

      <main className="flex-1 overflow-auto p-6 md:p-8">
        <div className="mb-8 flex items-center justify-between">
          <div><h1 className="text-3xl font-bold text-[var(--discover-text-primary)]">{menuItems.find(i => i.id === currentView)?.label}</h1><p className="text-[var(--discover-text-secondary)]">Welcome back, {user?.username}!</p></div>
          <button onClick={() => navigate('/')} className="flex items-center gap-2 px-4 py-2 bg-[var(--discover-primary)] text-white rounded-xl"><Home className="w-4 h-4" /> Map</button>
        </div>

        {currentView === 'overview' && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white dark:bg-[var(--discover-surface)] rounded-2xl p-6"><div className="text-4xl font-bold">{places.length}</div><div>Total Places</div></div>
            <div className="bg-white dark:bg-[var(--discover-surface)] rounded-2xl p-6"><div className="text-4xl font-bold text-[var(--discover-accent)]">{pendingCount}</div><div>Pending Reviews</div></div>
            <div className="bg-white dark:bg-[var(--discover-surface)] rounded-2xl p-6"><div className="text-4xl font-bold">{users.length}</div><div>Total Users</div></div>
            <div className="bg-white dark:bg-[var(--discover-surface)] rounded-2xl p-6"><div className="text-4xl font-bold">{admins.length}</div><div>Total Admins</div></div>
          </div>
        )}

        {currentView === 'places' && (
          <div className="space-y-6">
            <button onClick={() => { setEditingPlace(null); setPlaceForm({ name: '', nameEn: '', category: 'religious', icon: '🕌', latitude: '24.4672', longitude: '39.6111', openingHours: '24/7', description: '', isFeatured: false }); setShowAddPlace(true); }} className="flex items-center gap-2 px-4 py-2 bg-[var(--discover-primary)] text-white rounded-xl"><Plus className="w-4 h-4" /> Add Place</button>
            <div className="bg-white dark:bg-[var(--discover-surface)] rounded-2xl overflow-hidden">
              <table className="w-full"><thead className="bg-[var(--discover-card)]"><tr><th className="px-6 py-4 text-left">Name</th><th className="px-6 py-4 text-left">Category</th><th className="px-6 py-4 text-left">Rating</th><th className="px-6 py-4 text-left">Actions</th></tr></thead>
                <tbody>{places.map((p) => <tr key={p.id} className="border-t"><td className="px-6 py-4">{p.name}</td><td className="px-6 py-4">{p.category}</td><td className="px-6 py-4">★ {p.ratingAvg?.toFixed(1) || '—'}</td><td className="px-6 py-4"><div className="flex gap-2"><button onClick={() => { setEditingPlace(p); setPlaceForm({ name: p.name, nameEn: p.nameEn, category: p.category, icon: p.icon, latitude: p.latitude, longitude: p.longitude, openingHours: p.openingHours, description: p.description, isFeatured: p.isFeatured }); setShowAddPlace(true); }} className="p-2 hover:bg-blue-50 rounded"><Edit className="w-4 h-4 text-blue-500" /></button><button onClick={() => handleDeletePlace(p.id)} className="p-2 hover:bg-red-50 rounded"><Trash2 className="w-4 h-4 text-red-500" /></button></div></td></tr>)}</tbody>
              </table>
            </div>
          </div>
        )}

        {currentView === 'reviews' && (
          <div className="space-y-6">
            <div className="flex gap-2">
              <button onClick={() => setReviewFilter('pending')} className={`px-4 py-2 rounded-xl ${reviewFilter === 'pending' ? 'bg-[var(--discover-primary)] text-white' : 'bg-[var(--discover-card)]'}`}>Pending ({pendingCount})</button>
              <button onClick={() => setReviewFilter('approved')} className={`px-4 py-2 rounded-xl ${reviewFilter === 'approved' ? 'bg-[var(--discover-primary)] text-white' : 'bg-[var(--discover-card)]'}`}>Approved ({approvedCount})</button>
              <button onClick={() => setReviewFilter('rejected')} className={`px-4 py-2 rounded-xl ${reviewFilter === 'rejected' ? 'bg-[var(--discover-primary)] text-white' : 'bg-[var(--discover-card)]'}`}>Rejected ({rejectedCount})</button>
            </div>
            <div className="space-y-4">{filteredReviews.map(r => <div key={r.id} className="bg-white dark:bg-[var(--discover-surface)] rounded-2xl p-6"><div className="font-semibold">{r.attractionName}</div><div>👤 {r.username} - {'★'.repeat(r.rating)}</div><p className="my-2">"{r.comment}"</p>{reviewFilter === 'pending' && <div className="flex gap-2"><button onClick={() => handleUpdateReview(r.id, 'approved')} className="px-4 py-2 bg-green-500 text-white rounded-xl flex items-center gap-1"><Check className="w-4 h-4" /> Approve</button><button onClick={() => handleUpdateReview(r.id, 'rejected')} className="px-4 py-2 bg-red-500 text-white rounded-xl flex items-center gap-1"><XIcon className="w-4 h-4" /> Reject</button></div>}</div>)}</div>
          </div>
        )}

        {currentView === 'users' && (
          <div className="bg-white dark:bg-[var(--discover-surface)] rounded-2xl overflow-hidden">
            <table className="w-full"><thead className="bg-[var(--discover-card)]"><tr><th className="px-6 py-4">Username</th><th className="px-6 py-4">Email</th><th className="px-6 py-4">Joined</th><th className="px-6 py-4">Actions</th></tr></thead>
              <tbody>{users.map(u => <tr key={u.id} className="border-t"><td className="px-6 py-4">{u.username}</td><td className="px-6 py-4">{u.email}</td><td className="px-6 py-4">{u.createdAt}</td><td className="px-6 py-4"><button onClick={() => handleDeleteUser(u.id)} className="p-2 hover:bg-red-50 rounded"><Trash2 className="w-4 h-4 text-red-500" /></button></td></tr>)}</tbody>
            </table>
          </div>
        )}

        {currentView === 'admins' && (
          <div className="space-y-6">
            <button onClick={() => setShowAddAdmin(true)} className="flex items-center gap-2 px-4 py-2 bg-[var(--discover-primary)] text-white rounded-xl"><Plus className="w-4 h-4" /> Add Admin</button>
            <div className="space-y-3">{admins.map(a => <div key={a.id} className="bg-white dark:bg-[var(--discover-surface)] rounded-2xl p-4 flex items-center justify-between"><div><span className="font-medium">{a.username}</span><span className="ml-2 text-sm text-[var(--discover-text-secondary)]">({a.role})</span></div>{a.username !== user?.username && <button onClick={() => handleDeleteAdmin(a.id)} className="text-red-500">Delete</button>}</div>)}</div>
          </div>
        )}

        {currentView === 'settings' && <div className="bg-white dark:bg-[var(--discover-surface)] rounded-2xl p-6 text-center">Settings coming soon...</div>}
      </main>

      {showAddPlace && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setShowAddPlace(false)}>
          <div className="bg-white dark:bg-[var(--discover-surface)] rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <h2 className="text-xl font-bold mb-4">{editingPlace ? 'Edit Place' : 'Add Place'}</h2>
            <div className="grid grid-cols-2 gap-4">
              <input placeholder="Name (AR)" value={placeForm.name} onChange={e => setPlaceForm({...placeForm, name: e.target.value})} className="p-2 border rounded" />
              <input placeholder="Name (EN)" value={placeForm.nameEn} onChange={e => setPlaceForm({...placeForm, nameEn: e.target.value})} className="p-2 border rounded" />
              <select value={placeForm.category} onChange={e => setPlaceForm({...placeForm, category: e.target.value})} className="p-2 border rounded"><option value="religious">Religious</option><option value="cultural">Cultural</option><option value="entertainment">Entertainment</option><option value="dining">Dining</option></select>
              <input placeholder="Icon" value={placeForm.icon} onChange={e => setPlaceForm({...placeForm, icon: e.target.value})} className="p-2 border rounded" />
              <input placeholder="Latitude" value={placeForm.latitude} onChange={e => setPlaceForm({...placeForm, latitude: e.target.value})} className="p-2 border rounded" />
              <input placeholder="Longitude" value={placeForm.longitude} onChange={e => setPlaceForm({...placeForm, longitude: e.target.value})} className="p-2 border rounded" />
              <input placeholder="Hours" value={placeForm.openingHours} onChange={e => setPlaceForm({...placeForm, openingHours: e.target.value})} className="p-2 border rounded col-span-2" />
              <textarea placeholder="Description" value={placeForm.description} onChange={e => setPlaceForm({...placeForm, description: e.target.value})} className="p-2 border rounded col-span-2" rows={3} />
              <label className="flex items-center gap-2"><input type="checkbox" checked={placeForm.isFeatured} onChange={e => setPlaceForm({...placeForm, isFeatured: e.target.checked})} /> Featured</label>
            </div>
            <div className="flex gap-2 mt-6"><button onClick={handleSavePlace} className="px-4 py-2 bg-[var(--discover-primary)] text-white rounded-xl">Save</button><button onClick={() => setShowAddPlace(false)} className="px-4 py-2 border rounded-xl">Cancel</button></div>
          </div>
        </div>
      )}

      {showAddAdmin && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setShowAddAdmin(false)}>
          <div className="bg-white dark:bg-[var(--discover-surface)] rounded-2xl p-6 w-full max-w-md" onClick={e => e.stopPropagation()}>
            <h2 className="text-xl font-bold mb-4">Add Admin</h2>
            <input placeholder="Username" value={adminForm.username} onChange={e => setAdminForm({...adminForm, username: e.target.value})} className="w-full p-2 border rounded mb-3" />
            <input placeholder="Password" type="password" value={adminForm.password} onChange={e => setAdminForm({...adminForm, password: e.target.value})} className="w-full p-2 border rounded mb-4" />
            <div className="flex gap-2"><button onClick={handleSaveAdmin} className="px-4 py-2 bg-[var(--discover-primary)] text-white rounded-xl">Create</button><button onClick={() => setShowAddAdmin(false)} className="px-4 py-2 border rounded-xl">Cancel</button></div>
          </div>
        </div>
      )}
    </div>
  );
};
