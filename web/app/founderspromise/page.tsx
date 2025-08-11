"use client";

import { useState } from "react";
import { ShieldCheck, Wallet, RefreshCcw, Star, Quote } from "lucide-react";

export default function OurPromisePage() {
  const [activeTab, setActiveTab] = useState("promise");

  return (
    <main className="min-h-screen bg-[#fdf8f3] text-black font-sans">
      {/* Hero */}

      {/* Main Section With Sidebar */}
      <section className="flex px-6 py-16 max-w-7xl mx-auto gap-12">
        {/* Main Content */}
        <div className="flex-1">
          <div className="flex gap-6 border-b border-gray-300 mb-8 text-lg font-medium">
            <button
              className={`pb-2 ${
                activeTab === "promise"
                  ? "border-b-4 border-[#5c4033] text-[#5c4033]"
                  : "text-gray-500 hover:text-[#5c4033]"
              }`}
              onClick={() => setActiveTab("promise")}
            >
              Founderʼs Promise
            </button>
            <button
              className={`pb-2 ${
                activeTab === "tourism"
                  ? "border-b-4 border-[#5c4033] text-[#5c4033]"
                  : "text-gray-500 hover:text-[#5c4033]"
              }`}
              onClick={() => setActiveTab("tourism")}
            >
              Sustainable Tourism
            </button>
          </div>

          {/* Founder’s Promise */}
          {activeTab === "promise" && (
            <div className="space-y-8">
              <h2 className="text-3xl font-bold text-[#5c4033]">
                The Founderʼs Promise
              </h2>
              <p>
                At Fair Trade Safaris, travel isnʼt just business. Itʼs
                personal. I founded this company with a simple guiding
                principle:
              </p>
              <div className="bg-white border border-gray-300 p-6 rounded-xl shadow-sm flex gap-4 items-start">
                <Quote className="w-8 h-8 text-[#5c4033] mt-1 shrink-0" />
                <div>
                  <p className="text-lg italic mb-2">
                    I would never design a trip for you that I wouldnʼt take
                    myself — with my own family.
                  </p>
                  <p className="text-sm text-gray-600">
                    Thatʼs not marketing fluff. Itʼs a promise. My promise.
                  </p>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-semibold">What is S.A.F.E.?</h3>
                <p>
                  S.A.F.E. stands for{" "}
                  <strong>
                    Security, Affordability, Flexibility, and Experiences
                  </strong>{" "}
                  — the four pillars that define how we plan and deliver every
                  single safari.
                </p>

                <ul className="mt-6 space-y-6">
                  <li className="flex gap-4 items-start">
                    <ShieldCheck className="text-[#5c4033] w-6 h-6 mt-1 shrink-0" />
                    <div>
                      <h4 className="font-semibold text-lg">Security</h4>
                      <p>
                        Your well-being is non-negotiable. When you&quot;re
                        exploring remote regions, flying in bush planes, or
                        staying in off-the-grid lodges, peace of mind isn’t
                        optional — it’s everything. We only work with trusted,
                        vetted local operators, guides, and accommodations that
                        meet rigorous safety standards. If it’s not safe, it
                        doesn’t make the cut.
                      </p>
                    </div>
                  </li>
                  <li className="flex gap-4 items-start">
                    <Wallet className="text-[#5c4033] w-6 h-6 mt-1 shrink-0" />
                    <div>
                      <h4 className="font-semibold text-lg">Affordability</h4>
                      <p>
                        Luxury doesn’t have to be overpriced. Thanks to deep
                        relationships in Africa and a lean operational model, we
                        pass the savings on to you. Our rates are often 15–30%
                        lower than comparable luxury safari packages — with
                        better service and fewer middlemen.
                      </p>
                    </div>
                  </li>
                  <li className="flex gap-4 items-start">
                    <RefreshCcw className="text-[#5c4033] w-6 h-6 mt-1 shrink-0" />
                    <div>
                      <h4 className="font-semibold text-lg">Flexibility</h4>
                      <p>
                        This is your trip — not ours. Whether you’re a solo
                        adventurer, a honeymooning couple, or a family with kids
                        and a thousand questions — we listen, adapt, and build
                        around you. We’ll bend over backward to make it happen.
                      </p>
                    </div>
                  </li>
                  <li className="flex gap-4 items-start">
                    <Star className="text-[#5c4033] w-6 h-6 mt-1 shrink-0" />
                    <div>
                      <h4 className="font-semibold text-lg">Experiences</h4>
                      <p>
                        We don’t recommend anything we haven’t experienced
                        firsthand. Every lodge, game drive, and side trip is
                        personally vetted. If something doesn’t meet our
                        standards for quality and storytelling — it doesn’t go
                        in your itinerary.
                      </p>
                    </div>
                  </li>
                </ul>
              </div>

              <p>
                Building Fair Trade Safaris has been the most rewarding journey
                of my life. Our goal is to make sure you feel safe, valued, and
                blown away by the magic of Africa — just like I did the first
                time I went.
              </p>
            </div>
          )}

          {/* Tourism tab to be expanded next */}
          {activeTab === "tourism" && (
            <div className="space-y-6">
              <h2 className="text-3xl font-bold text-[#5c4033]">
                Sustainable Tourism at Fair Trade Safaris
              </h2>
              <p>
                When you travel with Fair Trade Safaris, you donʼt just explore
                Africaʼs wild beauty — you support the people, wildlife, and
                ecosystems that make it extraordinary. Through partnerships,
                donations, and guest involvement, weʼve helped raise over $2
                million for trusted conservation and community development
                initiatives across Africa and the US.
              </p>
              <h3 className="text-xl font-semibold">Wildlife Conservation</h3>
              <p>
                Africa’s majestic wildlife is under siege. We support
                boots-on-the-ground conservation organizations like WildAid,
                Sheldrick Wildlife Trust, and PAMS Foundation to defend
                threatened species and restore ecosystems. Your travel helps
                fund anti-poaching patrols, wildlife rehabilitation, and
                research efforts.
              </p>
              <p>
                We stand firmly against trophy hunting, supporting only ethical,
                responsible tourism that protects endangered species.
              </p>
              <h3 className="text-xl font-semibold">Community Empowerment</h3>
              <p>
                Sustainable tourism must uplift the people who call these lands
                home. We work closely with local nonprofits and global NGOs
                including SOS Children’s Villages, Uthando (SA), and the Andy
                Roddick Foundation to support education, healthcare, arts, and
                job creation.
              </p>
              <h3 className="text-xl font-semibold">Guest Involvement</h3>
              <p>
                Your role isn’t passive — it’s powerful. A portion of your trip
                cost supports partner organizations. You can also:
              </p>
              <ul className="list-disc list-inside pl-4">
                <li>Visit local nonprofit or project sites</li>
                <li>Join cultural ceremonies and culinary experiences</li>
                <li>Match donations or volunteer your time</li>
              </ul>
              <h3 className="text-xl font-semibold">
                The Win-Win of Sustainable Travel
              </h3>
              <p>
                When you travel with us, you fund conservation, create jobs,
                preserve culture — and gain a richer, more soul-stirring
                experience.
              </p>
              <h3 className="text-xl font-semibold">
                Built on Trust, Run by Locals
              </h3>
              <p>
                Our team spans the US and Africa, combining global standards
                with deep local expertise. Whether it’s affordable luxury or
                opulent escapes — we ensure your journey is ethical and
                extraordinary.
              </p>
            </div>
          )}
        </div>

        {/* Right Sidebar Placeholder */}
        <aside className="w-80 hidden lg:block">
          <div className="sticky top-24 space-y-8">
            {/* You can insert featured journeys, subscribe form, etc. */}
          </div>
        </aside>
      </section>
    </main>
  );
}
