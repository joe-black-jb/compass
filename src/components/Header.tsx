import { useState } from "react";
import { Dialog, DialogPanel } from "@headlessui/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import HeaderListItem from "./HeaderListItem";

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const headerList = [
    {
      title: "ホーム",
      link: "/",
    },
    {
      title: "Compassとは？",
      link: "/about",
    },
    // {
    //   title: "比較",
    //   link: "/company/compare",
    // },
  ];

  return (
    <header className="fixed top-0 h-[50px] w-full z-10 bg-green-300">
      {/* 固定表示箇所 */}
      <nav
        className="relative mx-auto h-full flex justify-between px-6 py-4 lg:px-8"
        aria-label="Global"
      >
        <div className="flex lg:flex-1">
          <a
            href="/"
            className="fixed h-[50px] top-0 left-0 rounded-lg p-2 hover:bg-green-200"
          >
            <img
              src={`${process.env.PUBLIC_URL}/compass-square.png`}
              className="w-16 h-8"
              alt="Logo"
            />
          </a>
        </div>
        <div className="flex items-center">
          {/* ハンバーガーボタン */}
          <button
            type="button"
            className="hover:bg-green-200 h-fit -m-2.5 inline-flex rounded-full p-2.5 text-gray-700"
            onClick={() => setMobileMenuOpen(true)}
          >
            <span className="sr-only">Open main menu</span>
            <Bars3Icon className="h-6 w-6" aria-hidden="true" />
          </button>
        </div>
      </nav>
      {/* 開閉表示箇所 */}
      <Dialog open={mobileMenuOpen} onClose={setMobileMenuOpen}>
        <div className="fixed inset-0 z-10" />

        <DialogPanel className="fixed inset-y-0 right-0 z-10 w-[40%] overflow-scroll bg-white sm:max-w-[300px] sm:ring-1 sm:ring-gray-900/10">
          <div className="h-[50px] flex items-center justify-between px-6 py-4 lg:px-8">
            <div></div>
            {/* ×ボタン */}
            <button
              type="button"
              className="rounded-full text-gray-700 hover:bg-gray-100 p-2.5 -m-2.5 inline-flex"
              onClick={() => setMobileMenuOpen(false)}
            >
              <XMarkIcon className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>
          <div className="mt-6 flow-root">
            <div className="-my-6 divide-y divide-gray-500/10">
              <div>
                <>
                  {headerList.map((item) => (
                    <HeaderListItem
                      key={item.link}
                      title={item.title}
                      link={item.link}
                    />
                  ))}
                </>
              </div>
            </div>
          </div>
        </DialogPanel>
      </Dialog>
    </header>
  );
}
