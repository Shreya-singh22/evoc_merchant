"use client";

import React from "react";
import PromoBar from "@/components/PromoBar";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CartDrawer from "@/components/CartDrawer";
import MobileBottomNav from "@/components/MobileBottomNav";
import { ShieldCheck, Mail, Phone, Calendar, ChevronRight } from "lucide-react";


export default function PrivacyPolicy() {
  const lastUpdated = "May 13, 2026";

  return (
    <div className="flex flex-col min-h-screen bg-cream/30 text-charcoal font-sans select-none">
      <div className="sticky top-0 z-50 w-full">
        <PromoBar />
        <Header />
      </div>

      <main className="flex-grow pt-8 pb-20 px-4 md:px-6">
        {/* Breadcrumbs */}
        <nav className="max-w-4xl mx-auto flex items-center gap-2 text-[10px] uppercase tracking-widest text-charcoal/50 mb-8 animate-fade-in">
          <a href={`/`} className="hover:text-primary transition-colors">Home</a>
          <ChevronRight size={10} />
          <span className="text-charcoal font-bold">Privacy Policy</span>
        </nav>

        {/* Page Header */}
        <div className="max-w-4xl mx-auto text-center flex flex-col items-center gap-4 mb-12 animate-fade-in">
          <div className="w-16 h-16 rounded-full border border-primary/10 bg-white flex items-center justify-center text-primary shadow-sm">
            <ShieldCheck size={32} />
          </div>
          <h1 className="text-4xl md:text-6xl font-serif font-black text-charcoal tracking-tight">
            Privacy Policy
          </h1>
          <div className="flex items-center gap-2 text-xs font-bold text-charcoal/40 uppercase tracking-widest">
            <Calendar size={14} />
            <span>Last Updated: {lastUpdated}</span>
          </div>
        </div>

        {/* Content Container */}
        <div className="max-w-4xl mx-auto bg-white border border-primary/10 shadow-lg rounded-3xl p-6 md:p-14 text-charcoal/80 text-sm md:text-base leading-relaxed animate-slide-up space-y-10 font-medium">
          
          <div className="bg-cream/20 border-l-4 border-primary p-6 rounded-r-xl">
            <p className="font-bold text-charcoal">
              Jindal Electricals (“us”, “we”, or “our”) operates the <a href="https://www.moonstruck.co.in" className="text-primary underline hover:text-primary/80 transition-colors">www.moonstruck.co.in</a> website (the “Service”).
            </p>
            <p className="mt-4">
              This page informs you of our policies regarding the collection, use, and disclosure of personal data when you use our Service and the choices you have associated with that data. We use your data to provide and improve the Service. By using the Service, you agree to the collection and use of information in accordance with this policy.
            </p>
          </div>

          {/* Section 1 */}
          <section className="space-y-4 border-t border-gray-50 pt-8">
            <h2 className="text-xl md:text-2xl font-serif font-black text-charcoal flex items-center gap-2">
              <span className="text-primary">1.</span> Information Collection and Use
            </h2>
            <p>
              We collect several different types of information for various purposes to provide and improve our Service to you.
            </p>
          </section>

          {/* Section 2 */}
          <section className="space-y-6">
            <h2 className="text-xl md:text-2xl font-serif font-black text-charcoal flex items-center gap-2">
              <span className="text-primary">2.</span> Types of Data Collected
            </h2>
            
            <div className="pl-4 space-y-4 border-l-2 border-gray-100">
              <h3 className="text-lg font-bold text-charcoal">Personal Data</h3>
              <p>
                While using our Service, we may ask you to provide us with certain personally identifiable information that can be used to contact or identify you (“Personal Data”). Personally identifiable information may include, but is not limited to:
              </p>
              <ul className="list-disc list-inside pl-2 font-bold text-charcoal space-y-1">
                <li>Cookies and Usage Data</li>
              </ul>

              <h3 className="text-lg font-bold text-charcoal mt-6">Usage Data</h3>
              <p>
                We may also collect information on how the Service is accessed and used (“Usage Data”). This Usage Data may include information such as your computer’s IP address, browser type, browser version, the pages of our Service that you visit, the time and date of your visit, time spent on those pages, unique device identifiers, and other diagnostic data.
              </p>

              <h3 className="text-lg font-bold text-charcoal mt-6">Tracking & Cookies Data</h3>
              <p>
                We use cookies and similar tracking technologies to track the activity on our Service and hold certain information. Cookies are files with a small amount of data which may include an anonymous unique identifier.
              </p>
              <p>
                You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent. However, if you do not accept cookies, you may not be able to use some portions of our Service.
              </p>
              <p className="text-xs text-charcoal/50 font-bold uppercase tracking-wider">Examples of Cookies we use:</p>
              <ul className="space-y-2">
                <li className="flex items-start gap-2">
                  <span className="text-primary font-black mt-0.5">•</span>
                  <span><strong>Session Cookies:</strong> We use Session Cookies to operate our Service.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary font-black mt-0.5">•</span>
                  <span><strong>Preference Cookies:</strong> We use Preference Cookies to remember your preferences and various settings.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary font-black mt-0.5">•</span>
                  <span><strong>Security Cookies:</strong> We use Security Cookies for security purposes.</span>
                </li>
              </ul>
            </div>
          </section>

          {/* Section 3 */}
          <section className="space-y-4 border-t border-gray-50 pt-8">
            <h2 className="text-xl md:text-2xl font-serif font-black text-charcoal flex items-center gap-2">
              <span className="text-primary">3.</span> Use of Data
            </h2>
            <p>moonstruck uses the collected data for various purposes:</p>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 pl-2">
              {[
                "To provide and maintain the Service",
                "To notify you about changes to our Service",
                "To allow participation in interactive features",
                "To provide customer care and support",
                "To provide analytical data for improvements",
                "To monitor the usage of the Service",
                "To detect, prevent, and address technical issues"
              ].map((item, idx) => (
                <li key={idx} className="flex items-start gap-3 bg-cream/10 p-3 rounded-xl border border-primary/5">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0 mt-2" />
                  <span className="text-sm font-bold text-charcoal/80">{item}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* Section 4 */}
          <section className="space-y-4 border-t border-gray-50 pt-8">
            <h2 className="text-xl md:text-2xl font-serif font-black text-charcoal flex items-center gap-2">
              <span className="text-primary">4.</span> Transfer of Data
            </h2>
            <p>
              Your information, including Personal Data, may be transferred to — and maintained on — computers located outside of your state, province, country, or other governmental jurisdiction where the data protection laws may differ.
            </p>
            <p>
              If you are located outside India and choose to provide information to us, please note that we transfer the data, including Personal Data, to India and process it there. Your consent to this Privacy Policy followed by your submission of such information represents your agreement to that transfer.
            </p>
          </section>

          {/* Section 5 */}
          <section className="space-y-4 border-t border-gray-50 pt-8">
            <h2 className="text-xl md:text-2xl font-serif font-black text-charcoal flex items-center gap-2">
              <span className="text-primary">5.</span> Disclosure of Data
            </h2>
            <p className="font-bold text-charcoal">Legal Requirements</p>
            <p>moonstruck may disclose your Personal Data in good faith belief that such action is necessary to:</p>
            <ul className="list-disc list-inside space-y-1 pl-2">
              <li>Comply with a legal obligation</li>
              <li>Protect and defend the rights or property of moonstruck</li>
              <li>Prevent or investigate possible wrongdoing</li>
              <li>Protect the personal safety of users or the public</li>
              <li>Protect against legal liability</li>
            </ul>
          </section>

          {/* Section 6 */}
          <section className="space-y-4 border-t border-gray-50 pt-8">
            <h2 className="text-xl md:text-2xl font-serif font-black text-charcoal flex items-center gap-2">
              <span className="text-primary">6.</span> Security of Data
            </h2>
            <p>
              The security of your data is important to us, but remember that no method of transmission over the Internet or method of electronic storage is 100% secure. While we strive to use commercially acceptable means to protect your Personal Data, we cannot guarantee its absolute security.
            </p>
          </section>

          {/* Section 7 */}
          <section className="space-y-4 border-t border-gray-50 pt-8">
            <h2 className="text-xl md:text-2xl font-serif font-black text-charcoal flex items-center gap-2">
              <span className="text-primary">7.</span> Service Providers
            </h2>
            <p>
              We may employ third-party companies and individuals (“Service Providers”) to facilitate & provide the Service on our behalf, to perform Service-related services, or to assist us in analyzing how our Service is used.
            </p>
            <p>
              These third parties have access to your Personal Data only to perform these tasks on our behalf and are obligated not to disclose or use it for any other purpose.
            </p>
          </section>

          {/* Section 8 */}
          <section className="space-y-4 border-t border-gray-50 pt-8">
            <h2 className="text-xl md:text-2xl font-serif font-black text-charcoal flex items-center gap-2">
              <span className="text-primary">8.</span> Links to Other Sites
            </h2>
            <p>
              Our Service may contain links to other sites that are not operated by us. If you click on a third-party link, you will be directed to that third party's site. We strongly advise you to review the Privacy Policy of every site you visit.
            </p>
          </section>

          {/* Section 9 */}
          <section className="space-y-4 border-t border-gray-50 pt-8">
            <h2 className="text-xl md:text-2xl font-serif font-black text-charcoal flex items-center gap-2">
              <span className="text-primary">9.</span> Children's Privacy
            </h2>
            <p>
              Our Service does not address anyone under the age of 18 (“Children”). We do not knowingly collect personally identifiable information from anyone under the age of 18. If you are a parent or guardian and you are aware that your child has provided us with Personal Data, please contact us.
            </p>
          </section>

          {/* Section 10 */}
          <section className="space-y-4 border-t border-gray-50 pt-8">
            <h2 className="text-xl md:text-2xl font-serif font-black text-charcoal flex items-center gap-2">
              <span className="text-primary">10.</span> Changes to This Privacy Policy
            </h2>
            <p>
              We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page. You are advised to review this Privacy Policy periodically for any changes.
            </p>
          </section>

          {/* Contact Card */}
          <section className="mt-12 pt-8 border-t border-primary/10 bg-cream/20 rounded-3xl p-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
            <div className="flex flex-col gap-1">
              <h3 className="text-xl font-serif font-black text-charcoal flex items-center gap-2">
                Contact Us
              </h3>
              <p className="text-xs md:text-sm text-charcoal/60 font-bold uppercase tracking-wider">
                Got questions regarding this privacy policy?
              </p>
            </div>
            <div className="flex flex-col gap-3 font-bold text-sm w-full sm:w-auto">
              <a href="mailto:support@moonstruck.co.in" className="flex items-center gap-3 text-charcoal hover:text-primary transition-colors bg-white border border-primary/10 p-3 px-5 rounded-xl shadow-sm">
                <Mail size={16} className="text-primary" />
                support@moonstruck.co.in
              </a>
              <a href="tel:+918448609059" className="flex items-center gap-3 text-charcoal hover:text-primary transition-colors bg-white border border-primary/10 p-3 px-5 rounded-xl shadow-sm">
                <Phone size={16} className="text-primary" />
                +91 84486 09059
              </a>
            </div>
          </section>

        </div>
      </main>

      <Footer />
      <CartDrawer />
      <MobileBottomNav />

      {/* Simple Animations */}
      <style jsx global>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slide-up {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .animate-slide-up {
          animation: slide-up 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}</style>
    </div>
  );
}
