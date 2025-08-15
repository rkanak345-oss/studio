'use client';

import type { User, Tx } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

interface HistoryListProps {
  user: User;
  txs: Tx[];
  setView: (view: 'home') => void;
}

export default function HistoryList({ user, txs, setView }: HistoryListProps) {
  const userTxs = txs.filter(t => t.detail.includes(user.name) || t.title.includes('Withdrawal'));

  return (
    <Card className="max-w-4xl mx-auto shadow-xl">
      <CardHeader>
        <div className="flex items-center justify-between">
            <div>
                <CardTitle className="text-2xl">Transaction History</CardTitle>
                <CardDescription>A record of your earnings and withdrawals.</CardDescription>
            </div>
            <Button variant="outline" onClick={() => setView('home')}>
                <ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard
            </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {userTxs.length > 0 ? (
          userTxs.slice().reverse().map((tx, index) => (
            <div key={index} className="p-4 border rounded-lg bg-slate-50">
              <div className="flex justify-between items-center">
                <p className="font-semibold">{tx.title}</p>
                <p className="text-xs text-muted-foreground">{new Date(tx.date).toLocaleString()}</p>
              </div>
              <p className="text-sm text-muted-foreground mt-1">{tx.detail}</p>
            </div>
          ))
        ) : (
          <div className="text-center text-muted-foreground py-10">
            You have no transactions yet.
          </div>
        )}
      </CardContent>
    </Card>
  );
}
