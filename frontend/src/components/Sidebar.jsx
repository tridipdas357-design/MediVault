import { useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { Calendar, FolderOpen, LayoutDashboard, LogOut, Pill, ShieldPlus, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const links = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/records', label: 'Records', icon: FolderOpen },
  { to: '/medications', label: 'Medications', icon: Pill },
  { to: '/appointments', label: 'Appointments', icon: Calendar },
  { to: '/profile', label: 'Profile', icon: User },
];

export default function Sidebar() {
  const { user, logout } = useAuth();

  useEffect(() => {
    document.title = 'MediVault';
  }, []);

  return (
    <>
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 flex-col border-r border-slate-800 bg-slate-950 md:flex">
        <div className="flex items-center gap-2 px-6 py-6">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-cyan-400/15 text-cyan-400">
            <ShieldPlus size={20} />
          </span>
          <div>
            <p className="font-semibold tracking-tight">MediVault</p>
            <p className="text-xs text-slate-500">Personal records</p>
          </div>
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
                    ? 'bg-slate-900 text-cyan-400'
                    : 'text-slate-400 hover:bg-slate-900 hover:text-slate-100'
                }`
              }
            >
              <Icon size={18} />
              {label}
            </NavLink>
          ))}
        </nav>
        <div className="border-t border-slate-800 p-4">
          <p className="truncate px-2 text-sm text-slate-200">{user?.name}</p>
          <p className="truncate px-2 text-xs text-slate-500">{user?.email}</p>
          <button type="button" onClick={logout} className="btn-ghost mt-3 w-full">
            <LogOut size={16} />
            Sign out
          </button>
        </div>
      </aside>

      <nav className="fixed inset-x-0 bottom-0 z-30 flex border-t border-slate-800 bg-slate-950/95 backdrop-blur md:hidden">
        {links.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) =>
              `flex flex-1 flex-col items-center gap-1 py-2 text-[11px] ${
                isActive ? 'text-cyan-400' : 'text-slate-500'
              }`
            }
          >
            <Icon size={18} />
            {label}
          </NavLink>
        ))}
      </nav>
    </>
  );
}
