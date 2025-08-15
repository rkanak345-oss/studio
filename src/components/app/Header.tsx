'use client';

import type { User } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Dna, LogOut, Shield, User as UserIcon } from 'lucide-react';

interface HeaderProps {
  user: User | null;
  onLogin: () => void;
  onLogout: () => void;
  onAdmin: () => void;
  goHome: () => void;
}

export default function Header({ user, onLogin, onLogout, onAdmin, goHome }: HeaderProps) {
  return (
    <header className="bg-card border-b sticky top-0 z-50">
      <div className="container max-w-7xl mx-auto flex items-center justify-between p-4">
        <div className="flex items-center gap-3 cursor-pointer" onClick={goHome}>
          <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-accent to-orange-400 flex items-center justify-center">
            <Dna className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-primary">RefRevenue</h1>
            <p className="text-xs text-muted-foreground">Earn via referrals</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={`https://api.dicebear.com/8.x/initials/svg?seed=${user.name}`} alt={user.name} />
                    <AvatarFallback>{user.name.charAt(0).toUpperCase()}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{user.name}</p>
                    <p className="text-xs leading-none text-muted-foreground">{user.mobile}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                {user.isAdmin ? (
                   <DropdownMenuItem onClick={onAdmin}>
                    <Shield className="mr-2 h-4 w-4" />
                    <span>Admin Panel</span>
                  </DropdownMenuItem>
                ) : (
                  <DropdownMenuItem disabled>
                    <UserIcon className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={onLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Button variant="outline" onClick={onAdmin}>Admin Panel</Button>
              <Button onClick={onLogin} className="bg-accent hover:bg-accent/90">Login / Register</Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
