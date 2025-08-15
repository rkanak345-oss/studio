'use client';

import { useState } from 'react';
import { askAi } from '@/ai/flows/generic-ai-flow';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Sparkles, ArrowLeft } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

interface AIGeneratorPageProps {
  setView: (view: 'home') => void;
}

export default function AIGeneratorPage({ setView }: AIGeneratorPageProps) {
  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      toast({
        title: 'Prompt is empty',
        description: 'Please enter a prompt to ask the AI.',
        variant: 'destructive',
      });
      return;
    }
    setIsLoading(true);
    setResponse('');
    try {
      const result = await askAi({ prompt });
      setResponse(result.response);
      toast({
        title: 'Response Generated!',
        description: 'The AI has responded to your prompt.',
      });
    } catch (error) {
      console.error('Error generating response:', error);
      toast({
        title: 'Error',
        description: 'Could not generate a response. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="max-w-4xl mx-auto shadow-xl">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2 text-2xl">
              <Sparkles className="h-6 w-6 text-accent" />
              AI Playground
            </CardTitle>
            <CardDescription>
              Ask the AI anything. Experiment with different prompts.
            </CardDescription>
          </div>
          <Button variant="outline" onClick={() => setView('home')}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Textarea
            placeholder="Explain how AI works in a few words..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            rows={4}
            className="text-base"
          />
          <Button onClick={handleGenerate} disabled={isLoading} className="w-full">
            {isLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Sparkles className="mr-2 h-4 w-4" />
            )}
            Ask AI
          </Button>
        </div>

        {response && (
          <div className="space-y-2 pt-4">
            <h4 className="font-semibold">AI Response:</h4>
            <ScrollArea className="h-60 w-full rounded-md border p-4 bg-slate-50">
              <pre className="text-sm whitespace-pre-wrap font-sans">{response}</pre>
            </ScrollArea>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
