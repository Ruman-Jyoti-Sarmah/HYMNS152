import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Play } from 'lucide-react';

const Music: React.FC = () => {
  const youtubeChannelUrl = 'https://youtube.com/@hymnmusic-vs2hv?si=gM1PatHQIPnXKU3v';
  
  const videos = [
    {
      id: '1',
      title: 'HYMNS - NEON LIGHTS',
      thumbnail: 'https://miaoda-site-img.s3cdn.medo.dev/images/ee933ec7-e900-4401-a230-8bc569e21a5d.jpg',
      url: youtubeChannelUrl
    },
    {
      id: '2',
      title: 'HYMNS - MIDNIGHT DREAMS',
      thumbnail: 'https://miaoda-site-img.s3cdn.medo.dev/images/6416e645-02c4-43e0-a8f8-e311e6fc5b1c.jpg',
      url: youtubeChannelUrl
    },
    {
      id: '3',
      title: 'HYMNS - URBAN ECHOES',
      thumbnail: 'https://miaoda-site-img.s3cdn.medo.dev/images/4c29da95-fba9-4a0a-b3b6-e5ad1e55c19e.jpg',
      url: youtubeChannelUrl
    },
    {
      id: '4',
      title: 'HYMNS - SILENT WAVES',
      thumbnail: 'https://miaoda-site-img.s3cdn.medo.dev/images/6416e645-02c4-43e0-a8f8-e311e6fc5b1c.jpg',
      url: youtubeChannelUrl
    }
  ];

  const platforms = [
    { name: 'Spotify', url: 'https://spotify.com' },
    { name: 'Apple Music', url: 'https://music.apple.com' },
    { name: 'YouTube Music', url: youtubeChannelUrl },
    { name: 'SoundCloud', url: 'https://soundcloud.com' }
  ];

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-12 animate-fadeInDown">
          <h1 className="text-4xl xl:text-6xl font-bold text-foreground mb-4">
            Explore Our Music
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl">
            Watch our music videos and immerse yourself in the HYMNS sound. Click any video to visit our YouTube channel.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 xl:gap-8 mb-12">
          {videos.map((video, index) => (
            <a
              key={video.id}
              href={video.url}
              target="_blank"
              rel="noopener noreferrer"
              className={`group animate-fadeInUp animation-delay-${index * 200}`}
            >
              <Card className="overflow-hidden hover:shadow-xl transition-all duration-500">
                <div className="relative aspect-video overflow-hidden bg-muted">
                  <img
                    src={video.thumbnail}
                    alt={video.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors duration-300 flex items-center justify-center">
                    <div className="w-16 h-16 xl:w-20 xl:h-20 rounded-full bg-primary/90 group-hover:bg-primary flex items-center justify-center transition-all duration-300 group-hover:scale-110 animate-pulse-slow">
                      <Play className="w-8 h-8 xl:w-10 xl:h-10 text-primary-foreground ml-1" fill="currentColor" />
                    </div>
                  </div>
                </div>
                <CardContent className="p-4 xl:p-6">
                  <h3 className="text-lg xl:text-xl font-bold text-foreground group-hover:text-primary transition-colors duration-300">
                    {video.title}
                  </h3>
                </CardContent>
              </Card>
            </a>
          ))}
        </div>

        <div className="text-center mb-12 animate-fadeInUp animation-delay-800">
          <a
            href={youtubeChannelUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button size="lg" className="text-lg px-8 hover:scale-105 transition-transform duration-300">
              Visit Our YouTube Channel
            </Button>
          </a>
        </div>

        <div className="mt-16 p-8 xl:p-12 bg-card rounded-lg border border-border animate-fadeInUp animation-delay-1000">
          <h2 className="text-2xl xl:text-4xl font-bold text-foreground mb-4">
            Available on All Platforms
          </h2>
          <p className="text-muted-foreground mb-6">
            Listen to HYMNS on your favorite streaming platform
          </p>
          <div className="flex flex-wrap gap-4">
            {platforms.map((platform, index) => (
              <a
                key={platform.name}
                href={platform.url}
                target="_blank"
                rel="noopener noreferrer"
                className={`animate-scaleIn animation-delay-${(index + 10) * 200}`}
              >
                <Button variant="secondary" size="lg" className="hover:scale-105 transition-transform duration-300">
                  {platform.name}
                </Button>
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Music;
