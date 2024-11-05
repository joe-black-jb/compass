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
            className="fixed top-2 left-4 rounded-lg p-1 hover:bg-gray-200"
          >
            <img
              src={`${process.env.PUBLIC_URL}/compass-square.png`}
              className="w-16 h-8"
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
