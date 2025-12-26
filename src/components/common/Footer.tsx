import React from "react";
import { Instagram, Facebook, Youtube, Music } from "lucide-react";
import { Button } from "@/components/ui/button";

const Footer: React.FC = () => {
  console.log('Footer: Rendering Footer component...');
  
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    { icon: Instagram, href: "https://instagram.com", label: "Instagram" },
    { icon: Facebook, href: "https://facebook.com", label: "Facebook" },
    { icon: Youtube, href: "https://youtube.com", label: "YouTube" },
    { icon: Music, href: "https://spotify.com", label: "Spotify" }
  ];

  return (
    <footer style={{
      backgroundImage: 'url(/images/hymns-footer.png)',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
      backgroundColor: '#0d0d0d',
      borderTop: '2px solid #000000'
    }}>
      <div className="max-w-7xl mx-auto py-12 px-4 xl:px-8">
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 xl:gap-12">
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-4">
              About HYMNS
            </h3>
            <p className="text-black text-sm leading-relaxed">
              A music and fashion creative company offering original songs, professional studio services, and branded merchandise. Experience the fusion of sound and style.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-foreground mb-4">
              Quick Links
            </h3>
            <div className="space-y-2 text-sm">
              <p className="text-black">Music Streaming</p>
              <p className="text-black">Studio Booking</p>
              <p className="text-black">Merchandise Store</p>
              <p className="text-black">Contact Us</p>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-foreground mb-4">
              Follow Us
            </h3>
            <div className="flex gap-2">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                >
                  <Button variant="outline" size="icon">
                    <social.icon className="h-4 w-4" />
                  </Button>
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-border text-center">
          <p className="text-sm text-muted-foreground">
            {currentYear} HYMNS
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
