import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, CheckCircle, Clock, Users, Truck } from "lucide-react";
import heroImage from "@assets/generated_images/Hero_living_room_showcase_416398aa.webp";
import { useEffect, useRef, useState } from "react";

export default function Home() {
  const [isVisible, setIsVisible] = useState(false);
  const statsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsVisible(true);

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("animate-slide-up");
          }
        });
      },
      { threshold: 0.1 }
    );

    if (statsRef.current) {
      observer.observe(statsRef.current);
    }

    document.querySelectorAll(".observe-slide-up").forEach((el) => {
      observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const features = [
    {
      icon: Users,
      title: "30+ Years Experience",
      description: "Trusted by thousands across Bhayandar, Mira Road & Dahisar",
    },
    {
      icon: Truck,
      title: "Same-Day Delivery",
      description: "Fast and reliable delivery service for your convenience",
    },
    {
      icon: CheckCircle,
      title: "Quality Products",
      description: "Premium mattresses, curtains, sofas & home furnishings",
    },
    {
      icon: Clock,
      title: "Open Daily",
      description: "Mon-Sun: 10:00 AM - 10:00 PM for your convenience",
    },
  ];

  const categories = [
    { name: "Mattresses", count: "50+", color: "bg-blue-100 text-blue-700" },
    { name: "Curtains", count: "100+", color: "bg-purple-100 text-purple-700" },
    { name: "Sofas", count: "30+", color: "bg-green-100 text-green-700" },
    { name: "Wallpapers", count: "200+", color: "bg-orange-100 text-orange-700" },
    { name: "Carpets", count: "75+", color: "bg-pink-100 text-pink-700" },
    { name: "Blinds", count: "40+", color: "bg-cyan-100 text-cyan-700" },
  ];

  return (
    <div className="min-h-screen">
      <section className="relative h-[600px] md:h-[700px] flex items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url(${heroImage})`,
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-black/60" />
        </div>

        <div
          className={`relative z-10 max-w-4xl mx-auto px-4 text-center transition-all duration-1000 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          <Badge className="mb-4 bg-white/20 backdrop-blur-sm text-white border-white/30" data-testid="badge-hero">
            Since 1995 - 30+ Years of Excellence
          </Badge>
          <h1 className="text-4xl md:text-6xl font-serif font-bold text-white mb-6 leading-tight" data-testid="heading-hero">
            Your One-Stop Destination for Mattresses, Curtains, Sofas & Home Furnishings.
          </h1>
          <p className="text-lg md:text-xl text-white/90 mb-8 max-w-3xl mx-auto leading-relaxed">
            Discover premium home décor essentials at Jain Foam & Furnishing — the most trusted furnishing shop in Bhayandar East for over 30 years. From luxury mattresses to custom-made sofas, wallpapers, carpets, and blinds, we help you transform your home with quality and style.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/products" onClick={() => window.scrollTo(0, 0)}>
              <Button
                size="lg"
                className="bg-white/90 backdrop-blur-sm text-foreground hover:bg-white border-2 border-white/50"
                data-testid="button-explore-products"
              >
                Explore Products
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <Link href="/contact" onClick={() => window.scrollTo(0, 0)}>
              <Button
                size="lg"
                className="bg-white text-gray-900 hover:bg-gray-100 border-2 border-white"
                data-testid="button-contact-us"
              >
                Contact Us
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="py-16 bg-background" ref={statsRef}>
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card
                  key={index}
                  className="hover-elevate active-elevate-2 transition-all duration-300 observe-slide-up opacity-0"
                  style={{ animationDelay: `${index * 100}ms` }}
                  data-testid={`card-feature-${index}`}
                >
                  <CardContent className="p-6">
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                      <Icon className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-20 bg-muted/30 observe-slide-up opacity-0">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-serif font-bold mb-4" data-testid="heading-categories">
              Our Product Categories
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Explore our wide range of premium home furnishing products
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map((category, index) => (
              <Link key={index} href={`/gallery?filter=${category.name}`} onClick={() => window.scrollTo(0, 0)}>
                <Card
                  className="hover-elevate active-elevate-2 transition-all duration-300 cursor-pointer"
                  data-testid={`card-category-${index}`}
                >
                  <CardContent className="p-6 text-center">
                    <div className={`${category.color} rounded-lg py-2 px-3 mb-3 inline-block font-semibold text-sm`}>
                      {category.count}
                    </div>
                    <h3 className="font-medium">{category.name}</h3>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link href="/products" onClick={() => window.scrollTo(0, 0)}>
              <Button size="lg" data-testid="button-view-all">
                View All Products
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="py-20 bg-background observe-slide-up opacity-0">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <Badge className="mb-4" data-testid="badge-about">About Us</Badge>
              <h2 className="text-3xl md:text-4xl font-serif font-bold mb-6">
                Bhayandar's Most Trusted Furnishing Shop Since 1995
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-6">
                Jain Foam & Furnishing has been Bhayandar's leading home décor and furnishing destination since 1995. With thousands of happy customers all across Mumbai, we specialize in high-quality mattresses, curtains, wallpapers, PVC flooring, sofa repair, and custom furnishing solutions.
              </p>
              <p className="text-muted-foreground leading-relaxed mb-6">
                Our 30+ years of experience, customer-first approach, and wide product range make us the most trusted furnishing shop in the Mira-Bhayandar region.
              </p>
              <Link href="/about" onClick={() => window.scrollTo(0, 0)}>
                <Button variant="outline" data-testid="button-learn-more">
                  Learn More About Us
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
            </div>
            <div className="rounded-lg overflow-hidden shadow-xl">
              <img
                src={heroImage}
                alt="Jain Foam & Furnishing"
                className="w-full h-auto object-cover"
                data-testid="img-about"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-primary text-primary-foreground observe-slide-up opacity-0">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-serif font-bold mb-6">
            Ready to Transform Your Home?
          </h2>
          <p className="text-lg text-primary-foreground/90 mb-8">
            Visit our showroom or get in touch with us today for expert guidance and premium quality products
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contact" onClick={() => window.scrollTo(0, 0)}>
              <Button
                size="lg"
                variant="secondary"
                data-testid="button-cta-contact"
              >
                Get in Touch
              </Button>
            </Link>
            <a href="tel:08369051217">
              <Button
                size="lg"
                variant="secondary"
                data-testid="button-cta-call"
              >
                Call 083690 51217
              </Button>
            </a>
          </div>
        </div>
      </section>

      <style>{`
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-slide-up {
          animation: slideUp 0.7s ease-out forwards;
        }
      `}</style>
    </div>
  );
}
