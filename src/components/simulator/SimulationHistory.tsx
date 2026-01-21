import { useState, useEffect } from 'react';
import { History, Trash2, RefreshCw, Loader2, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import type { Product, ExportParams, CostBreakdown } from '@/types/simulation';
import { INCOTERM_INFO, CURRENCIES } from '@/types/simulation';
import { formatCurrency } from '@/lib/calculator';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Json } from '@/integrations/supabase/types';

interface SavedSimulation {
  id: string;
  name: string;
  product: Product;
  params: ExportParams;
  breakdown: CostBreakdown;
  created_at: string;
}

interface SimulationHistoryProps {
  onLoad: (product: Product, params: ExportParams, breakdown: CostBreakdown) => void;
}

function parseJsonAs<T>(json: Json): T {
  return json as unknown as T;
}

export function SimulationHistory({ onLoad }: SimulationHistoryProps) {
  const [simulations, setSimulations] = useState<SavedSimulation[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchSimulations = async () => {
    if (!user) return;
    
    setLoading(true);
    const { data, error } = await supabase
      .from('simulations')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      toast({
        variant: 'destructive',
        title: 'Erreur',
        description: 'Impossible de charger l\'historique',
      });
    } else {
      const parsed = (data || []).map((item) => ({
        id: item.id,
        name: item.name,
        product: parseJsonAs<Product>(item.product),
        params: parseJsonAs<ExportParams>(item.params),
        breakdown: parseJsonAs<CostBreakdown>(item.breakdown),
        created_at: item.created_at,
      }));
      setSimulations(parsed);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchSimulations();
  }, [user]);

  const handleDelete = async (id: string) => {
    setDeleting(id);
    const { error } = await supabase
      .from('simulations')
      .delete()
      .eq('id', id);

    if (error) {
      toast({
        variant: 'destructive',
        title: 'Erreur',
        description: 'Impossible de supprimer la simulation',
      });
    } else {
      setSimulations((prev) => prev.filter((s) => s.id !== id));
      toast({
        title: 'Supprimé',
        description: 'Simulation supprimée avec succès',
      });
    }
    setDeleting(null);
  };

  const handleLoad = (simulation: SavedSimulation) => {
    onLoad(simulation.product, simulation.params, simulation.breakdown);
    toast({
      title: 'Simulation chargée',
      description: `"${simulation.name}" a été rechargée`,
    });
  };

  if (!user) {
    return null;
  }

  return (
    <Card className="glass-card">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <History className="w-5 h-5 text-primary" />
            Historique
          </CardTitle>
          <Button 
            variant="ghost" 
            size="icon"
            onClick={fetchSimulations}
            disabled={loading}
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
          </div>
        ) : simulations.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <History className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">Aucune simulation sauvegardée</p>
          </div>
        ) : (
          <ScrollArea className="h-[300px] pr-4">
            <div className="space-y-2">
              {simulations.map((sim) => (
                <div
                  key={sim.id}
                  className="p-3 rounded-lg border bg-card hover:bg-muted/50 transition-colors group"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{sim.name}</p>
                      <p className="text-sm text-muted-foreground truncate">
                        {sim.product.name} • {sim.params.incoterm}
                      </p>
                      <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                        <Clock className="w-3 h-3" />
                        {format(new Date(sim.created_at), 'dd MMM yyyy HH:mm', { locale: fr })}
                      </div>
                    </div>
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleLoad(sim)}
                      >
                        Charger
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-destructive hover:text-destructive"
                        onClick={() => handleDelete(sim.id)}
                        disabled={deleting === sim.id}
                      >
                        {deleting === sim.id ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Trash2 className="w-4 h-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
}
