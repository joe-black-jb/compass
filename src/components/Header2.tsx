export default function Header2() {
  return (
    <header className="fixed top-0 h-[56px] w-full z-10 bg-green-400">
      <nav
        className="relative mx-auto flex justify-between"
        aria-label="Global"
      >
        <div className="flex lg:flex-1">
          {/* <a href="/" className="-m-1.5 p-1.5">
            <img
              src={`${process.env.PUBLIC_URL}/compass-logo.png`}
              className="w-6 h-6 mt-4"
              alt="Logo"
            />
          </a> */}
          <a
            href="/"
            className="px-2 text-gray-600 h-[56px] hover:bg-green-300 rounded-lg font-bold content-center"
          >
            Compass 〜財務諸表データ検索アプリ〜
          </a>
        </div>
      </nav>
    </header>
  );
}
