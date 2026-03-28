import React, { useState } from "react";
import { Link } from "react-router-dom";
import TypeWriter from "./TypeWriter";

const Hero = () => {
  const [text] = useState([
    "Personalized Email Campaigns",
    "Bulk Emailing",
    "HTML Email Templates",
    "Attachment Management",
    "Excel-based Email Customization",
    "Dynamic Certificate Generation",
    "Automated Mailing Solutions",
    "Custom Email Content",
  ]);

  const [isDemoOpen, setIsDemoOpen] = useState(false);

  return (
    <section
      id="home"
      className="relative z-10 overflow-hidden bg-base-300 pb-16 pt-[120px] dark:bg-gray-dark md:pb-[120px] md:pt-[150px] xl:pb-[160px] xl:pt-[180px] 2xl:pb-[200px] 2xl:pt-[210px] flex items-center justify-center h-screen group"
    >
      {/* Background glow effect */}
      <div className="absolute top-1/2 left-1/2 -z-[1] h-[300px] w-[300px] sm:h-[500px] sm:w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/20 blur-[120px] pointer-events-none opacity-50 group-hover:opacity-80 transition-opacity duration-1000"></div>
      
      <div className="container relative z-10">
        <div className="-mx-4 flex flex-wrap justify-center">
          <div className="w-full px-4">
            <div
              className="wow fadeInUp mx-auto max-w-[850px] text-center"
              data-wow-delay=".2s"
            >
              <h1 className="mb-6 text-4xl font-extrabold tracking-tight leading-tight text-base-content sm:text-5xl sm:leading-tight md:text-6xl md:leading-tight drop-shadow-sm">
                <TypeWriter text={text} />
              </h1>
              <p className="mb-12 text-base font-medium text-base-content/70 sm:text-lg md:text-xl max-w-[800px] mx-auto leading-relaxed">
                Revolutionize your communication with powerful, user-friendly features. 
                Whether you're sending personalized messages or running complex bulk email campaigns, our system streamlines the process with rich HTML support, dynamic attachments, and Excel-based customization. 
                With <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary mx-1">MailCraft</span>, you can effortlessly generate custom certificates, automate tracking, and securely reach your audience in just a few clicks. 
                Say goodbye to manual tasks and experience the future of automated email marketing.
              </p>
              <div className="flex flex-col items-center justify-center space-y-4 sm:flex-row sm:space-x-6 sm:space-y-0 mb-6 mt-8">
                <Link
                  to="/dashboard"
                  className="rounded-full bg-primary px-10 py-4 text-base font-bold text-primary-content shadow-[0_4px_20px_rgba(var(--p),0.4)] hover:shadow-[0_8px_30px_rgba(var(--p),0.6)] hover:-translate-y-1 transition-all duration-300 ease-in-out"
                >
                  🚀 Get Started Free
                </Link>
                <button
                  onClick={() => setIsDemoOpen(true)}
                  className="inline-block rounded-full bg-base-100/50 backdrop-blur-md border border-base-content/10 px-10 py-4 text-base font-bold text-base-content hover:bg-base-100/80 hover:-translate-y-1 transition-all duration-300 ease-in-out shadow-sm"
                >
                  🎥 View Demo
                </button>
              </div>
              <p className="text-sm font-medium text-base-content/50 flex items-center justify-center space-x-2">
                <span>No credit card required</span>
                <span className="w-1 h-1 rounded-full bg-base-content/30"></span>
                <span>Free forever plan</span>
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="absolute right-0 top-0 z-[-1] opacity-20 lg:opacity-30">
        <svg
          width="400"
          height="450"
          viewBox="0 0 400 450"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g transform="translate(-20, 100)">
            {/* Paper airplane */}
            <path
              d="M350 50L50 150L150 200L350 50Z"
              fill="url(#plane_grad)"
            />
            <path
              d="M150 200L220 350L250 220L350 50L150 200Z"
              fill="url(#plane_grad2)"
            />
            <path
              d="M150 200L200 250V300L220 220Z"
              fill="currentColor"
              opacity="0.5"
            />
            <path
              d="M50 350Q150 300 250 220"
              stroke="currentColor"
              strokeWidth="4"
              strokeDasharray="10 10"
              opacity="0.3"
            />
          </g>
          <defs>
            <linearGradient id="plane_grad" x1="50" y1="150" x2="350" y2="50" gradientUnits="userSpaceOnUse">
              <stop stopColor="currentColor" stopOpacity="0.8" />
              <stop offset="1" stopColor="currentColor" stopOpacity="0.1" />
            </linearGradient>
            <linearGradient id="plane_grad2" x1="150" y1="200" x2="220" y2="350" gradientUnits="userSpaceOnUse">
              <stop stopColor="currentColor" stopOpacity="0.6" />
              <stop offset="1" stopColor="currentColor" stopOpacity="0.1" />
            </linearGradient>
          </defs>
        </svg>
      </div>
      <div className="absolute bottom-0 left-0 z-[-1] opacity-20 lg:opacity-30">
        <svg
          width="350"
          height="350"
          viewBox="0 0 350 350"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g transform="scale(0.8) translate(30, 40)">
            {/* Letter sticking out */}
            <rect x="70" y="40" width="210" height="120" rx="4" fill="currentColor" opacity="0.15" />
            <path d="M100 70H250 M100 90H210 M100 110H160" stroke="currentColor" strokeWidth="6" strokeLinecap="round" opacity="0.3" />

            {/* Envelope Envelope Body */}
            <rect x="50" y="100" width="250" height="150" rx="8" fill="url(#env_grad)" />
            
            {/* Envelope Flaps / Details for Realism */}
            {/* Top inner shadow/flap */}
            <polygon points="50,100 175,180 300,100" fill="currentColor" opacity="0.1" />
            
            {/* Bottom Flap overlapping */}
            <polygon points="50,250 175,170 300,250" fill="currentColor" opacity="0.05" />
            
            {/* Outline vectors */}
            <path d="M50 100L175 180L300 100" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" opacity="0.5" />
            <path d="M50 250L175 170L300 250" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" opacity="0.5" />
            <rect x="50" y="100" width="250" height="150" rx="8" stroke="currentColor" strokeWidth="4" fill="none" opacity="0.5" />
            
            {/* Small stamp detail */}
            <rect x="250" y="120" width="30" height="35" rx="2" fill="currentColor" opacity="0.2" stroke="currentColor" strokeWidth="2" strokeDasharray="4 2" />
          </g>
          
          {/* Decorative bits */}
          <circle cx="280" cy="50" r="20" fill="currentColor" opacity="0.2" />
          <circle cx="100" cy="320" r="15" fill="currentColor" opacity="0.3" />
          <circle cx="40" cy="60" r="8" fill="currentColor" opacity="0.2" />
          
          <defs>
            <linearGradient id="env_grad" x1="50" y1="100" x2="300" y2="250" gradientUnits="userSpaceOnUse">
              <stop stopColor="currentColor" stopOpacity="0.5" />
              <stop offset="1" stopColor="currentColor" stopOpacity="0.05" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* Interactive Demo Modal */}
      {isDemoOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-base-100 border border-base-content/10 p-6 sm:p-8 rounded-3xl max-w-2xl w-full relative">
            
            <button 
              onClick={() => setIsDemoOpen(false)}
              className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-base-200 hover:bg-base-300 text-base-content transition-colors font-bold"
            >
              ✕
            </button>

            <h2 className="text-2xl sm:text-3xl font-extrabold mb-8 text-center bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
              How MailCraft Works
            </h2>

            <div className="space-y-4 text-base-content/80 font-medium">
              <div className="flex items-start space-x-4 bg-base-200/50 p-4 rounded-2xl hover:bg-base-200 transition-colors">
                <div className="text-3xl mt-1">📊</div>
                <div>
                  <h3 className="text-lg font-bold text-base-content">1. Upload Excel with emails</h3>
                  <p className="text-sm mt-1 opacity-80">Easily map your custom columns (like first names) to personalize entire campaigns.</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4 bg-base-200/50 p-4 rounded-2xl hover:bg-base-200 transition-colors">
                <div className="text-3xl mt-1">🧩</div>
                <div>
                  <h3 className="text-lg font-bold text-base-content">2. Select a template</h3>
                  <p className="text-sm mt-1 opacity-80">Pick a stunning, pre-designed HTML template from our library.</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4 bg-base-200/50 p-4 rounded-2xl hover:bg-base-200 transition-colors">
                <div className="text-3xl mt-1">📧</div>
                <div>
                  <h3 className="text-lg font-bold text-base-content">3. Preview personalized emails</h3>
                  <p className="text-sm mt-1 opacity-80">See all your dynamic placeholder data merge with the template beautifully.</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4 bg-base-200/50 p-4 rounded-2xl hover:bg-base-200 transition-colors">
                <div className="text-3xl mt-1">🚀</div>
                <div>
                  <h3 className="text-lg font-bold text-base-content">4. Send bulk emails instantly</h3>
                  <p className="text-sm mt-1 opacity-80">Kick back and watch MailCraft automate and dispatch your customized campaign scaled across your audience.</p>
                </div>
              </div>
            </div>

            <div className="mt-10 flex flex-col items-center">
              <Link 
                to="/dashboard"
                className="w-full text-center rounded-full bg-primary px-8 py-4 text-base sm:text-lg font-bold text-primary-content shadow-[0_4px_20px_rgba(var(--p),0.4)] hover:shadow-[0_8px_30px_rgba(var(--p),0.6)] hover:-translate-y-1 transition-all duration-300"
              >
                Start Your First Campaign
              </Link>
            </div>

          </div>
        </div>
      )}

    </section>
  );
};

export default Hero;
