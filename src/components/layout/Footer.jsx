export default function Footer() {
  return (
    <footer className="bg-black mt-auto py-16 pb-8 md:py-10 md:pb-8">
      <div className="max-w-6xl mx-auto px-4 md:px-6 flex flex-col items-center gap-6 text-center">
        {/* Logo */}
        <div className="font-display text-2xl font-bold text-white cursor-pointer transition-colors hover:text-primary">
          RetrieveApp
        </div>

        {/* Contact Info */}
        <div className="flex flex-col gap-3 items-center">
          <p className="font-medium text-white text-base">Got questions?</p>
          <div className="text-white text-sm flex items-center justify-center gap-3 flex-col md:flex-row">
            <span>We've got answers → </span>
            <a
              href="mailto:emailaddress@gmail.com"
              className="bg-ink text-white px-4 py-1 rounded-full text-xs font-medium transition-all hover:bg-primary hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
            >
              retrieveapp@gmail.com
            </a>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-300 pt-6 w-full">
          <p className="text-xs text-white">
            © 2025 RetrieveApp. All Rights Reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
