import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

interface BackButtonProps {
  to?: string;
  label?: string;
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  className?: string;
}

export function BackButton({
  to = '/',
  label = 'Back to Dashboard',
  variant = 'outline',
  size = 'sm',
  className = '',
}: BackButtonProps) {
  return (
    <Link href={to}>
      <Button variant={variant} size={size} className={`gap-1 ${className}`}>
        <ArrowLeft size={16} />
        {label}
      </Button>
    </Link>
  );
}