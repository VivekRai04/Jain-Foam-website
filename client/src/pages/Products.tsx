import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "wouter";
import { useEffect, useState, useCallback } from "react";
import { AlertCircle } from "lucide-react";

type Product = {
  id: string;
  name: string;
  category: string;
  description: string;
  image_path: string;
  image_filename: string;
  order_index: number;
  created_at: string;
  updated_at: string;
};

export default function Products() {
  const [isVisible, setIsVisible] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = useCallback(async (attempt = 1) => {
    try {
      const response = await fetch("/api/products", {
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setProducts(data);
      setIsLoading(false);
      setError(null);
    } catch (err) {
      if (attempt < 3) {
        const delay = Math.min(1000 * 2 ** (attempt - 1), 30000);
        setTimeout(() => fetchProducts(attempt + 1), delay);
      } else {
        setError(err instanceof Error ? err.message : 'Failed to load products');
        setIsLoading(false);
      }
    }
  }, []);


  useEffect(() => {
    setIsVisible(true);
    fetchProducts();

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

  const services = [
    {
      title: "Custom Solutions",
      description: "Tailored furnishing solutions to match your unique style and requirements",
    },
    {
      title: "Expert Guidance",
      description: "Professional advice to help you choose the perfect products for your home",
    },
    {
      title: "Quality Assurance",
      description: "Only the highest quality products at the best prices",
    },
    {
      title: "Installation Support",
      description: "Complete installation and setup services for all products",
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
          <Badge className="mb-4" data-testid="badge-products">Our Products & Services</Badge>
          <h1 className="text-4xl md:text-5xl font-serif font-bold mb-6" data-testid="heading-products">
            Premium Home Furnishing Solutions
          </h1>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            At Jain Foam & Furnishing, Bhayandar East, we offer a comprehensive range of high-quality products at the best prices, with expert guidance and same-day delivery.
          </p>
        </div>
      </section>

      <section className="py-16 max-w-7xl mx-auto px-4">

        {error && (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <AlertCircle className="w-12 h-12 text-destructive mb-4" />
            <h3 className="text-lg font-semibold mb-2">Unable to load products</h3>
            <p className="text-muted-foreground mb-4">Please try again or contact us directly</p>
            <Link href="/contact">
              <Button>Contact Us</Button>
            </Link>
          </div>
        )}

        {isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array.from({ length: 9 }).map((_, index) => (
              <Card key={index} className="overflow-hidden">
                <Skeleton className="aspect-square" />
                <CardContent className="p-6">
                  <Skeleton className="h-6 w-20 mb-3" />
                  <Skeleton className="h-6 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-full mb-4" />
                  <Skeleton className="h-10 w-full" />
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {products && products.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {products.map((product, index) => (
                <Card
                  key={product.id}
                  className="hover-elevate active-elevate-2 transition-all duration-100 overflow-hidden"
                  data-testid={`card-product-${product.id}`}
                >
                  <div className="aspect-square overflow-hidden bg-muted/30 relative">
                    <img
                      src={product.image_path}
                      alt={product.name}
                      className="w-full h-full object-cover transition-transform duration-700 hover:scale-110"
                      data-testid={`img-product-${product.id}`}
                      loading="lazy"
                    />
                  </div>
                  <CardContent className="p-6">
                    <Badge className="mb-3" variant="secondary" data-testid={`badge-category-${product.id}`}>
                      {product.category}
                    </Badge>
                    <h3 className="text-xl font-semibold mb-2">{product.name}</h3>
                    <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                      {product.description}
                    </p>
                    <Link href="/contact">
                      <Button className="w-full" data-testid={`button-enquire-${product.id}`}>
                        Enquire Now
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
        )}
      </section>

      <section className="py-20 bg-muted/30 observe-slide-up opacity-0">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-serif font-bold mb-4" data-testid="heading-services">
              Why Choose Us
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              We provide comprehensive home furnishing solutions with excellence
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((service, index) => (
              <Card key={index} className="hover-elevate transition-all duration-300" data-testid={`card-service-${index}`}>
                <CardContent className="p-6 text-center">
                  <h3 className="font-semibold text-lg mb-2">{service.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {service.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link href="/gallery" onClick={() => window.scrollTo(0, 0)}>
              <Button size="lg" data-testid="button-view-gallery">
                View Our Gallery
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="py-20 bg-primary text-primary-foreground observe-slide-up opacity-0">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-serif font-bold mb-6">
            Need Help Choosing the Right Product?
          </h2>
          <p className="text-lg text-primary-foreground/90 mb-8">
            Our experts are here to guide you. Visit our showroom or contact us for personalized recommendations.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contact">
              <Button size="lg" variant="secondary" data-testid="button-contact-expert">
                Contact Our Experts
              </Button>
            </Link>
            <a href="tel:08369051217">
              <Button
                size="lg"
                variant="secondary"
                data-testid="button-call-now"
              >
                Call Now
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
