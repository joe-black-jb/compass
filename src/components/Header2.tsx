export default function Header2() {
  return (
    <header className="fixed top-0 left-0 h-[56px] w-full z-10 bg-white">
      <nav
        className="relative mx-auto flex justify-between"
        aria-label="Global"
      >
        <div className="flex lg:flex-1">
          <a
            href="/"
            className="fixed top-4 left-4 p-4 rounded-full hover:bg-green-200"
          >
            <img
              src={`${process.env.PUBLIC_URL}/compass-logo.png`}
              className="w-8 h-8"
              alt="Logo"
            />
          </a>
          {/* <a
            href="/"
            className="pl-4 text-gray-900 h-[56px] hover:bg-green-300 rounded-lg font-bold content-center"
          >
            Compass
          </a> */}
        </div>
      </nav>
    </header>
  );
}
