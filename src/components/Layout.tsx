import { ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Icon from '@/components/ui/icon';
import { Button } from '@/components/ui/button';

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const location = useLocation();

  const navItems = [
    { path: '/card', label: 'Карта', icon: 'CreditCard' },
    { path: '/referral', label: 'Рефералы', icon: 'Users' },
    { path: '/withdraw', label: 'Вывод', icon: 'ArrowDownToLine' },
    { path: '/deposit', label: 'Пополнить', icon: 'ArrowUpFromLine' },
    { path: '/', label: 'Игра', icon: 'Rocket' },
    { path: '/about', label: 'О нас', icon: 'Info' },
    { path: '/support', label: 'Поддержка', icon: 'MessageCircle' },
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-full gradient-purple-pink-orange flex items-center justify-center">
                <Icon name="Rocket" className="text-white" size={24} />
              </div>
              <span className="text-2xl font-bold text-gradient">Rocket Queen</span>
            </Link>

            <nav className="hidden md:flex items-center gap-2">
              {navItems.map((item) => (
                <Link key={item.path} to={item.path}>
                  <Button
                    variant={location.pathname === item.path ? 'default' : 'ghost'}
                    size="sm"
                    className="gap-2"
                  >
                    <Icon name={item.icon} size={18} />
                    {item.label}
                  </Button>
                </Link>
              ))}
            </nav>

            <button className="md:hidden">
              <Icon name="Menu" size={28} />
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 py-6">
        {children}
      </main>

      <nav className="md:hidden border-t border-border bg-card/50 backdrop-blur-sm fixed bottom-0 left-0 right-0 z-50">
        <div className="grid grid-cols-4 gap-1 p-2">
          {navItems.slice(0, 4).map((item) => (
            <Link key={item.path} to={item.path}>
              <Button
                variant={location.pathname === item.path ? 'default' : 'ghost'}
                size="sm"
                className="w-full flex flex-col gap-1 h-auto py-2"
              >
                <Icon name={item.icon} size={20} />
                <span className="text-xs">{item.label}</span>
              </Button>
            </Link>
          ))}
        </div>
      </nav>
    </div>
  );
}
