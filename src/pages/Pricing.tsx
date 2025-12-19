import React from 'react';
import { Link } from 'react-router-dom';
import { Check, Music, Mic2, Headphones, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const Pricing: React.FC = () => {
  const pricingPlans = [
    {
      name: 'Hourly Session',
      price: '$100',
      period: 'per hour',
      description: 'Perfect for quick recordings and demos',
      features: [
        'Professional recording equipment',
        'Experienced sound engineer',
        'Basic mixing included',
        'High-quality audio files',
        'Flexible scheduling'
      ],
      icon: Clock,
      popular: false
    },
    {
      name: 'Half Day Package',
      price: '$450',
      period: '4 hours',
      description: 'Ideal for EP recordings and serious projects',
      features: [
        'Everything in Hourly Session',
        'Advanced mixing & mastering',
        'Multiple takes and revisions',
        'Instrument rental included',
        'Complimentary refreshments',
        'Priority booking'
      ],
      icon: Music,
      popular: true
    },
    {
      name: 'Full Day Package',
      price: '$800',
      period: '8 hours',
      description: 'Complete production experience for albums',
      features: [
        'Everything in Half Day Package',
        'Full album production support',
        'Unlimited revisions',
        'Professional consultation',
        'Post-production services',
        'Digital distribution guidance',
        'Marketing materials support'
      ],
      icon: Mic2,
      popular: false
    }
  ];

  const additionalServices = [
    {
      name: 'Mixing & Mastering',
      price: '$150',
      description: 'Professional mixing and mastering for your tracks',
      icon: Headphones
    },
    {
      name: 'Beat Production',
      price: '$200',
      description: 'Custom beat creation tailored to your style',
      icon: Music
    },
    {
      name: 'Vocal Coaching',
      price: '$80',
      description: 'One-on-one vocal training session',
      icon: Mic2
    }
  ];

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12 animate-fadeInDown">
          <h1 className="text-4xl xl:text-6xl font-bold text-foreground mb-4">
            Studio Pricing
          </h1>
          <p className="text-lg xl:text-xl text-muted-foreground max-w-3xl mx-auto">
            Choose the perfect package for your recording needs. All packages include professional equipment and experienced engineers.
          </p>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 xl:gap-8 mb-16">
          {pricingPlans.map((plan, index) => (
            <Card
              key={plan.name}
              className={`relative overflow-hidden hover:shadow-xl transition-all duration-500 animate-fadeInUp animation-delay-${index * 200} ${
                plan.popular ? 'border-primary border-2' : ''
              }`}
            >
              {plan.popular && (
                <div className="absolute top-0 right-0 bg-primary text-primary-foreground px-4 py-1 text-sm font-semibold">
                  Most Popular
                </div>
              )}
              <CardHeader className="text-center pb-8 pt-8">
                <div className="mx-auto mb-4 w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                  <plan.icon className="h-8 w-8 text-primary" />
                </div>
                <CardTitle className="text-2xl mb-2">{plan.name}</CardTitle>
                <div className="mb-2">
                  <span className="text-4xl font-bold text-foreground">{plan.price}</span>
                  <span className="text-muted-foreground ml-2">/ {plan.period}</span>
                </div>
                <p className="text-muted-foreground">{plan.description}</p>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 mb-6">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <Check className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                      <span className="text-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Link to="/contact">
                  <Button
                    className={`w-full hover:scale-105 transition-transform duration-300 ${
                      plan.popular ? '' : 'variant-outline'
                    }`}
                    variant={plan.popular ? 'default' : 'outline'}
                    size="lg"
                  >
                    Book Now
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mb-16 animate-fadeInUp animation-delay-600">
          <h2 className="text-3xl xl:text-5xl font-bold text-foreground mb-4 text-center">
            Additional Services
          </h2>
          <p className="text-muted-foreground text-center mb-8 max-w-2xl mx-auto">
            Enhance your recording experience with our professional add-on services
          </p>
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            {additionalServices.map((service, index) => (
              <Card
                key={service.name}
                className={`hover:shadow-xl transition-all duration-500 animate-scaleIn animation-delay-${(index + 8) * 200}`}
              >
                <CardContent className="p-6 text-center">
                  <div className="mx-auto mb-4 w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center">
                    <service.icon className="h-7 w-7 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">
                    {service.name}
                  </h3>
                  <p className="text-muted-foreground mb-4">{service.description}</p>
                  <p className="text-2xl font-bold text-primary">{service.price}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <div className="bg-card rounded-lg border border-border p-8 xl:p-12 text-center animate-fadeInUp animation-delay-1000">
          <h2 className="text-3xl xl:text-4xl font-bold text-foreground mb-4">
            Need a Custom Package?
          </h2>
          <p className="text-muted-foreground text-lg mb-8 max-w-2xl mx-auto">
            We understand every project is unique. Contact us to discuss a custom package tailored to your specific needs and budget.
          </p>
          <div className="flex flex-col xl:flex-row gap-4 justify-center">
            <Link to="/contact">
              <Button size="lg" className="w-full xl:w-auto hover:scale-105 transition-transform duration-300">
                Contact Us
              </Button>
            </Link>
            <Link to="/studio">
              <Button size="lg" variant="outline" className="w-full xl:w-auto hover:scale-105 transition-transform duration-300">
                View Studio
              </Button>
            </Link>
          </div>
        </div>

        <div className="mt-12 p-6 bg-muted/50 rounded-lg animate-fadeInUp animation-delay-1000">
          <h3 className="text-xl font-semibold text-foreground mb-4 text-center">
            Booking Information
          </h3>
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 text-muted-foreground">
            <div>
              <h4 className="font-semibold text-foreground mb-2">Cancellation Policy</h4>
              <p>Free cancellation up to 48 hours before your session. Late cancellations may incur a 50% fee.</p>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-2">Payment Terms</h4>
              <p>50% deposit required to secure booking. Remaining balance due on the day of recording.</p>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-2">What to Bring</h4>
              <p>Your instruments, lyrics, and creative vision. We provide all recording equipment and technical support.</p>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-2">Studio Hours</h4>
              <p>Monday - Sunday, 9:00 AM - 10:00 PM. Extended hours available by arrangement.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Pricing;
