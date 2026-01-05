import React from "react";
import { Button } from "../common/Button";

export default function CTA() {
  return (
    <section className="bg-[#C0B8AF] py-16">
      <div className="max-w-[1200px] mx-auto px-4 text-center">
        <h2 className="text-3xl font-bold text-[#1E1C25] mb-4">
          Ready to Begin Your Sacred Journey?
        </h2>
        <p className="text-[#637F95] text-lg mb-8 max-w-2xl mx-auto">
          Discover authentic religious items, spiritual guides, and convenient scrap buyback services. 
          Everything you need for your spiritual practice, delivered with devotion.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button>Shop Now</Button>
          <Button>Learn More</Button>
        </div>
        
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div>
            <div className="text-3xl font-bold text-[#C28142] mb-2">1000+</div>
            <p className="text-[#637F95]">Happy Customers</p>
          </div>
          <div>
            <div className="text-3xl font-bold text-[#C28142] mb-2">500+</div>
            <p className="text-[#637F95]">Products Available</p>
          </div>
          <div>
            <div className="text-3xl font-bold text-[#C28142] mb-2">24/7</div>
            <p className="text-[#637F95]">Customer Support</p>
          </div>
        </div>
      </div>
    </section>
  );
}
