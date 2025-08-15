'use client';

import type { User } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

interface ReferralsListProps {
  user: User;
  users: User[];
  setView: (view: 'home') => void;
}

export default function ReferralsList({ user, users, setView }: ReferralsListProps) {
  const referredUsers = users.filter(u => u.referredBy === user.refCode);

  return (
    <Card className="max-w-4xl mx-auto shadow-xl">
      <CardHeader>
        <div className="flex items-center justify-between">
            <div>
                <CardTitle className="text-2xl">Your Referrals</CardTitle>
                <CardDescription>Users who joined using your code: {user.refCode}</CardDescription>
            </div>
            <Button variant="outline" onClick={() => setView('home')}>
                <ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard
            </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Mobile</TableHead>
              <TableHead>Date Joined</TableHead>
              <TableHead className="text-right">Bonus Earned</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {referredUsers.length > 0 ? (
              referredUsers.map(ref => (
                <TableRow key={ref.id}>
                  <TableCell className="font-medium">{ref.name}</TableCell>
                  <TableCell>{ref.mobile}</TableCell>
                  <TableCell>{new Date(ref.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell className="text-right text-green-600 font-semibold">₹100.00</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} className="text-center text-muted-foreground">
                  You haven't referred anyone yet. Share your code to start earning!
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
