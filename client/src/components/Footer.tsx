import { Link } from "wouter";
import { Phone, Mail, MapPin, Clock, Instagram } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Footer() {
  const quickLinks = [
    { href: "/", label: "Home" },
    { href: "/products", label: "Products & Services" },
    { href: "/about", label: "About Us" },
    { href: "/gallery", label: "Gallery" },
    { href: "/contact", label: "Contact" },
    { href: "/admin/login", label: "Admin", scrollTop: true },
  ];

  return (
    <footer className="bg-card border-t mt-20">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-serif font-bold mb-4">Jain Foam & Furnishing</h3>
            <p className="text-sm text-muted-foreground leading-relaxed mb-4">
              Bhayandar's leading home décor and furnishing destination since 1995. Trusted by thousands across Bhayandar, Mira Road, and Dahisar.
            </p>
            <div className="flex items-center gap-2">
              <a
                href="https://www.instagram.com/jain_foam"
                target="_blank"
                rel="noopener noreferrer"
                data-testid="link-footer-instagram"
              >
                <Button variant="outline" size="icon" className="hover-elevate">
                  <Instagram className="w-4 h-4" />
                </Button>
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href}>
                    <span
                      className="text-sm text-muted-foreground hover:text-primary transition-colors cursor-pointer"
                      data-testid={`link-footer-${link.label.toLowerCase().replace(/\s+/g, "-")}`}
                      onClick={() => link.scrollTop && window.scrollTo(0, 0)}
                    >
                      {link.label}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Info</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0 text-primary" />
                <span className="text-muted-foreground" data-testid="text-address">
                  Shop No. 8-9, Panch Bhagini Sadan, BP Road, Opp. Vijay Punjab Hotel, Bhayandar East, Thane, Maharashtra 401105
                </span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 flex-shrink-0 text-primary" />
                <a
                  href="tel:08369051217"
                  className="text-muted-foreground hover:text-primary transition-colors"
                  data-testid="link-footer-phone"
                >
                  083690 51217
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 flex-shrink-0 text-primary" />
                <a
                  href="mailto:jainfoamf@gmail.com"
                  className="text-muted-foreground hover:text-primary transition-colors"
                  data-testid="link-footer-email"
                >
                  jainfoamf@gmail.com
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Clock className="w-4 h-4 flex-shrink-0 text-primary" />
                <span className="text-muted-foreground" data-testid="text-hours">
                  Mon-Sun: 10:00 AM - 10:00 PM
                </span>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Location</h3>
            <div className="rounded-lg overflow-hidden border h-48">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3767.0!2d72.85!3d19.30!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTnCsDE4JzAwLjAiTiA3MsKwNTEnMDAuMCJF!5e0!3m2!1sen!2sin!4v1234567890"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Jain Foam & Furnishing Location"
                data-testid="map-footer"
              />
            </div>
          </div>
        </div>

        <div className="border-t mt-8 pt-6 text-center">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Jain Foam & Furnishing. All rights reserved. | 30+ Years of Trust & Quality
          </p>
        </div>
      </div>
    </footer>
  );
}
