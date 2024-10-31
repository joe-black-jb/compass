export default function Header2() {
  return (
    <header className="fixed top-0 w-full z-10 bg-green-400">
      <nav
        className="relative mx-auto flex justify-between px-6 py-4 lg:px-8"
        aria-label="Global"
      >
        <div className="flex lg:flex-1">
          <a href="/" className="-m-1.5 p-1.5">
            <img
              src={`${process.env.PUBLIC_URL}/compass-logo.png`}
              className="w-6 h-6"
              alt="Logo"
            />
          </a>
        </div>
      </nav>
    </header>
  );
}
