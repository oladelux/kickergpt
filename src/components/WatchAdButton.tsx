import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useAds } from '@/hooks/useAds';
import { Loader2, Play, Clock } from 'lucide-react';
import { ADMOB_CONFIG } from '@/lib/config';

interface WatchAdButtonProps {
  onAdWatched?: (credits: number) => void;
  variant?: 'default' | 'outline' | 'secondary';
  size?: 'default' | 'sm' | 'lg';
  className?: string;
}

export const WatchAdButton = ({
  onAdWatched,
  variant = 'default',
  size = 'default',
  className,
}: WatchAdButtonProps) => {
  const {
    watchAd,
    isWatchingAd,
    canWatchAd,
    nextAdAvailableIn,
    adsWatchedToday,
    areAdsAvailable,
  } = useAds();

  const [cooldownText, setCooldownText] = useState<string>('');

  // Update cooldown text
  useEffect(() => {
    if (!canWatchAd && nextAdAvailableIn) {
      const updateCooldown = () => {
        const minutes = Math.ceil(nextAdAvailableIn / 60000);
        setCooldownText(`Wait ${minutes}m`);
      };

      updateCooldown();
      const interval = setInterval(updateCooldown, 10000); // Update every 10 seconds

      return () => clearInterval(interval);
    } else {
      setCooldownText('');
    }
  }, [canWatchAd, nextAdAvailableIn]);

  const handleWatchAd = async () => {
    const result = await watchAd();
    if (result.success && result.credits && onAdWatched) {
      onAdWatched(result.credits);
    }
  };

  if (!areAdsAvailable) {
    return null;
  }

  const isDisabled = !canWatchAd || isWatchingAd;
  const dailyLimit = ADMOB_CONFIG.MAX_ADS_PER_DAY;
  const remainingAds = dailyLimit - adsWatchedToday;

  return (
    <div className="flex flex-col gap-2">
      <Button
        onClick={handleWatchAd}
        disabled={isDisabled}
        variant={variant}
        size={size}
        className={className}
      >
        {isWatchingAd ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Loading Ad...
          </>
        ) : cooldownText ? (
          <>
            <Clock className="mr-2 h-4 w-4" />
            {cooldownText}
          </>
        ) : (
          <>
            <Play className="mr-2 h-4 w-4" />
            Watch Ad for {ADMOB_CONFIG.CREDITS_PER_AD} Credits
          </>
        )}
      </Button>
      
      {remainingAds > 0 && remainingAds < dailyLimit && (
        <p className="text-xs text-muted-foreground text-center">
          {remainingAds} ad{remainingAds !== 1 ? 's' : ''} remaining today
        </p>
      )}
      
      {remainingAds === 0 && (
        <p className="text-xs text-muted-foreground text-center">
          Daily limit reached. Come back tomorrow!
        </p>
      )}
    </div>
  );
};

