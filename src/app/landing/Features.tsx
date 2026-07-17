'use client';

export default function Features() {
  const list = [
    {
      icon: '🔍',
      title: 'Smart City Autocomplete',
      desc: 'Type and match Indian cities instantly using fast Nominatim search integrations.',
    },
    {
      icon: '🛣️',
      title: 'NH Highway Routes',
      desc: 'Preview distance, travel duration, and alternate driving routes calculated live.',
    },
    {
      icon: '📋',
      title: 'Passenger Registry',
      desc: 'Secure your seats and register detailed lists of passenger details on rosters.',
    },
    {
      icon: '💳',
      title: 'UPI & Card Checkout',
      desc: 'Simulate payments using cards or scan instant UPI QR codes built directly into checkouts.',
    },
  ];

  return (
    <section id="features" className="py-20 bg-bg-secondary/40 border-y border-border-primary/50 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <h2 className="text-xs font-bold text-accent-color uppercase tracking-widest">Features List</h2>
          <h3 className="text-3xl sm:text-4xl font-extrabold text-text-primary tracking-tight">
            Designed for Modern Commuters
          </h3>
          <p className="text-text-secondary text-sm">
            Everything you need to discover rides, manage trips, and split travel expenses.
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {list.map((item, idx) => (
            <div
              key={idx}
              className="p-6 rounded-2xl bg-bg-secondary border border-border-primary shadow-lg hover:shadow-accent-color/5 hover:border-accent-color/30 hover:-translate-y-1 transition-all duration-300 group cursor-default"
            >
              <span className="text-3xl block mb-4 filter drop-shadow-md group-hover:scale-110 transition-transform duration-200 w-fit">
                {item.icon}
              </span>
              <h4 className="text-base font-bold text-text-primary mb-2">{item.title}</h4>
              <p className="text-xs text-text-secondary leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
