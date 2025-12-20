import React from 'react';
import { Music, Shirt, Mic2, Heart } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const About: React.FC = () => {
  const values = [
    {
      icon: Music,
      title: 'Original Sound',
      description: 'We create authentic music that resonates with our audience and pushes creative boundaries.'
    },
    {
      icon: Shirt,
      title: 'Fashion Forward',
      description: 'Our merchandise reflects contemporary style and quality craftsmanship.'
    },
    {
      icon: Mic2,
      title: 'Professional Excellence',
      description: 'Our studio services meet the highest industry standards for recording and production.'
    },
    {
      icon: Heart,
      title: 'Community Driven',
      description: 'We build meaningful connections with our audience and support creative expression.'
    }
  ];

  return (
    <div className="min-h-screen">
      <section className="py-12 xl:py-20 px-4">
        <div className="max-w-4xl mx-auto text-center mb-16">
          <h1 className="text-4xl xl:text-6xl font-bold text-black mb-6">
            About HYMNS
          </h1>
          <p className="text-lg xl:text-xl text-muted-foreground leading-relaxed">
            HYMNS is more than just a music and fashion brand. We're a creative collective dedicated to producing original music, offering professional studio services, and creating premium merchandise that represents our artistic vision.
          </p>
        </div>

        <div className="max-w-7xl mx-auto mb-16">
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 xl:gap-12 items-center">
            <div className="aspect-video xl:aspect-square overflow-hidden rounded-lg bg-muted">
              <img
                src="https://miaoda-site-img.s3cdn.medo.dev/images/4c854257-4b94-4d3f-a2f0-ed1924d89c6e.jpg"
                alt="HYMNS Team"
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h2 className="text-3xl xl:text-4xl font-bold text-black mb-6">
                Our Story
              </h2>
              <div className="space-y-4 text-muted-foreground">
                <p>
                  Founded with a passion for music and design, HYMNS emerged from a desire to create a space where sound and style intersect. What started as a small recording project has grown into a full-fledged creative company.
                </p>
                <p>
                  Today, we produce original music that spans multiple genres, operate a state-of-the-art recording studio, and design merchandise that our community is proud to wear. Every aspect of HYMNS reflects our commitment to quality and authenticity.
                </p>
                <p>
                  We believe in the power of creative expression and strive to provide the tools, services, and products that help artists and music lovers bring their visions to life.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto mb-16">
          <h2 className="text-3xl xl:text-5xl font-bold text-black mb-12 text-center">
            Our Values
          </h2>
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            {values.map((value) => (
              <Card key={value.title} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <value.icon className="h-12 w-12 text-primary mb-4" />
                  <h3 className="text-xl font-semibold text-foreground mb-3">
                    {value.title}
                  </h3>
                  <p className="text-muted-foreground">
                    {value.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 xl:gap-12 items-center">
            <div className="order-2 xl:order-1">
              <h2 className="text-3xl xl:text-4xl font-bold text-black mb-6">
                Join Our Journey
              </h2>
              <p className="text-muted-foreground mb-6">
                Whether you're here for the music, looking to book studio time, or shopping for exclusive merchandise, you're part of the HYMNS community. We're constantly evolving and creating, and we invite you to be part of our story.
              </p>
              <p className="text-muted-foreground">
                Follow us on social media, stream our music, and wear our brand with pride. Together, we're building something special.
              </p>
            </div>
            <div className="aspect-video xl:aspect-square overflow-hidden rounded-lg bg-muted order-1 xl:order-2">
              <img
                src="https://miaoda-site-img.s3cdn.medo.dev/images/e8cd1427-0514-4c04-84cc-866d0496d99a.jpg"
                alt="HYMNS Community"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
