import { useState, useRef, useEffect } from 'react';
import { Search, Check, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { searchHSCodes, type HSCode } from '@/lib/hsCodes';
import { cn } from '@/lib/utils';

interface HSCodeSearchProps {
  value: string;
  onChange: (code: string, dutyRate?: number) => void;
  error?: string;
}

export function HSCodeSearch({ value, onChange, error }: HSCodeSearchProps) {
  const [query, setQuery] = useState(value);
  const [results, setResults] = useState<HSCode[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<HSCode | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Search when query changes
  useEffect(() => {
    if (query.length >= 2) {
      const searchResults = searchHSCodes(query, 15);
      setResults(searchResults);
      setIsOpen(searchResults.length > 0);
    } else {
      setResults([]);
      setIsOpen(false);
    }
  }, [query]);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value.replace(/\D/g, '').slice(0, 10);
    setQuery(newValue);
    onChange(newValue);
    setSelectedItem(null);
  };

  // Handle item selection
  const handleSelect = (item: HSCode) => {
    setQuery(item.code);
    onChange(item.code, item.dutyRate);
    setSelectedItem(item);
    setIsOpen(false);
  };

  // Clear selection
  const handleClear = () => {
    setQuery('');
    onChange('');
    setSelectedItem(null);
    inputRef.current?.focus();
  };

  return (
    <div ref={containerRef} className="relative">
      <div className="relative">
        <Input
          ref={inputRef}
          value={query}
          onChange={handleInputChange}
          onFocus={() => query.length >= 2 && results.length > 0 && setIsOpen(true)}
          placeholder="Rechercher par code ou description..."
          className={cn(
            'pr-20',
            error ? 'border-destructive' : '',
            selectedItem ? 'pr-24' : ''
          )}
        />
        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
          {selectedItem && (
            <Badge variant="secondary" className="text-xs">
              {selectedItem.dutyRate}%
            </Badge>
          )}
          {query && (
            <button
              type="button"
              onClick={handleClear}
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <Search className="w-4 h-4 text-muted-foreground" />
        </div>
      </div>

      {/* Selected item info */}
      {selectedItem && (
        <div className="mt-2 p-3 rounded-lg bg-primary/5 border border-primary/20">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <Check className="w-4 h-4 text-primary flex-shrink-0" />
                <span className="font-mono text-sm font-medium">{selectedItem.code}</span>
              </div>
              <p className="text-sm text-muted-foreground truncate">
                {selectedItem.description}
              </p>
            </div>
            <Badge variant="outline" className="flex-shrink-0">
              DD: {selectedItem.dutyRate}%
            </Badge>
          </div>
        </div>
      )}

      {/* Dropdown results */}
      {isOpen && results.length > 0 && (
        <div className="absolute z-50 w-full mt-1 bg-popover border rounded-lg shadow-lg overflow-hidden">
          <ScrollArea className="max-h-64">
            <div className="p-1">
              {results.map((item) => (
                <button
                  key={item.code}
                  type="button"
                  onClick={() => handleSelect(item)}
                  className={cn(
                    'w-full text-left px-3 py-2 rounded-md transition-colors',
                    'hover:bg-accent focus:bg-accent focus:outline-none',
                    item.code === value && 'bg-primary/10'
                  )}
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-sm font-medium text-primary">
                          {item.code}
                        </span>
                        <Badge variant="secondary" className="text-xs">
                          {item.dutyRate}%
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground truncate mt-0.5">
                        {item.description}
                      </p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </ScrollArea>
          <div className="px-3 py-2 text-xs text-muted-foreground bg-muted/50 border-t">
            {results.length} résultat{results.length > 1 ? 's' : ''} — TEC CEDEAO
          </div>
        </div>
      )}

      {error && <p className="text-xs text-destructive mt-1">{error}</p>}
    </div>
  );
}
