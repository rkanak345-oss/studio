'use client';

import { useState } from 'react';
import type { User, Withdrawal } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft } from 'lucide-react';

interface WithdrawFormProps {
  user: User;
  setView: (view: 'home') => void;
  refreshData: () => void;
}

function uid(len = 10) {
  return Math.random().toString(36).slice(2, 2 + len);
}

export default function WithdrawForm({ user, setView, refreshData }: WithdrawFormProps) {
  const [amount, setAmount] = useState('');
  const [method, setMethod] = useState<'upi' | 'bank'>('upi');
  const [account, setAccount] = useState('');
  const { toast } = useToast();

  const handleSubmit = () => {
    const withdrawAmount = Number(amount);
    if (withdrawAmount < 100) {
      toast({ title: 'Invalid Amount', description: 'Minimum withdrawal amount is ₹100.', variant: 'destructive' });
      return;
    }
    if (withdrawAmount > user.wallet) {
      toast({ title: 'Insufficient Balance', description: 'You do not have enough funds to withdraw this amount.', variant: 'destructive' });
      return;
    }
    if (!account.trim()) {
      toast({ title: 'Account Details Required', description: 'Please enter your UPI ID or bank details.', variant: 'destructive' });
      return;
    }

    const newWithdrawal: Withdrawal = {
      id: uid(),
      userId: user.id,
      amount: withdrawAmount,
      method,
      status: 'Pending',
      account,
      createdAt: new Date().toISOString(),
    };
    
    const withdrawals = JSON.parse(localStorage.getItem('withdrawals') || '[]');
    localStorage.setItem('withdrawals', JSON.stringify([...withdrawals, newWithdrawal]));

    const txs = JSON.parse(localStorage.getItem('txs') || '[]');
    const newTx = { title:'Withdrawal Requested', date: new Date().toISOString(), detail:`You requested a withdrawal of ₹${withdrawAmount} via ${method}.` };
    localStorage.setItem('txs', JSON.stringify([...txs, newTx]));
    
    toast({
      title: 'Request Submitted',
      description: 'Your withdrawal request has been sent for approval.',
    });
    
    refreshData();
    setView('home');
  };

  return (
    <Card className="max-w-2xl mx-auto shadow-xl">
      <CardHeader>
        <div className="flex items-center justify-between">
            <div>
                <CardTitle className="text-2xl">Request Withdrawal</CardTitle>
                <CardDescription>Your current balance is <strong>₹{user.wallet.toFixed(2)}</strong>.</CardDescription>
            </div>
            <Button variant="outline" onClick={() => setView('home')}>
                <ArrowLeft className="mr-2 h-4 w-4" /> Back
            </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="amount">Amount (min ₹100)</Label>
          <Input id="amount" type="number" value={amount} onChange={e => setAmount(e.target.value)} placeholder="100" />
        </div>
        <div>
          <Label htmlFor="method">Method</Label>
          <Select onValueChange={(value: 'upi' | 'bank') => setMethod(value)} defaultValue={method}>
            <SelectTrigger id="method">
              <SelectValue placeholder="Select withdrawal method" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="upi">UPI</SelectItem>
              <SelectItem value="bank">Bank Transfer</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="account">{method === 'upi' ? 'UPI ID' : 'Bank Account Details'}</Label>
          <Input id="account" value={account} onChange={e => setAccount(e.target.value)} placeholder={method === 'upi' ? 'your-upi@id' : 'Account number, IFSC, Name'} />
        </div>
        <Button onClick={handleSubmit} className="w-full">Submit Request</Button>
      </CardContent>
    </Card>
  );
}
