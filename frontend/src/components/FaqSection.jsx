import React, { useState } from "react";
import { HelpCircle, ChevronDown } from "lucide-react";

export default function FaqSection() {
  const [openIndex, setOpenIndex] = useState(0);

  const faqs = [
    {
      question: "How does AirAware calculate the Healthiest route?",
      answer: "AirAware assigns composite environmental cost scores to each road edge in the OpenStreetMap network based on real-time AQICN station readings and population density. The A* pathfinding algorithm then traverses paths that minimize total particulate exposure."
    },
    {
      question: "What happens if live AQI API data is unavailable?",
      answer: "The backend includes an automatic fallback AQI model that calculates synthetic spatial pollution gradients based on urban coordinates and time of day, ensuring 100% route calculation uptime."
    },
    {
      question: "Can I customize the weight given to Air Quality vs. Distance?",
      answer: "Yes! Use the dynamic sliders in the Route Planner section to adjust weights for Distance (w1), AQI (w2), and Population Density (w3). The system automatically normalizes weights to re-calculate your custom optimal path."
    },
    {
      question: "Which algorithms are used to find the routes?",
      answer: "We run Dijkstra's algorithm for the Shortest (distance-weighted) and Fastest (time-proxy) routes, and A* search with Euclidean heuristics for the Healthiest (environmental-cost) route."
    },
    {
      question: "How are the three computed routes displayed?",
      answer: "Routes are rendered on the Leaflet map with distinct color-coded polylines: Blue for Shortest, Orange for Fastest, and Green for Healthiest. Hovering or clicking a route card highlights its exact path on the map."
    }
  ];

  return (
    <section id="faqs" className="matter-faq-section">
      <div className="matter-section-header">
        <div className="matter-badge-pill">
          <HelpCircle className="size-3.5 text-amber-400" />
          <span>Frequently Asked Questions</span>
        </div>
        <h2 className="matter-section-title">
          Everything You Need to Know
        </h2>
        <p className="matter-section-subtitle">
          Got questions about our pollution-aware pathfinding algorithms or dataset integrations? Find answers below.
        </p>
      </div>

      <div className="matter-faq-container">
        <div className="matter-faq-list">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={faq.question}
                className={`matter-faq-item ${isOpen ? "open" : ""}`}
              >
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? -1 : index)}
                  className="matter-faq-question-btn"
                  aria-expanded={isOpen}
                >
                  <span className="matter-faq-question-text">{faq.question}</span>
                  <ChevronDown className={`size-5 matter-faq-chevron ${isOpen ? "rotate-180" : ""}`} />
                </button>

                {isOpen && (
                  <div className="matter-faq-answer">
                    <p>{faq.answer}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
