'use client';

import type { User, Withdrawal } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Users, BarChart, Banknote } from 'lucide-react';

interface AdminPanelProps {
  users: User[];
  withdrawals: Withdrawal[];
  adminProfit: number;
  refreshData: () => void;
}

export default function AdminPanel({ users, withdrawals, adminProfit, refreshData }: AdminPanelProps) {
  const { toast } = useToast();

  const handleWithdrawalAction = (id: string, action: 'approve' | 'reject') => {
    const allWithdrawals: Withdrawal[] = JSON.parse(localStorage.getItem('withdrawals') || '[]');
    const allUsers: User[] = JSON.parse(localStorage.getItem('users') || '[]');
    const allTxs = JSON.parse(localStorage.getItem('txs') || '[]');

    const withdrawalIndex = allWithdrawals.findIndex(w => w.id === id);
    if (withdrawalIndex === -1) return;

    const withdrawal = allWithdrawals[withdrawalIndex];
    if (withdrawal.status !== 'Pending') {
      toast({ title: 'Action already taken.', variant: 'destructive' });
      return;
    }
    
    const userIndex = allUsers.findIndex(u => u.id === withdrawal.userId);
    if (userIndex === -1) return;

    if (action === 'approve') {
      allUsers[userIndex].wallet -= withdrawal.amount;
      allWithdrawals[withdrawalIndex].status = 'Approved';
       allTxs.push({ title:'Withdrawal Approved', date: new Date().toISOString(), detail:`Your withdrawal of ₹${withdrawal.amount} was approved.` })
      toast({ title: 'Withdrawal Approved' });
    } else {
      allWithdrawals[withdrawalIndex].status = 'Rejected';
      allTxs.push({ title:'Withdrawal Rejected', date: new Date().toISOString(), detail:`Your withdrawal of ₹${withdrawal.amount} was rejected.` })
      toast({ title: 'Withdrawal Rejected', variant: 'destructive' });
    }

    localStorage.setItem('users', JSON.stringify(allUsers));
    localStorage.setItem('withdrawals', JSON.stringify(allWithdrawals));
    localStorage.setItem('txs', JSON.stringify(allTxs));
    refreshData();
  };

  return (
    <div className="space-y-6">
      <CardHeader className="px-0">
        <CardTitle className="text-3xl">Admin Panel</CardTitle>
        <CardDescription>Manage users, withdrawals, and platform metrics.</CardDescription>
      </CardHeader>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{users.length}</div>
            <p className="text-xs text-muted-foreground">all registered users</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Admin Profit</CardTitle>
            <BarChart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{adminProfit.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">total tracked profit</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Withdrawals</CardTitle>
            <Banknote className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{withdrawals.filter(w => w.status === 'Pending').length}</div>
            <p className="text-xs text-muted-foreground">requests awaiting action</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Withdrawal Requests</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {withdrawals.map(w => {
                  const user = users.find(u => u.id === w.userId);
                  return (
                    <TableRow key={w.id}>
                      <TableCell>{user?.name || 'Unknown'}</TableCell>
                      <TableCell>₹{w.amount.toFixed(2)}</TableCell>
                      <TableCell>
                        <Badge variant={w.status === 'Pending' ? 'default' : w.status === 'Approved' ? 'secondary' : 'destructive'}>
                          {w.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {w.status === 'Pending' && (
                          <div className="flex gap-2">
                            <Button size="sm" onClick={() => handleWithdrawalAction(w.id, 'approve')}>Approve</Button>
                            <Button size="sm" variant="destructive" onClick={() => handleWithdrawalAction(w.id, 'reject')}>Reject</Button>
                          </div>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>All Users</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Mobile</TableHead>
                  <TableHead>Wallet</TableHead>
                  <TableHead>Ref Code</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map(u => (
                  <TableRow key={u.id}>
                    <TableCell>{u.name}{u.isAdmin && <Badge variant="outline" className="ml-2">Admin</Badge>}</TableCell>
                    <TableCell>{u.mobile}</TableCell>
                    <TableCell>₹{u.wallet.toFixed(2)}</TableCell>
                    <TableCell>{u.refCode}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
