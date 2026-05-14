export default function StoreNotFoundPage() {
  return (
    <div className="flex flex-col min-h-screen select-none bg-cream/30 text-charcoal font-sans items-center justify-center p-4">
      <div className="flex flex-col items-center justify-center text-center py-16 md:py-24 bg-white border border-primary/10 rounded-2xl p-6 shadow-xs max-w-xl mx-auto w-full">
        <span className="text-4xl md:text-5xl mb-4 text-gray-400 animate-pulse">🏬</span>
        <h3 className="text-2xl font-serif font-black text-charcoal mb-2">Store Not Found</h3>
        <p className="text-charcoal/60 text-sm md:text-base max-w-sm mb-6 leading-relaxed">
          The storefront you are looking for does not exist on this domain.
        </p>
      </div>
    </div>
  );
}
