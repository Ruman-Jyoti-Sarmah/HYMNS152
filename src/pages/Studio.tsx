import React from 'react';
import { Clock, Users, Mic, Headphones, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Link } from 'react-router-dom';

const Studio: React.FC = () => {
  const features = [
    { icon: Mic, text: 'Professional Recording Equipment' },
    { icon: Headphones, text: 'Acoustic Treatment & Soundproofing' },
    { icon: Users, text: 'Experienced Sound Engineers' },
    { icon: Clock, text: 'Flexible Booking Hours' }
  ];

  const services = [
    {
      title: 'Recording Sessions',
      description: 'Full-day or half-day recording sessions with professional equipment',
      price: 'From ₹150/hour'
    },
    {
      title: 'Mixing & Mastering',
      description: 'Professional mixing and mastering services for your tracks',
      price: 'From ₹200/track'
    },
    {
      title: 'Production',
      description: 'Complete music production from concept to final master',
      price: 'Custom pricing'
    }
  ];

  const studioImages = [
    'https://miaoda-site-img.s3cdn.medo.dev/images/9a82b266-d14f-4125-9809-b8f1d790ff7b.jpg',
    'https://miaoda-site-img.s3cdn.medo.dev/images/333b4625-0de3-4e80-89a3-fb38a9c9eec2.jpg',
    'https://miaoda-site-img.s3cdn.medo.dev/images/3151457a-cf2f-4255-afda-a2a263eb55a2.jpg',
    'https://miaoda-site-img.s3cdn.medo.dev/images/153f309f-08a8-46da-94b7-52d47db312a3.jpg'
  ];

  return (
    <div className="min-h-screen">
      <section className="relative h-[60vh] xl:h-[70vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/80 to-background z-10" />
        <img
          src="https://miaoda-site-img.s3cdn.medo.dev/images/9a82b266-d14f-4125-9809-b8f1d790ff7b.jpg"
          alt="HYMNS Studio"
          className="absolute inset-0 w-full h-full object-cover animate-fadeIn"
        />
        <div className="relative z-20 text-center px-4 max-w-4xl mx-auto">
          <h1 className="text-4xl xl:text-7xl font-bold text-foreground mb-4 xl:mb-6 animate-fadeInUp">
            HYMNS Studio
          </h1>
          <p className="text-lg xl:text-2xl text-muted-foreground mb-6 xl:mb-8 animate-fadeInUp animation-delay-200">
            Professional Recording Studio for Your Creative Vision
          </p>
          <Link to="/contact">
            <Button size="lg" className="animate-fadeInUp animation-delay-400 hover:scale-105 transition-transform duration-300">
              Book a Session
            </Button>
          </Link>
        </div>
      </section>

      <section className="py-12 xl:py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 xl:gap-12 items-center mb-16">
            <div className="animate-fadeInLeft">
              <h2 className="text-3xl xl:text-5xl font-bold text-foreground mb-6">
                State-of-the-Art Facilities
              </h2>
              <p className="text-muted-foreground text-lg mb-6">
                Our studio is equipped with industry-leading technology and designed to bring out the best in your music. From recording to mixing and mastering, we provide a complete production environment.
              </p>
              <div className="space-y-4">
                {features.map((feature, index) => (
                  <div key={feature.text} className={`flex items-center gap-3 animate-fadeInLeft animation-delay-${(index + 2) * 200}`}>
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center hover:bg-primary/20 transition-colors">
                      <feature.icon className="h-5 w-5 text-primary" />
                    </div>
                    <span className="text-foreground">{feature.text}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 animate-fadeInRight">
              {studioImages.map((image, index) => (
                <div
                  key={index}
                  className={`aspect-square overflow-hidden rounded-lg bg-muted animate-scaleIn animation-delay-${(index + 6) * 200}`}
                >
                  <img
                    src={image}
                    alt={`Studio ${index + 1}`}
                    className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="mb-16">
            <h2 className="text-3xl xl:text-5xl font-bold text-foreground mb-8 text-center animate-fadeInUp">
              Our Services
            </h2>
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
              {services.map((service, index) => (
                <Card key={service.title} className={`hover:shadow-xl transition-all duration-500 animate-fadeInUp animation-delay-${(index + 2) * 200}`}>
                  <CardContent className="p-6 hover:scale-105 transition-transform duration-300">
                    <h3 className="text-xl font-semibold text-foreground mb-3">
                      {service.title}
                    </h3>
                    <p className="text-muted-foreground mb-4">
                      {service.description}
                    </p>
                    <p className="text-lg font-bold text-primary">
                      {service.price}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          <div className="bg-card rounded-lg border border-border p-8 xl:p-12 animate-fadeInUp animation-delay-600">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl xl:text-4xl font-bold text-foreground mb-4">
                Ready to Create?
              </h2>
              <p className="text-muted-foreground text-lg mb-8">
                Book your studio session today and bring your musical vision to life. Our team is ready to help you achieve professional results.
              </p>
              <div className="flex flex-col xl:flex-row gap-4 justify-center">
                <Link to="/contact">
                  <Button size="lg" className="w-full xl:w-auto hover:scale-105 transition-transform duration-300">
                    Contact Us
                  </Button>
                </Link>
                <Link to="/pricing">
                  <Button size="lg" variant="outline" className="w-full xl:w-auto hover:scale-105 transition-transform duration-300">
                    View Pricing
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Studio;
