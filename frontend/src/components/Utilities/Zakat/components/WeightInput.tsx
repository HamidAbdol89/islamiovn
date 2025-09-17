import React, { useCallback, useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useZakatValidation } from '../hooks';
import type { KimLoaiKey } from '../types';

interface WeightInputProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  icon?: React.ComponentType<any>;
  unit?: string;
  calculatedValue: number;
  fieldKey?: KimLoaiKey;
  className?: string;
  disabled?: boolean;
}

const WeightInput = React.memo<WeightInputProps>(({
  label,
  value,
  onChange,
  icon: Icon,
  unit = "gram",
  calculatedValue,
  fieldKey,
  className,
  disabled = false
}) => {
  const [inputValue, setInputValue] = useState(value.toString());
  const [error, setError] = useState<string | null>(null);
  const { validateKimLoaiField, sanitizeInput } = useZakatValidation();

  // Sync with external value changes
  useEffect(() => {
    if (value !== parseFloat(inputValue) && !document.activeElement?.id?.includes(fieldKey || '')) {
      setInputValue(value.toString());
    }
  }, [value, inputValue, fieldKey]);

  const formatCurrency = useCallback((amount: number) => {
    if (amount >= 1000000000) {
      return `${(amount / 1000000000).toFixed(1)} tỷ`;
    }
    if (amount >= 1000000) {
      return `${(amount / 1000000).toFixed(1)} triệu`;
    }
    if (amount >= 1000) {
      return `${(amount / 1000).toFixed(0)}K`;
    }
    return amount.toLocaleString('vi-VN');
  }, []);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value;
    setInputValue(rawValue);
    
    const sanitizedValue = sanitizeInput(rawValue);
    
    // Validate if fieldKey is provided
    if (fieldKey) {
      const validationError = validateKimLoaiField(fieldKey, sanitizedValue);
      setError(validationError?.message || null);
    }
    
    onChange(sanitizedValue);
  }, [onChange, sanitizeInput, validateKimLoaiField, fieldKey]);

  return (
    <div className={cn("space-y-3", className)}>
      <Label className="flex items-center gap-2 text-sm font-medium">
        {Icon && <Icon className="w-4 h-4 text-yellow-500" />}
        {label}
      </Label>
      
      <div className="space-y-2">
        <div className="relative">
          <Input
            type="number"
            inputMode="decimal"
            value={inputValue}
            onChange={handleInputChange}
            placeholder="0"
            className={cn(
              "text-lg pr-16 transition-all duration-200",
              error && "border-destructive focus-visible:ring-destructive",
              "focus:scale-[1.02] focus:shadow-md"
            )}
            disabled={disabled}
            id={`weight-input-${fieldKey}`}
          />
          <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-sm text-muted-foreground">
            {unit}
          </span>
        </div>
        
        {error && (
          <div className="flex items-center gap-2 text-sm text-destructive animate-in slide-in-from-top-1">
            <AlertCircle className="w-4 h-4" />
            {error}
          </div>
        )}
        
        {value > 0 && !error && (
          <Badge 
            variant="secondary" 
            className="text-xs animate-in fade-in slide-in-from-bottom-1"
          >
            Giá trị: {formatCurrency(calculatedValue)} VND
          </Badge>
        )}
      </div>
    </div>
  );
});

WeightInput.displayName = 'WeightInput';

export default WeightInput;
