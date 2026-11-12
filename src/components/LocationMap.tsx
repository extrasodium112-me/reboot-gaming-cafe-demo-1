'use client';

export default function LocationMap() {
  return (
    <section className="py-16 px-6 max-w-7xl mx-auto w-full">
      <div className="glass-card rounded-3xl p-8 border border-white/10 shadow-2xl grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        <div>
          <span className="text-pink-500 font-semibold tracking-wider uppercase text-sm">Find Your Zone</span>
          <h2 className="text-3xl font-extrabold text-white mt-2 mb-4">REBOOT Gaming Café, Mhow</h2>
          <p className="text-gray-300 mb-6 leading-relaxed">
            Located in the heart of Mhow, Madhya Pradesh. Drop by to experience high-end rigs, lightning-fast fiber optics, and ultimate gaming comfort.
          </p>
          <div className="space-y-3 text-gray-300 mb-8">
            <p>📍 <strong className="text-white">Address:</strong> YADAV MOHLA, 2817, Mhow, MP 457221</p>
            <p>🕒 <strong className="text-white">Hours:</strong> Monday – Sunday: 09:00 AM – 10:00 PM</p>
            <p>📞 <strong className="text-white">Support:</strong> +91 07324 461284</p>
          </div>
          <div className="flex gap-4">
            <a
              href="https://maps.google.com/?q=Mhow+Madhya+Pradesh"
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-pink-500 to-purple-600 text-white font-bold shadow-lg hover:opacity-90 transition"
            >
              Get Directions
            </a>
          </div>
        </div>
        <div className="h-[350px] w-full rounded-2xl overflow-hidden border border-white/10 shadow-inner">
          <iframe
            title="REBOOT Location Map"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            loading="lazy"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3686.2!2d75.75!3d22.55!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3962f!2sMhow!5e0!3m2!1sen!2sin!4v1650000000000"
          ></iframe>
        </div>
      </div>
    </section>
  );
}
