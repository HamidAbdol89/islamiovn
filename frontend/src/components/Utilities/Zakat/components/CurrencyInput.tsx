import React, { useCallback, useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { SO_TIEN_NHANH } from '../constants';
import { useZakatValidation } from '../hooks';
import type { TaiSanKey } from '../types';

interface CurrencyInputProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  icon?: React.ComponentType<any>;
  placeholder?: string;
  showQuickButtons?: boolean;
  fieldKey?: TaiSanKey;
  className?: string;
  disabled?: boolean;
}

const CurrencyInput = React.memo<CurrencyInputProps>(({
  label,
  value,
  onChange,
  icon: Icon,
  placeholder = "0",
  showQuickButtons = true,
  fieldKey,
  className,
  disabled = false
}) => {
  const [inputValue, setInputValue] = useState(value.toString());
  const [error, setError] = useState<string | null>(null);
  const { validateTaiSanField, sanitizeInput } = useZakatValidation();

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
      const validationError = validateTaiSanField(fieldKey, sanitizedValue);
      setError(validationError?.message || null);
    }
    
    onChange(sanitizedValue);
  }, [onChange, sanitizeInput, validateTaiSanField, fieldKey]);

  const handleQuickAdd = useCallback((amount: number) => {
    const newValue = value + amount;
    onChange(newValue);
    setInputValue(newValue.toString());
    setError(null);
  }, [value, onChange]);

  const handleClear = useCallback(() => {
    onChange(0);
    setInputValue('0');
    setError(null);
  }, [onChange]);

  return (
    <div className={cn("space-y-3", className)}>
      <Label className="flex items-center gap-2 text-sm font-medium">
        {Icon && <Icon className="w-4 h-4 text-primary" />}
        {label}
      </Label>
      
      <div className="space-y-2">
        <div className="relative">
          <Input
            type="number"
            inputMode="numeric"
            value={inputValue}
            onChange={handleInputChange}
            placeholder={placeholder}
            className={cn(
              "text-lg pr-16 transition-all duration-200",
              error && "border-destructive focus-visible:ring-destructive",
              "focus:scale-[1.02] focus:shadow-md"
            )}
            disabled={disabled}
            id={`input-${fieldKey}`}
          />
          <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-sm text-muted-foreground">
            VND
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
            {formatCurrency(value)} VND
          </Badge>
        )}
        
        {showQuickButtons && fieldKey && !disabled && (
          <div className="flex flex-wrap gap-2 animate-in fade-in slide-in-from-bottom-2" style={{ animationDelay: '100ms' }}>
            {SO_TIEN_NHANH.map((preset, index) => (
              <Button
                key={preset.nhan}
                variant="outline"
                size="sm"
                onClick={() => handleQuickAdd(preset.giaTri)}
                className="text-xs hover:scale-105 transition-transform duration-200"
                style={{ animationDelay: `${150 + index * 50}ms` }}
              >
                +{preset.nhan}
              </Button>
            ))}
            <Button
              variant="destructive"
              size="sm"
              onClick={handleClear}
              className="text-xs hover:scale-105 transition-transform duration-200"
              style={{ animationDelay: `${150 + SO_TIEN_NHANH.length * 50}ms` }}
            >
              Xóa
            </Button>
          </div>
        )}
      </div>
    </div>
  );
});

CurrencyInput.displayName = 'CurrencyInput';

export default CurrencyInput;
