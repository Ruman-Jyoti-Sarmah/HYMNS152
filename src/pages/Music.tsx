import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Play } from 'lucide-react';

const Music: React.FC = () => {
  const youtubeChannelUrl = 'https://youtube.com/@hymnmusic-vs2hv?si=FqEoejVatLYc3lpr';
  
  // Music data array - easy to update by editing this array only
  const musicItems = [
    {
      id: '1',
      title: 'NEON LIGHTS',
      artist: 'HYMNS',
      description: 'A vibrant track that captures the energy of city nightlife',
      videoId: 'ersn2TyVf5s', 
      youtubeUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
    },
    {
      id: '2',
      title: 'MIDNIGHT DREAMS',
      artist: 'HYMNS',
      description: 'Smooth melodies for late-night contemplation',
      videoId: 'TQeDesPD3U4', 
      youtubeUrl: 'https://www.youtube.com/watch?v=YQHsXMglC9A'
    },
    {
      id: '3',
      title: 'URBAN ECHOES',
      artist: 'HYMNS',
      description: 'The sound of the city captured in music',
      videoId: 'VKnzxZkQCsg', 
      youtubeUrl: 'https://www.youtube.com/watch?v=kJQP7kiw5Fk'
    },
    {
      id: '4',
      title: 'SILENT WAVES',
      artist: 'HYMNS',
      description: 'Calm and meditative soundscapes',
      videoId: 'qMyD8n5gZkM', 
      youtubeUrl: 'https://www.youtube.com/watch?v=JGwWNGJdvx8'
    }
  ];

  const platforms = [
    { name: 'Spotify', url: 'https://spotify.com' },
    { name: 'Apple Music', url: 'https://music.apple.com' },
    { name: 'YouTube Music', url: youtubeChannelUrl },
    { name: 'SoundCloud', url: 'https://soundcloud.com' }
  ];

  // Helper function to get YouTube thumbnail URL
  const getYouTubeThumbnail = (videoId: string) => {
    return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
  };

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-12 animate-fadeInDown">
          <h1 className="text-4xl xl:text-6xl font-bold text-black mb-4">
            Explore Our Music
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl">
            Watch our music videos and immerse yourself in the HYMNS sound. Click any video to visit our YouTube channel.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 xl:gap-8 mb-12">
          {musicItems.map((item, index) => (
            <a
              key={item.id}
              href={item.youtubeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={`group animate-fadeInUp animation-delay-${index * 200}`}
            >
              <Card className="overflow-hidden hover:shadow-xl transition-all duration-500 hover:scale-105">
                <div className="relative aspect-video overflow-hidden bg-muted">
                  <img
                    src={getYouTubeThumbnail(item.videoId)}
                    alt={`${item.artist} - ${item.title}`}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    onError={(e) => {
                      // Fallback to a default image if YouTube thumbnail fails to load
                      e.currentTarget.src = 'https://img.youtube.com/vi/default/maxresdefault.jpg';
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent transition-colors duration-300" />
                  <div className="absolute bottom-4 left-4 right-4 text-white">
                    <h3 className="text-lg xl:text-xl font-bold mb-1 line-clamp-1">
                      {item.title}
                    </h3>
                    <p className="text-sm text-white/90 mb-2">{item.artist}</p>
                    <p className="text-xs text-white/80 line-clamp-2">
                      {item.description}
                    </p>
                  </div>
                  <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors duration-300 flex items-center justify-center">
                    <div className="w-16 h-16 xl:w-20 xl:h-20 rounded-full bg-primary/90 group-hover:bg-primary flex items-center justify-center transition-all duration-300 group-hover:scale-110 animate-pulse-slow">
                      <Play className="w-8 h-8 xl:w-10 xl:h-10 text-primary-foreground ml-1" fill="currentColor" />
                    </div>
                  </div>
                </div>
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
