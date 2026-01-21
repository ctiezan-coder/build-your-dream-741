import { Package, Globe, Calculator, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StepIndicatorProps {
  currentStep: number;
  totalSteps: number;
}

const steps = [
  { icon: Package, label: 'Produit' },
  { icon: Globe, label: 'Export' },
  { icon: Calculator, label: 'Résultat' },
];

export function StepIndicator({ currentStep, totalSteps }: StepIndicatorProps) {
  return (
    <div className="flex items-center justify-center gap-4 mb-8">
      {steps.map((step, index) => {
        const isCompleted = index < currentStep;
        const isCurrent = index === currentStep;
        const Icon = step.icon;
        
        return (
          <div key={step.label} className="flex items-center">
            <div className="flex flex-col items-center gap-2">
              <div
                className={cn(
                  'step-dot',
                  isCompleted && 'step-dot-completed',
                  isCurrent && 'step-dot-active',
                  !isCompleted && !isCurrent && 'step-dot-pending'
                )}
              >
                {isCompleted ? (
                  <Check className="w-5 h-5" />
                ) : (
                  <Icon className="w-5 h-5" />
                )}
              </div>
              <span
                className={cn(
                  'text-xs font-medium transition-colors',
                  isCurrent ? 'text-primary' : 'text-muted-foreground'
                )}
              >
                {step.label}
              </span>
            </div>
            {index < steps.length - 1 && (
              <div
                className={cn(
                  'w-16 h-0.5 mx-4 transition-colors',
                  isCompleted ? 'bg-success' : 'bg-border'
                )}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
