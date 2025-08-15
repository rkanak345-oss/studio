'use client';

import { useState } from 'react';
import type { User } from '@/lib/types';
import { generatePersonalizedReferralMessage } from '@/ai/flows/generate-referral-message';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Copy, Sparkles } from 'lucide-react';

interface AIGeneratorProps {
  user: User;
}

export default function AIGenerator({ user }: AIGeneratorProps) {
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleGenerate = async () => {
    setIsLoading(true);
    setMessage('');
    try {
      const result = await generatePersonalizedReferralMessage({
        userName: user.name,
        referralCode: user.refCode,
        productName: 'RefRevenue',
      });
      setMessage(result.message);
      toast({
        title: 'Message Generated!',
        description: 'Your personalized referral message is ready.',
      });
    } catch (error) {
      console.error('Error generating message:', error);
      toast({
        title: 'Error',
        description: 'Could not generate a message. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(message).then(() => {
      toast({
        title: 'Copied to clipboard!',
        description: 'The message is ready to be shared.',
      });
    });
  };

  return (
    <Card className="shadow-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-accent"/>
            AI-Powered Message
        </CardTitle>
        <CardDescription>Generate a catchy referral message to share on social media.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button onClick={handleGenerate} disabled={isLoading} className="w-full">
          {isLoading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Sparkles className="mr-2 h-4 w-4" />
          )}
          Generate Message
        </Button>

        {message && (
          <div className="space-y-2">
            <Textarea value={message} readOnly rows={6} className="bg-slate-50"/>
            <Button variant="outline" onClick={copyToClipboard} className="w-full">
              <Copy className="mr-2 h-4 w-4" />
              Copy Message
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
