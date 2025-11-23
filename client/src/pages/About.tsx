import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { Award, Heart, Target, Users } from "lucide-react";
import shopImage from "@assets/generated_images/Shop_exterior_photo_41c82ca4.webp";
import { useEffect, useState } from "react";

export default function About() {
  const [isVisible, setIsVisible] = useState(false);

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

    document.querySelectorAll(".observe-slide-up").forEach((el) => {
      observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const values = [
    {
      icon: Heart,
      title: "Customer First",
      description: "We prioritize customer satisfaction above everything else. Your comfort and happiness are our success.",
    },
    {
      icon: Award,
      title: "Quality Products",
      description: "Only premium quality products that stand the test of time. We never compromise on excellence.",
    },
    {
      icon: Target,
      title: "Expert Guidance",
      description: "Over 30 years of expertise to help you make the perfect choice for your home.",
    },
    {
      icon: Users,
      title: "Community Trust",
      description: "Thousands of happy families across Bhayandar, Mira Road, and Dahisar trust us.",
    },
  ];

  const milestones = [
    {
      year: "1995",
      title: "Our Beginning",
      description: "Started with a vision to provide quality furnishings to Bhayandar families",
    },
    {
      year: "2005",
      title: "Expansion",
      description: "Expanded product range to include wallpapers and custom furnishing solutions",
    },
    {
      year: "2015",
      title: "Digital Era",
      description: "Embraced technology while maintaining our personal touch and service quality",
    },
    {
      year: "2025",
      title: "Three Decades",
      description: "Celebrating 30+ years of trust, quality, and serving thousands of happy customers",
    },
  ];

  return (
    <div className="min-h-screen">
      <section className="bg-muted/30 py-16">
        <div
          className={`max-w-7xl mx-auto px-4 text-center transition-all duration-1000 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          <Badge className="mb-4" data-testid="badge-about">About Us</Badge>
          <h1 className="text-4xl md:text-5xl font-serif font-bold mb-6" data-testid="heading-about">
            30+ Years of Trust & Excellence
          </h1>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Jain Foam & Furnishing has been Bhayandar's leading home décor and furnishing destination since 1995
          </p>
        </div>
      </section>

      <section className="py-16 max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center observe-slide-up opacity-0">
          <div className="order-2 lg:order-1">
            <h2 className="text-3xl md:text-4xl font-serif font-bold mb-6">
              Your Trusted Partner in Home Furnishings
            </h2>
            <div className="space-y-4 text-muted-foreground leading-relaxed">
              <p>
                Unleash your creativity with Jain Foam & Furnishing, Bhayandar East, Thane's go-to home décor and furnishing destination since 1995. With over three decades of experience, this one-stop-shop boasts a splendid selection of imported wallpapers, customized 3D wallpapers, resilient P.V.C and vinyl flooring, lively artificial grass, elegant blinds, and functional doormats.
              </p>
              <p>
                Dive into an array of rugs, carpets, curtains, mattresses, pillows, and bed sheets to complement your unique décor vision. Our commitment to quality and customer satisfaction has made us the most trusted furnishing shop in the Mira-Bhayandar region.
              </p>
              <p>
                With thousands of happy customers across Bhayandar, Mira Road, and Dahisar, we specialize in high-quality mattresses, curtains, wallpapers, PVC flooring, sofa repair, and custom furnishing solutions. Our 30+ years of experience, customer-first approach, and wide product range continue to serve families with dedication and excellence.
              </p>
            </div>
            <div className="mt-8">
              <Link href="/contact">
                <Button size="lg" data-testid="button-visit-us">
                  Visit Our Showroom
                </Button>
              </Link>
            </div>
          </div>
          <div className="order-1 lg:order-2 rounded-lg overflow-hidden shadow-xl">
            <img
              src={shopImage}
              alt="Jain Foam & Furnishing Store"
              className="w-full h-auto object-cover"
              data-testid="img-shop"
              loading="lazy"
            />
          </div>
        </div>
      </section>

      <section className="py-20 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 observe-slide-up opacity-0">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-serif font-bold mb-4" data-testid="heading-values">
              Our Core Values
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              The principles that guide everything we do
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => {
              const Icon = value.icon;
              return (
                <Card
                  key={index}
                  className="hover-elevate active-elevate-2 transition-all duration-300"
                  data-testid={`card-value-${index}`}
                >
                  <CardContent className="p-6 text-center">
                    <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                      <Icon className="w-7 h-7 text-primary" />
                    </div>
                    <h3 className="font-semibold text-lg mb-2">{value.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {value.description}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-20 bg-background">
        <div className="max-w-5xl mx-auto px-4 observe-slide-up opacity-0">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-serif font-bold mb-4" data-testid="heading-journey">
              Our Journey
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Three decades of serving families with quality and trust
            </p>
          </div>
          <div className="space-y-8">
            {milestones.map((milestone, index) => (
              <div
                key={index}
                className="flex flex-col md:flex-row gap-6 items-start md:items-center"
                data-testid={`milestone-${index}`}
              >
                <div className="flex-shrink-0 w-24 h-24 rounded-full bg-primary flex items-center justify-center">
                  <span className="text-2xl font-bold text-primary-foreground">
                    {milestone.year}
                  </span>
                </div>
                <Card className="flex-1 hover-elevate transition-all duration-300">
                  <CardContent className="p-6">
                    <h3 className="text-xl font-semibold mb-2">{milestone.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {milestone.description}
                    </p>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-primary text-primary-foreground observe-slide-up opacity-0">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-serif font-bold mb-6">
            Experience the Jain Foam & Furnishing Difference
          </h2>
          <p className="text-lg text-primary-foreground/90 mb-8">
            Visit our showroom to explore our complete range and experience our commitment to quality firsthand
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contact">
              <Button size="lg" variant="secondary" data-testid="button-cta-visit">
                Visit Our Showroom
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
