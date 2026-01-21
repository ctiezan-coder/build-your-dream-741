import { useState } from 'react';
import { Save, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import type { Product, ExportParams, CostBreakdown } from '@/types/simulation';
import { Json } from '@/integrations/supabase/types';

interface SaveSimulationDialogProps {
  product: Product;
  params: ExportParams;
  breakdown: CostBreakdown;
  onSaved?: () => void;
}

export function SaveSimulationDialog({ 
  product, 
  params, 
  breakdown,
  onSaved 
}: SaveSimulationDialogProps) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState(product.name || 'Ma simulation');
  const [saving, setSaving] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  const handleSave = async () => {
    if (!user || !name.trim()) return;

    setSaving(true);
    
    const { error } = await supabase.from('simulations').insert({
      user_id: user.id,
      name: name.trim(),
      product: product as unknown as Json,
      params: params as unknown as Json,
      breakdown: breakdown as unknown as Json,
    });

    if (error) {
      toast({
        variant: 'destructive',
        title: 'Erreur',
        description: 'Impossible de sauvegarder la simulation',
      });
    } else {
      toast({
        title: 'Sauvegardé',
        description: 'Simulation enregistrée avec succès',
      });
      setOpen(false);
      onSaved?.();
    }
    
    setSaving(false);
  };

  if (!user) {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="flex-1">
          <Save className="w-4 h-4 mr-2" />
          Sauvegarder
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Sauvegarder la simulation</DialogTitle>
          <DialogDescription>
            Donnez un nom à cette simulation pour la retrouver facilement.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <Label htmlFor="simulation-name">Nom de la simulation</Label>
          <Input
            id="simulation-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ex: Export smartphones vers France"
            className="mt-2"
          />
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Annuler
          </Button>
          <Button onClick={handleSave} disabled={saving || !name.trim()}>
            {saving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            Sauvegarder
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
