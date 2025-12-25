import React from 'react';
import { Link } from 'react-router-dom';
import { Music, Mic2, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

const Home: React.FC = () => {
  console.log('Home: Rendering Home component...');
  
  const features = [
    {
      icon: Music,
      title: 'Original Music',
      description: 'Stream our latest tracks and albums',
      link: '/music',
      image: '/images/hymns-studio3.jpeg'
    },
    {
      icon: Mic2,
      title: 'Professional Studio',
      description: 'Book our state-of-the-art recording studio',
      link: '/studio',
      image: '/images/hymns-studio.jpeg'
    }
  ];

  return (
    <div className="min-h-screen">
      <section className="relative h-[70vh] xl:h-[80vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background/80 to-background z-10" />
        <img
          src="/images/hymns-hero-home.png"
          alt="HYMNS Hero"
          className="absolute inset-0 w-full h-full object-cover animate-fadeIn"
        />
        <div className="relative z-20 text-center px-4 max-w-4xl mx-auto">
          <h1 className="text-4xl xl:text-7xl font-bold text-foreground mb-4 xl:mb-6 animate-fadeInUp">
            Welcome to HYMNS
          </h1>
          <p className="text-lg xl:text-2xl text-muted-foreground mb-6 xl:mb-8 animate-fadeInUp animation-delay-200">
            Where Music Meets Fashion
          </p>
          <div className="flex flex-col xl:flex-row gap-4 justify-center animate-fadeInUp animation-delay-400">
            <Link to="/music">
              <Button size="lg" className="w-full xl:w-auto">
                Explore Music
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link to="/store">
              <Button size="lg" variant="outline" className="w-full xl:w-auto">
                Shop Now
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="py-12 xl:py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 animate-fadeInUp">
            <h2 className="text-3xl xl:text-5xl font-bold text-blue-600 mb-4">
              What We Offer
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Discover the world of HYMNS through our music and professional studio services
            </p>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 xl:gap-8 max-w-5xl mx-auto">
            {features.map((feature, index) => (
              <Link key={feature.title} to={feature.link}>
                <Card className={`overflow-hidden group hover:shadow-xl transition-all duration-500 h-full animate-fadeInUp animation-delay-${(index + 2) * 200}`}>
                  <div className="aspect-video overflow-hidden bg-muted">
                    <img
                      src={feature.image}
                      alt={feature.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                  <CardContent className="p-6">
                    <feature.icon className="h-10 w-10 text-primary mb-4 group-hover:animate-float" />
                    <h3 className="text-xl font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                      {feature.title}
                    </h3>
                    <p className="text-muted-foreground mb-4">
                      {feature.description}
                    </p>
                    <Button variant="ghost" className="p-0 group-hover:translate-x-2 transition-transform">
                      Learn More
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 xl:py-20 px-4 bg-muted/50">
        <div className="max-w-4xl mx-auto text-center animate-fadeInUp">
          <h2 className="text-3xl xl:text-5xl font-bold text-white mb-6">
            Join the HYMNS Community
          </h2>
          <p className="text-white text-lg mb-8 animate-fadeInUp animation-delay-200">
            Stay connected with us through our social channels and be the first to know about new releases, studio sessions, and exclusive merchandise drops.
          </p>
          <Link to="/contact">
            <Button size="lg" className="animate-fadeInUp animation-delay-400">
              Get in Touch
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
