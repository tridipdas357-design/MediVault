import { useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { Calendar, FolderOpen, LayoutDashboard, LogOut, Pill, QrCode, ShieldPlus, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import ThemeToggle from './ThemeToggle';

const links = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/records', label: 'Records', icon: FolderOpen },
  { to: '/medications', label: 'Medications', icon: Pill },
  { to: '/appointments', label: 'Appointments', icon: Calendar },
  { to: '/qr', label: 'Doctor QR', icon: QrCode },
  { to: '/profile', label: 'Profile', icon: User },
];

export default function Sidebar() {
  const { user, logout } = useAuth();

  useEffect(() => {
    document.title = 'MediVault';
  }, []);

  return (
    <>
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 flex-col border-r border-stone-200 bg-linen-50 md:flex">
        <div className="flex items-center justify-between gap-2 px-6 py-6">
          <div className="flex items-center gap-2">
            <span className="icon-soft h-9 w-9">
              <ShieldPlus size={20} />
            </span>
            <div>
              <p className="font-semibold tracking-tight">MediVault</p>
              <p className="text-xs text-stone-500">Personal records</p>
            </div>
          </div>
          <ThemeToggle className="p-2" />
        </div>
        <nav className="flex-1 space-y-1 px-3">
          {links.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
                  isActive
                    ? 'bg-sage-100 text-sage-700'
                    : 'text-stone-500 hover:bg-surface hover:text-stone-800'
                }`
              }
            >
              <Icon size={18} />
              {label}
            </NavLink>
          ))}
        </nav>
        <div className="border-t border-stone-200 p-4">
          <p className="truncate px-2 text-sm text-stone-800">{user?.name}</p>
          <p className="truncate px-2 text-xs text-stone-500">{user?.email}</p>
          <button type="button" onClick={logout} className="btn-ghost mt-3 w-full">
            <LogOut size={16} />
            Sign out
          </button>
        </div>
      </aside>

      <nav className="fixed inset-x-0 bottom-0 z-30 flex border-t border-stone-200 bg-linen-50/95 backdrop-blur md:hidden">
        {links.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) =>
              `flex flex-1 flex-col items-center gap-1 py-2 text-[10px] ${
                isActive ? 'text-sage-700' : 'text-stone-400'
              }`
            }
          >
            <Icon size={18} />
            {label}
          </NavLink>
        ))}
        <ThemeToggle className="flex-1 flex-col py-2 text-[10px]" showLabel />
      </nav>
    </>
  );
}
