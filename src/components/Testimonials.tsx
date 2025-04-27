
import React from 'react';
import { Star } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

const testimonials = [
  {
    name: "Sarah Johnson",
    role: "Small Business Owner",
    company: "Creative Solutions LLC",
    content: "FinanceFlow transformed how I manage my business finances. The invoicing and expense tracking features save me hours every week.",
    rating: 5
  },
  {
    name: "Michael Chen",
    role: "Freelance Developer",
    company: "TechCreate",
    content: "The dashboard gives me a clear picture of my finances at a glance. It's incredibly intuitive and perfect for freelancers.",
    rating: 5
  },
  {
    name: "Emily Rodriguez",
    role: "Marketing Agency Director",
    company: "Digital Growth Partners",
    content: "The automated financial reports have made tax season so much easier. I couldn't imagine running my agency without it now.",
    rating: 5
  }
];

const Testimonials = () => {
  return (
    <section className="py-16 md:py-24 bg-gradient-to-b from-white to-purple-50">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Trusted by Businesses Worldwide
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            See what our customers are saying about their experience with FinanceFlow.
          </p>
        </div>

        <Carousel
          opts={{
            align: "start",
            loop: true,
          }}
          className="w-full max-w-5xl mx-auto"
        >
          <CarouselContent>
            {testimonials.map((testimonial, index) => (
              <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
                <div className="h-full p-6 bg-white rounded-xl shadow-md border border-gray-100">
                  <div className="flex gap-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star
                        key={i}
                        className="h-5 w-5 fill-brand-purple text-brand-purple"
                      />
                    ))}
                  </div>
                  <blockquote className="mb-4 text-gray-600">
                    "{testimonial.content}"
                  </blockquote>
                  <div className="mt-auto">
                    <p className="font-semibold">{testimonial.name}</p>
                    <p className="text-sm text-gray-500">{testimonial.role}</p>
                    <p className="text-sm text-brand-purple">{testimonial.company}</p>
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </div>
    </section>
  );
};

export default Testimonials;
