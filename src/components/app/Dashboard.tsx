'use client';

import type { User } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import AIGenerator from './AIGenerator';
import { Wallet, Gift, Users, BarChart, Crown, Bot } from 'lucide-react';
import { useEffect, useState } from 'react';

type View = 'referrals' | 'history' | 'withdraw' | 'prime' | 'ai-playground';

interface DashboardProps {
  user: User;
  setView: (view: View) => void;
  users: User[];
}

export default function Dashboard({ user, setView, users }: DashboardProps) {
  const { toast } = useToast();
  const [shareLink, setShareLink] = useState('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      url.searchParams.set('ref', user.refCode);
      setShareLink(url.toString());
    }
  }, [user.refCode]);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      toast({
        title: 'Copied to clipboard!',
        description: 'Your referral link is ready to be shared.',
      });
    });
  };

  const referralsCount = users.filter(u => u.referredBy === user.refCode).length;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Left Column */}
      <div className="lg:col-span-2 space-y-6">
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle>How It Works</CardTitle>
            <CardDescription>
              Invite friends with your code. For each valid referral, you get <strong>₹100</strong> and <strong>₹150</strong> is tracked as admin profit.
            </CardDescription>
          </CardHeader>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="shadow-md">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">Your Wallet</CardTitle>
                    <Wallet className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">₹{user.wallet.toFixed(2)}</div>
                    <p className="text-xs text-muted-foreground">Withdrawable balance</p>
                    <div className="mt-4 flex gap-2">
                        <Button onClick={() => setView('withdraw')} className="flex-1">Withdraw</Button>
                        <Button onClick={() => setView('prime')} variant="outline" className="flex-1">
                            <Crown className="mr-2 h-4 w-4 text-amber-500"/>
                            Prime+
                        </Button>
                    </div>
                </CardContent>
            </Card>

            <Card className="shadow-md">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">Your Referrals</CardTitle>
                    <Gift className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{referralsCount}</div>
                    <p className="text-xs text-muted-foreground">friends joined with your code</p>
                    <div className="mt-4 text-sm">
                        <p className="font-medium">Your Code: <span className="font-bold text-accent">{user.refCode}</span></p>
                    </div>
                </CardContent>
            </Card>
        </div>

         <Card className="shadow-md">
            <CardHeader>
                <CardTitle>Share Your Referral Link</CardTitle>
                <CardDescription>Copy the link below and share it with your friends.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="flex gap-2">
                    <Input value={shareLink} readOnly />
                    <Button onClick={() => copyToClipboard(shareLink)}>Copy</Button>
                </div>
            </CardContent>
        </Card>
      </div>

      {/* Right Column */}
      <div className="space-y-6">
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col space-y-2">
            <Button variant="outline" onClick={() => setView('referrals')}>
              <Users className="mr-2 h-4 w-4" /> View Referrals
            </Button>
            <Button variant="outline" onClick={() => setView('history')}>
              <BarChart className="mr-2 h-4 w-4" /> Earning History
            </Button>
            <Button variant="outline" onClick={() => setView('ai-playground')}>
              <Bot className="mr-2 h-4 w-4" /> AI Playground
            </Button>
          </CardContent>
        </Card>

        <AIGenerator user={user} />
      </div>
    </div>
  );
}
