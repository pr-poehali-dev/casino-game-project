import Layout from '@/components/Layout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';

export default function CardPage() {
  const { toast } = useToast();

  const handleCardOrder = () => {
    window.open('YOUR_REFERRAL_LINK_HERE', '_blank');
    toast({
      title: 'Переход на оформление карты',
      description: 'После оформления вам будет начислено 500₽ бонусов',
    });
  };

  return (
    <Layout>
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-gradient">Оформи карту</h1>
          <p className="text-muted-foreground text-lg">
            Получи 500₽ бонусов на свой счет после оформления карты
          </p>
        </div>

        <Card className="p-8 space-y-6">
          <div className="aspect-video gradient-purple-pink-orange rounded-lg flex items-center justify-center">
            <Icon name="CreditCard" size={96} className="text-white opacity-90" />
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-bold">Преимущества карты:</h2>
            <ul className="space-y-3">
              {[
                'Бесплатное обслуживание',
                'Кэшбэк до 10% на все покупки',
                'Моментальное оформление онлайн',
                '500₽ бонусов на счет в Rocket Queen',
              ].map((item, index) => (
                <li key={index} className="flex items-start gap-3">
                  <Icon name="CheckCircle" className="text-primary mt-1 flex-shrink-0" size={20} />
                  <span className="text-foreground">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <Button
            className="w-full h-14 text-lg font-bold"
            onClick={handleCardOrder}
          >
            <Icon name="CreditCard" className="mr-2" size={24} />
            Оформить карту
          </Button>

          <p className="text-xs text-muted-foreground text-center">
            После успешного оформления карты бонусы автоматически зачислятся на ваш бонусный баланс
          </p>
        </Card>

        <Card className="p-6 bg-primary/10 border-primary/20">
          <div className="flex items-start gap-4">
            <Icon name="Info" className="text-primary flex-shrink-0 mt-1" size={24} />
            <div className="space-y-2">
              <h3 className="font-semibold text-primary">Как это работает?</h3>
              <p className="text-sm text-muted-foreground">
                Нажмите кнопку "Оформить карту" и заполните заявку на сайте банка. 
                После одобрения и активации карты бонусы поступят на ваш счет в течение 24 часов.
              </p>
            </div>
          </div>
        </Card>
      </div>
    </Layout>
  );
}
