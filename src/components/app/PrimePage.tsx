'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Upload, QrCode } from 'lucide-react';

interface PrimePageProps {
  setView: (view: 'home') => void;
}

export default function PrimePage({ setView }: PrimePageProps) {
  const { toast } = useToast();

  const handlePaid = () => {
    toast({
      title: 'Action Required',
      description: 'Please upload payment proof. (This is a demo, no upload will occur).',
    });
  };

  return (
    <Card className="max-w-2xl mx-auto shadow-xl">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-2xl">Prime+ Membership</CardTitle>
            <CardDescription>Unlock exclusive benefits by upgrading your account.</CardDescription>
          </div>
          <Button variant="outline" onClick={() => setView('home')}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Back
          </Button>
        </div>
      </CardHeader>
      <CardContent className="text-center">
        <p className="text-muted-foreground mb-6">
          Pay via UPI to become a Prime+ member. After payment, click the button below. An admin will manually approve your membership.
        </p>
        <div className="border rounded-lg p-8 bg-slate-50">
            <div className="font-bold text-xl mb-4">Scan QR to Pay ₹99</div>
            <div className="mx-auto w-48 h-48 bg-slate-200 rounded-lg flex items-center justify-center mb-4">
                <QrCode className="h-24 w-24 text-muted-foreground"/>
            </div>
             <p className="text-xs text-muted-foreground mb-4">[This is a placeholder QR code]</p>
            <Button onClick={handlePaid} className="w-full">
                <Upload className="mr-2 h-4 w-4" /> I Have Paid (Confirm Payment)
            </Button>
        </div>
      </CardContent>
    </Card>
  );
}
