'use client';

import { useState } from 'react';
import type { User, Tx } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Rocket, Gift, Banknote } from 'lucide-react';

interface AuthModalProps {
  onLoginSuccess: (user: User) => void;
  users: User[];
  setUsers: React.Dispatch<React.SetStateAction<User[]>>;
  setTxs: React.Dispatch<React.SetStateAction<Tx[]>>;
  setAdminProfit: React.Dispatch<React.SetStateAction<number>>;
}

function uid(len = 8) {
  return Math.random().toString(36).slice(2, 2 + len);
}

export default function AuthModal({ onLoginSuccess, users, setUsers, setTxs, setAdminProfit }: AuthModalProps) {
  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
  const [refCode, setRefCode] = useState('');
  const [otp, setOtp] = useState('');
  const [showOtp, setShowOtp] = useState(false);
  const { toast } = useToast();

  const handleSendOtp = () => {
    if (!name || !/^[0-9]{10}$/.test(mobile)) {
      toast({
        title: 'Invalid Input',
        description: 'Please enter a valid name and 10-digit mobile number.',
        variant: 'destructive',
      });
      return;
    }
    setShowOtp(true);
    setOtp('1234'); // Simulate OTP
    toast({
      title: 'OTP Sent (Simulated)',
      description: 'Your simulated OTP is 1234.',
    });
  };

  const handleVerifyOtp = () => {
    if (otp !== '1234') {
      toast({ title: 'Invalid OTP', description: 'In this demo, the OTP is always 1234.', variant: 'destructive' });
      return;
    }

    let user = users.find((u) => u.mobile === mobile);
    const isNewUser = !user;

    if (isNewUser) {
      const newId = uid(10);
      const newRefCode = (name.replace(/\s+/g, '').toLowerCase().slice(0, 5) + uid(3)).replace(/[^a-z0-9]/g, '');
      user = {
        id: newId,
        name,
        mobile,
        isAdmin: false,
        wallet: 0,
        refCode: newRefCode,
        referredBy: refCode.trim() || null,
        createdAt: new Date().toISOString(),
      };
      const updatedUsers = [...users, user];

      if (user.referredBy) {
        const refUserIndex = updatedUsers.findIndex((u) => u.refCode === user!.referredBy);
        if (refUserIndex !== -1) {
          updatedUsers[refUserIndex].wallet += 100;
          
          const newTx: Tx = {
            title: 'Referral Bonus',
            date: new Date().toISOString(),
            detail: `${updatedUsers[refUserIndex].name} got ₹100 for referring ${name}`,
          };
          const txs = JSON.parse(localStorage.getItem('txs') || '[]');
          const updatedTxs = [...txs, newTx];
          localStorage.setItem('txs', JSON.stringify(updatedTxs));
          setTxs(updatedTxs);

          const newAdminProfit = Number(localStorage.getItem('adminProfit') || '0') + 150;
          localStorage.setItem('adminProfit', newAdminProfit.toString());
          setAdminProfit(newAdminProfit);

          toast({
            title: 'Referral Success!',
            description: `Your referrer earned ₹100!`,
          });
        }
      }
      localStorage.setItem('users', JSON.stringify(updatedUsers));
      setUsers(updatedUsers);
    }

    localStorage.setItem('currentUser', JSON.stringify(user));
    onLoginSuccess(user!);
    toast({
      title: 'Login Successful',
      description: `Welcome, ${user!.name}!`,
    });
  };

  return (
    <Card className="max-w-4xl mx-auto shadow-xl">
      <CardHeader>
        <CardTitle className="text-2xl">Register or Login</CardTitle>
        <CardDescription>Join RefRevenue to start earning today.</CardDescription>
      </CardHeader>
      <CardContent className="grid md:grid-cols-2 gap-8">
        <div className="space-y-4">
          {!showOtp ? (
            <>
              <div>
                <Label htmlFor="name">Full Name</Label>
                <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" />
              </div>
              <div>
                <Label htmlFor="mobile">Mobile Number</Label>
                <Input id="mobile" value={mobile} onChange={(e) => setMobile(e.target.value)} placeholder="10 digit mobile number" />
              </div>
              <div>
                <Label htmlFor="refCode">Referral Code (Optional)</Label>
                <Input id="refCode" value={refCode} onChange={(e) => setRefCode(e.target.value)} placeholder="Enter referral code" />
              </div>
              <Button onClick={handleSendOtp} className="w-full">Send OTP (Simulated)</Button>
            </>
          ) : (
            <>
              <div>
                <Label htmlFor="otp">Enter OTP</Label>
                <Input id="otp" value={otp} onChange={(e) => setOtp(e.target.value)} placeholder="1234" />
              </div>
              <Button onClick={handleVerifyOtp} className="w-full">Verify & Proceed</Button>
            </>
          )}
           <p className="text-xs text-center text-muted-foreground pt-4">Admin Access: Use Mobile <strong>0000000000</strong> on the Admin Panel button in the header.</p>
        </div>
        <div className="bg-slate-100 p-6 rounded-lg">
            <h4 className="font-semibold text-lg mb-4">Why Join Us?</h4>
            <ul className="space-y-4">
                <li className="flex items-start gap-3">
                    <div className="bg-accent/20 text-accent rounded-full p-2"><Gift className="h-5 w-5" /></div>
                    <div>
                        <span className="font-semibold">Refer & Earn</span>
                        <p className="text-sm text-muted-foreground">Earn ₹100 for every valid referral. More friends, more money!</p>
                    </div>
                </li>
                <li className="flex items-start gap-3">
                    <div className="bg-accent/20 text-accent rounded-full p-2"><Banknote className="h-5 w-5" /></div>
                    <div>
                        <span className="font-semibold">Easy Withdrawals</span>
                        <p className="text-sm text-muted-foreground">Withdraw your earnings via UPI or Bank Transfer after admin approval.</p>
                    </div>
                </li>
                 <li className="flex items-start gap-3">
                    <div className="bg-accent/20 text-accent rounded-full p-2"><Rocket className="h-5 w-5" /></div>
                    <div>
                        <span className="font-semibold">Prime+ Benefits</span>
                        <p className="text-sm text-muted-foreground">Upgrade to Prime+ for exclusive benefits and higher earning potential.</p>
                    </div>
                </li>
            </ul>
        </div>
      </CardContent>
    </Card>
  );
}
