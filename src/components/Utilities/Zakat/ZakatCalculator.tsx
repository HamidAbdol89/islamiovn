import React, { useState, useEffect, useMemo } from 'react';
import { Calculator, Info, DollarSign, Coins, CreditCard, Building2, TrendingUp, Sun, Moon, Zap, Clock, Star } from 'lucide-react';
import BackButton from "@/components/ui/BackButton"; 

interface ZakatCalculatorProps {}

interface AssetValues {
  cash: number;
  bankSavings: number;
  gold: number;
  silver: number;
  investments: number;
  business: number;
  debts: number;
}

interface GoldSilverPrices {
  goldPerGram: number;
  silverPerGram: number;
}

const ZakatCalculator: React.FC<ZakatCalculatorProps> = () => {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [assets, setAssets] = useState<AssetValues>({
    cash: 0,
    bankSavings: 0,
    gold: 0,
    silver: 0,
    investments: 0,
    business: 0,
    debts: 0
  });

  const [goldSilverWeight, setGoldSilverWeight] = useState({
    goldGrams: 0,
    silverGrams: 0
  });

  const [prices, setPrices] = useState<GoldSilverPrices>({
    goldPerGram: 65.50,
    silverPerGram: 0.85
  });

  const [isLoading, setIsLoading] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [apiStatus, setApiStatus] = useState('');
  const [activeTab, setActiveTab] = useState('cash');

  // Quick amount presets in USD
  const quickAmounts = [
    { label: '100', value: 100 },
    { label: '500', value: 500 },
    { label: '1K', value: 1000 },
    { label: '5K', value: 5000 },
    { label: '10K', value: 10000 },
    { label: '50K', value: 50000 }
  ];

  // Nisab thresholds
  const NISAB_GOLD_GRAMS = 87.48;
  const NISAB_SILVER_GRAMS = 612.36;
  const ZAKAT_RATE = 0.025;

  // Calculate nisab values in USD
  const nisabGoldUSD = useMemo(() => NISAB_GOLD_GRAMS * prices.goldPerGram, [prices.goldPerGram]);
  const nisabSilverUSD = useMemo(() => NISAB_SILVER_GRAMS * prices.silverPerGram, [prices.silverPerGram]);
  const nisabThreshold = useMemo(() => Math.min(nisabGoldUSD, nisabSilverUSD), [nisabGoldUSD, nisabSilverUSD]);

  const goldValueUSD = useMemo(() => goldSilverWeight.goldGrams * prices.goldPerGram, [goldSilverWeight.goldGrams, prices.goldPerGram]);
  const silverValueUSD = useMemo(() => goldSilverWeight.silverGrams * prices.silverPerGram, [goldSilverWeight.silverGrams, prices.silverPerGram]);

  const totalAssets = useMemo(() => assets.cash + assets.bankSavings + assets.gold + assets.silver + 
    assets.investments + assets.business + goldValueUSD + silverValueUSD, 
    [assets, goldValueUSD, silverValueUSD]);

  const netWealth = useMemo(() => totalAssets - assets.debts, [totalAssets, assets.debts]);

  // Check if eligible for zakat
  const isEligible = netWealth >= nisabThreshold;
  const zakatAmount = isEligible ? netWealth * ZAKAT_RATE : 0;

  useEffect(() => {
    fetchCurrentPrices();
  }, []);

  const fetchCurrentPrices = async () => {
    setIsLoading(true);
    setApiStatus('Loading data...');
    
    try {
      let newPrices = { ...prices };
      let successfulAPIs = [];

      try {
        const metalsResponse = await fetch('https://api.metals.live/v1/spot');
        if (metalsResponse.ok) {
          const metalsData = await metalsResponse.json();
          if (metalsData.gold && metalsData.silver) {
            // Convert from troy ounce to grams (1 troy oz = 31.1035 grams)
            newPrices.goldPerGram = metalsData.gold / 31.1035;
            newPrices.silverPerGram = metalsData.silver / 31.1035;
            successfulAPIs.push('Metals API');
          }
        }
      } catch (error) {
        console.warn('Metals API failed:', error);
      }

      setPrices(newPrices);

      if (successfulAPIs.length > 0) {
        setApiStatus(`Successfully updated: ${successfulAPIs.join(', ')}`);
      } else {
        setApiStatus('Using base prices (API connection failed)');
      }

    } catch (error) {
      console.error('Error fetching prices:', error);
      setApiStatus('Connection error - using default prices');
      
      setPrices({
        goldPerGram: 65.50,
        silverPerGram: 0.85
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAssetChange = (key: keyof AssetValues, value: string) => {
    const numValue = parseFloat(value) || 0;
    setAssets(prev => ({ ...prev, [key]: numValue }));
  };

  const handleWeightChange = (key: 'goldGrams' | 'silverGrams', value: string) => {
    const numValue = parseFloat(value) || 0;
    setGoldSilverWeight(prev => ({ ...prev, [key]: numValue }));
  };

  const addQuickAmount = (key: keyof AssetValues, amount: number) => {
    setAssets(prev => ({ ...prev, [key]: prev[key] + amount }));
  };

  const formatUSD = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatCompactUSD = (amount: number) => {
    if (amount >= 1000000000) {
      return `${(amount / 1000000000).toFixed(1)}B USD`;
    }
    if (amount >= 1000000) {
      return `${(amount / 1000000).toFixed(1)}M USD`;
    }
    if (amount >= 1000) {
      return `${(amount / 1000).toFixed(0)}K USD`;
    }
    return `${amount.toLocaleString()} USD`;
  };

  const MobileInput = ({ 
    label, 
    value, 
    onChange, 
    icon: Icon,
    assetKey,
    placeholder = "0",
    showQuickAdd = true
  }: {
    label: string;
    value: number;
    onChange: (value: string) => void;
    icon: React.ComponentType<any>;
    assetKey?: keyof AssetValues;
    placeholder?: string;
    showQuickAdd?: boolean;
  }) => (
    <div className="space-y-3">
      <label className={`flex items-center gap-2 text-sm font-medium ${
        isDarkMode ? 'text-gray-200' : 'text-gray-700'
      }`}>
        <Icon className="w-4 h-4 text-emerald-500" />
        {label}
      </label>
      
      <div className="space-y-2">
        <input
          type="number"
          inputMode="numeric"
          pattern="[0-9]*"
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={`w-full px-4 py-3 text-lg rounded-xl border-2 transition-all duration-200 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${
            isDarkMode 
              ? 'bg-gray-800 border-gray-600 text-white placeholder-gray-400' 
              : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
          }`}
        />
        
        {value > 0 && (
          <div className={`text-xs px-2 py-1 rounded-md ${
            isDarkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'
          }`}>
            {formatCompactUSD(value)}
          </div>
        )}
        
        {showQuickAdd && assetKey && (
          <div className="flex flex-wrap gap-2">
            {quickAmounts.map((preset) => (
              <button
                key={preset.label}
                onClick={() => addQuickAmount(assetKey, preset.value)}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all duration-200 ${
                  isDarkMode
                    ? 'bg-gray-700 text-gray-300 hover:bg-gray-600 active:bg-gray-500'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300 active:bg-gray-400'
                } transform active:scale-95`}
              >
                +{preset.label}
              </button>
            ))}
            <button
              onClick={() => setAssets(prev => ({ ...prev, [assetKey]: 0 }))}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all duration-200 ${
                isDarkMode
                  ? 'bg-red-800 text-red-200 hover:bg-red-700'
                  : 'bg-red-100 text-red-700 hover:bg-red-200'
              } transform active:scale-95`}
            >
              Clear
            </button>
          </div>
        )}
      </div>
    </div>
  );

  const WeightInput = ({ 
    label, 
    value, 
    onChange, 
    icon: Icon,
    calculatedValue,
    unit = "gram"
  }: {
    label: string;
    value: number;
    onChange: (value: string) => void;
    icon: React.ComponentType<any>;
    calculatedValue: number;
    unit?: string;
  }) => (
    <div className="space-y-3">
      <label className={`flex items-center gap-2 text-sm font-medium ${
        isDarkMode ? 'text-gray-200' : 'text-gray-700'
      }`}>
        <Icon className="w-4 h-4 text-yellow-500" />
        {label}
      </label>
      
      <div className="space-y-2">
        <div className="relative">
          <input
            type="number"
            inputMode="decimal"
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            placeholder="0"
            className={`w-full px-4 py-3 pr-16 text-lg rounded-xl border-2 transition-all duration-200 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${
              isDarkMode 
                ? 'bg-gray-800 border-gray-600 text-white placeholder-gray-400' 
                : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
            }`}
          />
          <span className={`absolute right-4 top-1/2 transform -translate-y-1/2 text-sm ${
            isDarkMode ? 'text-gray-400' : 'text-gray-500'
          }`}>
            {unit}
          </span>
        </div>
        
        {value > 0 && (
          <div className={`text-xs px-2 py-1 rounded-md ${
            isDarkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'
          }`}>
            Value: {formatCompactUSD(calculatedValue)}
          </div>
        )}
      </div>
    </div>
  );

  const TabButton = ({ 
    
    label, 
    icon: Icon, 
    isActive, 
    onClick 
  }: {
    id: string;
    label: string;
    icon: React.ComponentType<any>;
    isActive: boolean;
    onClick: () => void;
  }) => (
    <button
      onClick={onClick}
      className={`flex-1 flex flex-col items-center gap-1 py-3 px-2 rounded-xl transition-all duration-200 ${
        isActive
          ? isDarkMode
            ? 'bg-emerald-600 text-white shadow-lg'
            : 'bg-emerald-500 text-white shadow-lg'
          : isDarkMode
            ? 'bg-gray-800 text-gray-400 hover:bg-gray-700'
            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
      }`}
    >
      <Icon className="w-5 h-5" />
      <span className="text-xs font-medium">{label}</span>
    </button>
  );

  const ThemeToggle = () => (
    <button
      onClick={() => setIsDarkMode(!isDarkMode)}
      className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 ${
        isDarkMode ? 'bg-gray-700' : 'bg-gray-300'
      }`}
      role="switch"
      aria-checked={isDarkMode}
    >
      <span
        className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform duration-200 ${
          isDarkMode ? 'translate-x-7' : 'translate-x-1'
        }`}
      >
        <span className="flex h-full w-full items-center justify-center">
          {isDarkMode ? (
            <Moon className="h-3 w-3 text-gray-700" />
          ) : (
            <Sun className="h-3 w-3 text-yellow-500" />
          )}
        </span>
      </span>
    </button>
  );

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      isDarkMode 
        ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-emerald-900' 
        : 'bg-gradient-to-br from-emerald-50 to-teal-50'
    }`}>
      <div className="max-w-4xl mx-auto p-4 sm:p-6">
        <div className={`rounded-3xl shadow-2xl overflow-hidden transition-colors duration-300 ${
          isDarkMode ? 'bg-gray-800' : 'bg-white'
        }`}>
          {/* Header */}
          <div className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white p-4 sm:p-6">
            
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <BackButton />
                <Calculator className="w-7 h-7 sm:w-8 sm:h-8" />
                <h1 className="text-xl sm:text-2xl font-bold">Zakat Calculator</h1>
              </div>
              <ThemeToggle />
            </div>
            <p className="text-emerald-100 text-sm sm:text-base">
              Accurate Zakat calculation according to Islamic standards for the global Muslim community
            </p>
          </div>

          <div className="p-4 sm:p-6">
            {/* Current Prices Section */}
            <div className={`mb-6 p-4 rounded-2xl transition-colors duration-300 ${
              isDarkMode ? 'bg-gray-700' : 'bg-gray-50'
            }`}>
              <div className="flex items-center justify-between mb-3">
                <h3 className={`text-lg font-semibold ${
                  isDarkMode ? 'text-gray-200' : 'text-gray-800'
                }`}>
                  Real-Time Prices
                </h3>
                <button
                  onClick={fetchCurrentPrices}
                  disabled={isLoading}
                  className="px-3 py-2 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 disabled:opacity-50 transition-all duration-200 text-sm flex items-center gap-2 transform active:scale-95"
                >
                  {isLoading ? (
                    <>
                      <div className="w-3 h-3 border border-white border-t-transparent rounded-full animate-spin"></div>
                      <span className="hidden sm:inline">Updating...</span>
                    </>
                  ) : (
                    <>
                      <Zap className="w-4 h-4" />
                      <span className="hidden sm:inline">Update Prices</span>
                    </>
                  )}
                </button>
              </div>
              
              {apiStatus && (
                <div className={`mb-3 text-xs p-2 rounded-lg border transition-colors duration-300 ${
                  isDarkMode 
                    ? 'bg-gray-800 text-gray-300 border-gray-600' 
                    : 'bg-white text-gray-600 border-gray-200'
                }`}>
                  <Clock className="w-3 h-3 inline mr-1" />
                  {apiStatus}
                </div>
              )}
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                <div className={`flex justify-between p-2 rounded-lg ${
                  isDarkMode ? 'bg-gray-800' : 'bg-gray-100'
                }`}>
                  <span className={isDarkMode ? 'text-gray-400' : 'text-gray-700'}>Gold:</span>
                  <span className="font-medium">${prices.goldPerGram.toFixed(2)}/g</span>
                </div>
                <div className={`flex justify-between p-2 rounded-lg ${
                  isDarkMode ? 'bg-gray-800' : 'bg-gray-100'
                }`}>
                  <span className={isDarkMode ? 'text-gray-400' : 'text-gray-700'}>Silver:</span>
                  <span className="font-medium">${prices.silverPerGram.toFixed(2)}/g</span>
                </div>
              </div>
            </div>

            {/* Mobile Tabs for Input Sections */}
            <div className="lg:hidden mb-6">
              <div className="flex gap-2 p-1 bg-gray-200 dark:bg-gray-700 rounded-2xl">
                <TabButton
                  id="cash"
                  label="Cash"
                  icon={DollarSign}
                  isActive={activeTab === 'cash'}
                  onClick={() => setActiveTab('cash')}
                />
                <TabButton
                  id="metals"
                  label="Metals"
                  icon={Coins}
                  isActive={activeTab === 'metals'}
                  onClick={() => setActiveTab('metals')}
                />
                <TabButton
                  id="assets"
                  label="Assets"
                  icon={TrendingUp}
                  isActive={activeTab === 'assets'}
                  onClick={() => setActiveTab('assets')}
                />
                <TabButton
                  id="debts"
                  label="Debts"
                  icon={Building2}
                  isActive={activeTab === 'debts'}
                  onClick={() => setActiveTab('debts')}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
              {/* Input Section */}
              <div className="space-y-6">
                <h2 className={`text-xl font-semibold border-b pb-2 hidden lg:block ${
                  isDarkMode 
                    ? 'text-gray-200 border-gray-600' 
                    : 'text-gray-800 border-gray-200'
                }`}>
                  Enter Your Assets
                </h2>

                {/* Cash Assets - Always visible on desktop, conditional on mobile */}
                <div className={`space-y-4 ${activeTab !== 'cash' ? 'hidden lg:block' : ''}`}>
                  <h3 className={`text-lg font-medium ${
                    isDarkMode ? 'text-gray-200' : 'text-gray-700'
                  }`}>
                    Cash & Savings (USD)
                  </h3>
                  <div className="space-y-4">
                    <MobileInput
                      label="Cash"
                      value={assets.cash}
                      onChange={(v) => handleAssetChange('cash', v)}
                      icon={DollarSign}
                      assetKey="cash"
                    />
                    <MobileInput
                      label="Bank Savings"
                      value={assets.bankSavings}
                      onChange={(v) => handleAssetChange('bankSavings', v)}
                      icon={CreditCard}
                      assetKey="bankSavings"
                    />
                  </div>
                </div>

                {/* Precious Metals - Always visible on desktop, conditional on mobile */}
                <div className={`space-y-4 ${activeTab !== 'metals' ? 'hidden lg:block' : ''}`}>
                  <h3 className={`text-lg font-medium ${
                    isDarkMode ? 'text-gray-200' : 'text-gray-700'
                  }`}>
                    Precious Metals
                  </h3>
                  <div className="space-y-4">
                    <WeightInput
                      label="Gold (grams)"
                      value={goldSilverWeight.goldGrams}
                      onChange={(v) => handleWeightChange('goldGrams', v)}
                      icon={Coins}
                      calculatedValue={goldValueUSD}
                    />
                    <WeightInput
                      label="Silver (grams)"
                      value={goldSilverWeight.silverGrams}
                      onChange={(v) => handleWeightChange('silverGrams', v)}
                      icon={Coins}
                      calculatedValue={silverValueUSD}
                    />
                    <MobileInput
                      label="Other gold/silver (USD)"
                      value={assets.gold}
                      onChange={(v) => handleAssetChange('gold', v)}
                      icon={Coins}
                      assetKey="gold"
                    />
                  </div>
                </div>

                {/* Other Assets - Always visible on desktop, conditional on mobile */}
                <div className={`space-y-4 ${activeTab !== 'assets' ? 'hidden lg:block' : ''}`}>
                  <h3 className={`text-lg font-medium ${
                    isDarkMode ? 'text-gray-200' : 'text-gray-700'
                  }`}>
                    Other Assets (USD)
                  </h3>
                  <div className="space-y-4">
                    <MobileInput
                      label="Investments/Stocks"
                      value={assets.investments}
                      onChange={(v) => handleAssetChange('investments', v)}
                      icon={TrendingUp}
                      assetKey="investments"
                    />
                    <MobileInput
                      label="Business Assets"
                      value={assets.business}
                      onChange={(v) => handleAssetChange('business', v)}
                      icon={Building2}
                      assetKey="business"
                    />
                  </div>
                </div>

                {/* Debts - Always visible on desktop, conditional on mobile */}
                <div className={`space-y-4 ${activeTab !== 'debts' ? 'hidden lg:block' : ''}`}>
                  <h3 className={`text-lg font-medium ${
                    isDarkMode ? 'text-gray-200' : 'text-gray-700'
                  }`}>
                    Debts & Liabilities (USD)
                  </h3>
                  <MobileInput
                    label="Total Debts"
                    value={assets.debts}
                    onChange={(v) => handleAssetChange('debts', v)}
                    icon={DollarSign}
                    assetKey="debts"
                  />
                </div>
              </div>

              {/* Results Section */}
              <div className="space-y-6">
                <h2 className={`text-xl font-semibold border-b pb-2 ${
                  isDarkMode 
                    ? 'text-gray-200 border-gray-600' 
                    : 'text-gray-800 border-gray-200'
                }`}>
                  Calculation Results
                </h2>

                {/* Nisab Information */}
                <div className={`border rounded-2xl p-4 transition-colors duration-300 ${
                  isDarkMode 
                    ? 'bg-blue-900/30 border-blue-700/50' 
                    : 'bg-blue-50 border-blue-200'
                }`}>
                  <div className="flex items-center gap-2 mb-3">
                    <Info className="w-5 h-5 text-blue-500" />
                    <h3 className={`font-semibold ${
                      isDarkMode ? 'text-blue-300' : 'text-blue-900'
                    }`}>
                      Nisab Information
                    </h3>
                  </div>
                  <div className={`space-y-2 text-sm ${
                    isDarkMode ? 'text-blue-200' : 'text-blue-800'
                  }`}>
                    <div className="flex justify-between">
                      <span>Gold Nisab:</span>
                      <span className="font-medium">{formatCompactUSD(nisabGoldUSD)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Silver Nisab:</span>
                      <span className="font-medium">{formatCompactUSD(nisabSilverUSD)}</span>
                    </div>
                    <div className={`flex justify-between pt-2 border-t ${
                      isDarkMode ? 'border-blue-700/50' : 'border-blue-300'
                    }`}>
                      <span className="font-semibold">Applicable Threshold:</span>
                      <span className="font-bold">{formatCompactUSD(nisabThreshold)}</span>
                    </div>
                  </div>
                </div>

                {/* Calculation Summary */}
                <div className={`rounded-2xl p-4 transition-colors duration-300 ${
                  isDarkMode ? 'bg-gray-700' : 'bg-gray-50'
                }`}>
                  <h3 className={`font-semibold mb-3 ${
                    isDarkMode ? 'text-gray-200' : 'text-gray-800'
                  }`}>
                    Wealth Summary
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className={isDarkMode ? 'text-gray-400' : 'text-gray-700'}>Total Assets:</span>
                      <span className="font-medium">{formatCompactUSD(totalAssets)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>Total Debts:</span>
                      <span className="font-medium text-red-500">-{formatCompactUSD(assets.debts)}</span>
                    </div>
                    <div className={`border-t pt-2 ${
                      isDarkMode ? 'border-gray-600' : 'border-gray-300'
                    }`}>
                      <div className="flex justify-between font-semibold text-base">
                        <span>Net Wealth:</span>
                        <span className="text-emerald-600">{formatCompactUSD(netWealth)}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Zakat Result */}
                <div className={`rounded-2xl p-6 text-center transition-all duration-300 ${
                  isEligible 
                    ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg' 
                    : isDarkMode
                      ? 'bg-gray-700 text-gray-300'
                      : 'bg-gray-100 text-gray-600'
                }`}>
                  {isEligible && <Star className="w-6 h-6 mx-auto mb-2 animate-pulse" />}
                  <h3 className="text-lg font-semibold mb-3">
                    {isEligible ? 'You need to pay Zakat' : 'You are not eligible for Zakat'}
                  </h3>
                  <div className="text-2xl sm:text-3xl font-bold mb-2">
                    {formatUSD(zakatAmount)}
                  </div>
                  {isEligible && (
                    <p className="text-sm opacity-90">
                      (2.5% of {formatCompactUSD(netWealth)})
                    </p>
                  )}
                </div>

                {/* Additional Information */}
                <div className={`border rounded-2xl p-4 transition-colors duration-300 ${
                  isDarkMode 
                    ? 'bg-amber-900/30 border-amber-700/50' 
                    : 'bg-amber-50 border-amber-200'
                }`}>
                  <div className="flex items-start gap-2">
                    <Info className="w-5 h-5 text-amber-500 mt-0.5 flex-shrink-0" />
                    <div className={`text-sm ${
                      isDarkMode ? 'text-amber-200' : 'text-amber-800'
                    }`}>
                      <p className="font-medium mb-2">Important Notes:</p>
                      <ul className="space-y-1 text-xs">
                        <li>• Zakat must be calculated for wealth held for at least 1 Hijri year</li>
                        <li>• Zakat rate is 2.5% of net wealth above nisab threshold</li>
                        <li>• Precious metal prices may fluctuate with market</li>
                        <li>• Consult Islamic scholars to ensure accuracy</li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* API Sources Information */}
                <div className={`border rounded-2xl p-4 transition-colors duration-300 ${
                  isDarkMode 
                    ? 'bg-green-900/30 border-green-700/50' 
                    : 'bg-green-50 border-green-200'
                }`}>
                  <div className="flex items-start gap-2">
                    <Info className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <div className={`text-sm ${
                      isDarkMode ? 'text-green-200' : 'text-green-800'
                    }`}>
                      <p className="font-medium mb-2">Data Sources:</p>
                      <ul className="space-y-1 text-xs">
                        <li>• Gold/Silver Prices: metals.live API</li>
                        <li>• Automatically tries multiple API sources</li>
                        <li>• Uses fallback prices if API unavailable</li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Detailed Breakdown Button */}
                <button
                  onClick={() => setShowDetails(!showDetails)}
                  className={`w-full py-3 rounded-2xl border-2 transition-all duration-200 font-medium ${
                    isDarkMode
                      ? 'text-emerald-400 border-emerald-600 hover:border-emerald-500 hover:bg-emerald-600/10'
                      : 'text-emerald-600 border-emerald-300 hover:border-emerald-400 hover:bg-emerald-50'
                  } transform active:scale-98`}
                >
                  {showDetails ? 'Hide details' : 'Show calculation details'}
                </button>

                {/* Detailed Breakdown */}
                {showDetails && (
                  <div className="rounded-2xl p-4 space-y-3 text-sm transition-colors duration-300 bg-gray-700">
                    <h4 className="font-semibold text-gray-200">
                      Calculation Details:
                    </h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-300">Cash:</span>
                        <span className="font-medium text-white">{formatCompactUSD(assets.cash)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-300">Savings:</span>
                        <span className="font-medium text-white">{formatCompactUSD(assets.bankSavings)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-300">
                          Gold ({goldSilverWeight.goldGrams}g):
                        </span>
                        <span className="font-medium text-white">{formatCompactUSD(goldValueUSD)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-300">
                          Silver ({goldSilverWeight.silverGrams}g):
                        </span>
                        <span className="font-medium text-white">{formatCompactUSD(silverValueUSD)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-300">Other gold/silver:</span>
                        <span className="font-medium text-white">{formatCompactUSD(assets.gold)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-300">Investments:</span>
                        <span className="font-medium text-white">{formatCompactUSD(assets.investments)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-300">Business:</span>
                        <span className="font-medium text-white">{formatCompactUSD(assets.business)}</span>
                      </div>
                      <div className="border-t pt-2 border-gray-600">
                        <div className="flex justify-between font-medium">
                          <span className="text-gray-300">Total Assets:</span>
                          <span className="text-emerald-400">{formatCompactUSD(totalAssets)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-300">Less Debts:</span>
                          <span className="text-red-400">-{formatCompactUSD(assets.debts)}</span>
                        </div>
                        <div className="flex justify-between font-semibold border-t pt-2 border-gray-600">
                          <span className="text-gray-300">Net Wealth:</span>
                          <span className="text-emerald-400 text-lg">{formatCompactUSD(netWealth)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Quick Summary Card for Mobile */}
            <div className="lg:hidden mt-6">
              <div className={`sticky bottom-4 rounded-2xl p-4 shadow-lg border-2 transition-all duration-300 ${
                isEligible 
                  ? 'bg-emerald-500 text-white border-emerald-400' 
                  : isDarkMode
                    ? 'bg-gray-700 text-gray-300 border-gray-600'
                    : 'bg-white text-gray-600 border-gray-300'
              }`}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm opacity-90">
                      {isEligible ? 'Zakat Due:' : 'Not eligible for Zakat'}
                    </p>
                    <p className="text-xl font-bold">
                      {formatCompactUSD(zakatAmount)}
                    </p>
                  </div>
                  {isEligible && (
                    <Star className="w-8 h-8 animate-pulse" />
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ZakatCalculator;