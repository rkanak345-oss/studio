'use client';

import { useState, useEffect } from 'react';
import type { User, Withdrawal, Tx } from '@/lib/types';
import { Dna, DollarSign, Users, Wallet, ChevronRight, BarChart, FileText, Crown, Shield, Bot } from 'lucide-react';

import Header from '@/components/app/Header';
import AuthModal from '@/components/app/AuthModal';
import Dashboard from '@/components/app/Dashboard';
import AdminPanel from '@/components/app/AdminPanel';
import ReferralsList from '@/components/app/ReferralsList';
import HistoryList from '@/components/app/HistoryList';
import WithdrawForm from '@/components/app/WithdrawForm';
import PrimePage from '@/components/app/PrimePage';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import AIGeneratorPage from '@/components/app/AIGeneratorPage';

type View = 'home' | 'auth' | 'referrals' | 'history' | 'withdraw' | 'prime' | 'admin' | 'ai-playground';

export default function Home() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [withdrawals, setWithdrawals] = useState<Withdrawal[]>([]);
  const [txs, setTxs] = useState<Tx[]>([]);
  const [adminProfit, setAdminProfit] = useState(0);
  const [view, setView] = useState<View>('home');
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    // Initial data load from localStorage
    const loadJSON = <T,>(key: string, def: T): T => {
      try {
        return JSON.parse(localStorage.getItem(key) || 'null') || def;
      } catch (e) {
        return def;
      }
    };

    let loadedUsers = loadJSON<User[]>('users', []);
    if (loadedUsers.length === 0) {
      const admin: User = { id: 'admin', name: 'Admin', mobile: '0000000000', isAdmin: true, wallet: 0, refCode: 'admin123', referredBy: null, createdAt: new Date().toISOString() };
      loadedUsers = [admin];
      localStorage.setItem('users', JSON.stringify(loadedUsers));
      localStorage.setItem('withdrawals', '[]');
      localStorage.setItem('txs', '[]');
      localStorage.setItem('adminProfit', '0');
    }

    setUsers(loadedUsers);
    setWithdrawals(loadJSON<Withdrawal[]>('withdrawals', []));
    setTxs(loadJSON<Tx[]>('txs', []));
    setAdminProfit(Number(localStorage.getItem('adminProfit') || '0'));

    const storedUser = loadJSON<User | null>('currentUser', null);
    if (storedUser) {
      // resync user data
      const freshUser = loadedUsers.find(u => u.id === storedUser.id);
      setCurrentUser(freshUser || null);
    }
  }, []);

  const refreshData = () => {
    const loadJSON = <T,>(key: string, def: T): T => JSON.parse(localStorage.getItem(key) || 'null') || def;
    const loadedUsers = loadJSON<User[]>('users', []);
    setUsers(loadedUsers);
    setWithdrawals(loadJSON<Withdrawal[]>('withdrawals', []));
    setTxs(loadJSON<Tx[]>('txs', []));
    setAdminProfit(Number(localStorage.getItem('adminProfit') || '0'));
    if (currentUser) {
      const freshUser = loadedUsers.find(u => u.id === currentUser.id);
      setCurrentUser(freshUser || null);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    setCurrentUser(null);
    setView('home');
  };

  const renderView = () => {
    if (!isClient) {
      return (
        <div className="w-full text-center p-10">
          <Dna className="mx-auto h-12 w-12 animate-spin text-accent" />
        </div>
      );
    }

    if (view === 'auth') {
      return (
        <AuthModal
          onLoginSuccess={(user) => {
            setCurrentUser(user);
            setView(user.isAdmin ? 'admin' : 'home');
            refreshData();
          }}
          users={users}
          setUsers={setUsers}
          setTxs={setTxs}
          setAdminProfit={setAdminProfit}
        />
      );
    }

    if (!currentUser) {
      return (
        <>
          <Card className="text-center shadow-lg">
            <CardHeader>
              <Dna className="mx-auto h-12 w-12 text-accent" />
              <CardTitle className="text-2xl font-bold">Welcome to RefRevenue</CardTitle>
              <CardDescription>Invite friends and earn money. It's that simple.</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="mb-6">
                Join our platform to start earning rewards for every friend you refer.
                Withdraw your earnings easily through UPI or Bank Transfer.
              </p>
              <Button size="lg" onClick={() => setView('auth')}>
                Login or Register to Start
                <ChevronRight className="ml-2 h-5 w-5" />
              </Button>
            </CardContent>
          </Card>
          <Card className="mt-4">
            <CardHeader>
              <CardTitle>How It Works</CardTitle>
            </CardHeader>
            <CardContent className="grid md:grid-cols-3 gap-6 text-center">
              <div className="flex flex-col items-center">
                <Users className="h-10 w-10 mb-2 text-accent" />
                <h4 className="font-semibold">Invite Friends</h4>
                <p className="text-sm text-muted-foreground">Share your unique referral code.</p>
              </div>
              <div className="flex flex-col items-center">
                <DollarSign className="h-10 w-10 mb-2 text-accent" />
                <h4 className="font-semibold">Earn Cash</h4>
                <p className="text-sm text-muted-foreground">Get ₹100 for each valid referral.</p>
              </div>
              <div className="flex flex-col items-center">
                <Wallet className="h-10 w-10 mb-2 text-accent" />
                <h4 className="font-semibold">Withdraw</h4>
                <p className="text-sm text-muted-foreground">Cash out your earnings anytime.</p>
              </div>
            </CardContent>
          </Card>
        </>
      );
    }
    
    // Logged-in views
    switch (view) {
      case 'home':
        return <Dashboard user={currentUser} setView={setView} users={users} />;
      case 'admin':
        return <AdminPanel users={users} withdrawals={withdrawals} adminProfit={adminProfit} refreshData={refreshData} />;
      case 'referrals':
        return <ReferralsList user={currentUser} users={users} setView={setView} />;
      case 'history':
        return <HistoryList user={currentUser} txs={txs} setView={setView} />;
      case 'withdraw':
        return <WithdrawForm user={currentUser} setView={setView} refreshData={refreshData} />;
      case 'prime':
        return <PrimePage setView={setView} />;
      case 'ai-playground':
        return <AIGeneratorPage setView={setView} />;
      default:
        return <Dashboard user={currentUser} setView={setView} users={users} />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header
        user={currentUser}
        onLogin={() => setView('auth')}
        onLogout={handleLogout}
        onAdmin={() => {
          const adminUser = users.find(u => u.isAdmin);
          if (adminUser) {
            setCurrentUser(adminUser);
            setView('admin');
            refreshData();
          }
        }}
        goHome={() => setView('home')}
        setView={setView}
      />
      <main className="container max-w-7xl mx-auto px-4 py-8">
        {renderView()}
      </main>
      <footer className="text-center py-4 text-sm text-muted-foreground">
        Built for demo. Replace client-side storage with server APIs for production.
      </footer>
    </div>
  );
}
