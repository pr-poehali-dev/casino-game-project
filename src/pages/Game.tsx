import { useState, useEffect, useRef } from 'react';
import Layout from '@/components/Layout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';

export default function Game() {
  const { toast } = useToast();
  const [balance, setBalance] = useState({ main: 10000, bonus: 0 });
  const [betAmount, setBetAmount] = useState(0.2);
  const [autoCashout, setAutoCashout] = useState(2.0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentMultiplier, setCurrentMultiplier] = useState(1.0);
  const [crashPoint, setCrashPoint] = useState<number | null>(null);
  const [gameState, setGameState] = useState<'waiting' | 'flying' | 'crashed'>('waiting');
  const [hasCashedOut, setHasCashedOut] = useState(false);
  const animationRef = useRef<number>();

  const generateCrashPoint = (): number => {
    const random = Math.random();
    if (random < 0.6) {
      return 1 + Math.random() * 0.5;
    }
    return 1 + Math.random() * 9;
  };

  const startGame = () => {
    if (betAmount > balance.main) {
      toast({
        title: 'Недостаточно средств',
        description: 'Пополните баланс для продолжения игры',
        variant: 'destructive',
      });
      return;
    }

    setBalance((prev) => ({ ...prev, main: prev.main - betAmount }));
    setIsPlaying(true);
    setHasCashedOut(false);
    setGameState('waiting');

    setTimeout(() => {
      const crash = generateCrashPoint();
      setCrashPoint(crash);
      setGameState('flying');
      setCurrentMultiplier(1.0);

      const startTime = Date.now();
      const duration = crash * 2000;

      const animate = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const multiplier = 1 + progress * (crash - 1);

        setCurrentMultiplier(multiplier);

        if (multiplier >= autoCashout && !hasCashedOut) {
          cashOut(autoCashout);
          return;
        }

        if (progress < 1) {
          animationRef.current = requestAnimationFrame(animate);
        } else {
          setGameState('crashed');
          setIsPlaying(false);
          if (!hasCashedOut) {
            toast({
              title: 'Проигрыш',
              description: `Ракета упала на ${crash.toFixed(2)}x`,
              variant: 'destructive',
            });
          }
        }
      };

      animationRef.current = requestAnimationFrame(animate);
    }, 2000);
  };

  const cashOut = (multiplier?: number) => {
    if (hasCashedOut || gameState !== 'flying') return;

    const finalMultiplier = multiplier || currentMultiplier;
    const winAmount = betAmount * finalMultiplier;

    setHasCashedOut(true);
    setIsPlaying(false);
    setBalance((prev) => ({ ...prev, main: prev.main + winAmount }));

    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }

    toast({
      title: 'Выигрыш! 🎉',
      description: `Вы выиграли ${winAmount.toFixed(2)}$ с множителем ${finalMultiplier.toFixed(2)}x`,
    });

    setTimeout(() => {
      setGameState('waiting');
      setCrashPoint(null);
    }, 2000);
  };

  useEffect(() => {
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  const quickBetButtons = [5, 25, 50, 100];

  return (
    <Layout>
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Card className="px-4 py-2 flex items-center gap-2 bg-card/50">
              <Icon name="Wallet" className="text-primary" size={20} />
              <span className="text-lg font-semibold">{balance.main.toFixed(2)} $</span>
            </Card>
            {balance.bonus > 0 && (
              <Card className="px-4 py-2 flex items-center gap-2 bg-accent/20">
                <Icon name="Gift" className="text-accent" size={20} />
                <span className="text-sm">Бонус: {balance.bonus.toFixed(2)} $</span>
              </Card>
            )}
          </div>

          <div className="flex gap-2">
            <Button variant="outline" size="icon">
              <Icon name="MessageCircle" size={20} />
            </Button>
            <Button variant="outline" size="icon">
              <Icon name="Users" size={20} />
            </Button>
            <Button variant="outline" size="icon">
              <Icon name="Settings" size={20} />
            </Button>
          </div>
        </div>

        <Card className="aspect-video gradient-purple-pink-orange p-8 flex items-center justify-center relative overflow-hidden">
          {gameState === 'waiting' && (
            <div className="text-center text-white">
              <Icon name="Sparkles" className="mx-auto mb-4 animate-pulse" size={48} />
              <h2 className="text-3xl font-bold mb-2">ОЖИДАНИЕ</h2>
              <h3 className="text-xl">СЛЕДУЮЩЕГО РАУНДА</h3>
              <div className="mt-4 h-1 w-48 mx-auto bg-white/20 rounded-full overflow-hidden">
                <div className="h-full bg-white/80 rounded-full w-1/2 animate-pulse"></div>
              </div>
            </div>
          )}

          {gameState === 'flying' && (
            <div className="text-center text-white relative">
              <div className="absolute -top-20 left-1/2 -translate-x-1/2">
                <img
                  src="https://cdn.poehali.dev/files/577968f4-fa00-452c-a17d-c9c9730ee0fb.png"
                  alt="Rocket Queen"
                  className="w-64 h-64 object-contain animate-bounce"
                />
              </div>
              <div className="mt-48">
                <h2 className="text-6xl font-bold mb-2">x{currentMultiplier.toFixed(2)}</h2>
              </div>
            </div>
          )}

          {gameState === 'crashed' && (
            <div className="text-center text-white">
              <Icon name="Flame" className="mx-auto mb-4 text-destructive" size={64} />
              <h2 className="text-4xl font-bold mb-2">КРАХ</h2>
              <h3 className="text-2xl">x{crashPoint?.toFixed(2)}</h3>
            </div>
          )}

          <div className="absolute top-4 right-4 flex gap-2">
            {[1, 2, 3].map((i) => (
              <Icon key={i} name="Sparkles" className="text-yellow-300 animate-pulse" size={24} />
            ))}
          </div>
        </Card>

        <div className="grid md:grid-cols-2 gap-4">
          <Card className="p-6 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Автоставка</span>
              <span className="text-sm font-semibold">x {autoCashout.toFixed(2)}</span>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setBetAmount((prev) => Math.max(0.1, prev - 0.1))}
              >
                <Icon name="Minus" size={18} />
              </Button>
              <div className="flex-1 text-center">
                <Input
                  type="number"
                  value={betAmount}
                  onChange={(e) => setBetAmount(parseFloat(e.target.value) || 0)}
                  className="text-center text-lg font-semibold"
                  step="0.1"
                  min="0.1"
                />
              </div>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setBetAmount((prev) => prev + 0.1)}
              >
                <Icon name="Plus" size={18} />
              </Button>
            </div>

            <div className="grid grid-cols-4 gap-2">
              {quickBetButtons.map((amount) => (
                <Button
                  key={amount}
                  variant="outline"
                  size="sm"
                  onClick={() => setBetAmount((prev) => prev + amount)}
                >
                  +{amount}
                </Button>
              ))}
            </div>

            <Button
              className="w-full h-14 text-lg font-bold"
              onClick={gameState === 'flying' && !hasCashedOut ? () => cashOut() : startGame}
              disabled={isPlaying && gameState !== 'flying'}
            >
              {gameState === 'flying' && !hasCashedOut ? 'ЗАБРАТЬ' : 'СТАВКА'}
            </Button>
          </Card>

          <Card className="p-6 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Автовывод</span>
              <span className="text-sm font-semibold">x {autoCashout.toFixed(2)}</span>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setAutoCashout((prev) => Math.max(1.1, prev - 0.1))}
              >
                <Icon name="Minus" size={18} />
              </Button>
              <div className="flex-1 text-center">
                <Input
                  type="number"
                  value={autoCashout}
                  onChange={(e) => setAutoCashout(parseFloat(e.target.value) || 1.1)}
                  className="text-center text-lg font-semibold"
                  step="0.1"
                  min="1.1"
                />
              </div>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setAutoCashout((prev) => prev + 0.1)}
              >
                <Icon name="Plus" size={18} />
              </Button>
            </div>

            <div className="grid grid-cols-4 gap-2">
              {quickBetButtons.map((amount) => (
                <Button
                  key={amount}
                  variant="outline"
                  size="sm"
                  onClick={() => setAutoCashout((prev) => prev + amount)}
                >
                  +{amount}
                </Button>
              ))}
            </div>

            <Button className="w-full h-14 text-lg font-bold" disabled={isPlaying}>
              СТАВКА
            </Button>
          </Card>
        </div>

        <Card className="p-4">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Ставок: 112</span>
            <div className="flex gap-2">
              <Button variant="ghost" size="sm">
                <Icon name="HelpCircle" size={16} />
              </Button>
              <Button variant="ghost" size="sm">
                1.15x
              </Button>
              <Button variant="default" size="sm">
                22.09x
              </Button>
              <Button variant="ghost" size="sm">
                1.63x
              </Button>
              <Button variant="ghost" size="sm">
                <Icon name="Clock" size={16} />
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </Layout>
  );
}
