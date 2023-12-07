import { Fragment, useEffect, useState } from "react";
import Link from "next/link";
import { Dialog, Menu, Transition } from "@headlessui/react";
import {
  Bars3Icon,
  CalendarIcon,
  HomeIcon,
  UsersIcon,
  XMarkIcon,
  DocumentDuplicateIcon,
  BookmarkSquareIcon,
  ArrowRightOnRectangleIcon,
  UserGroupIcon,
  TvIcon,
} from "@heroicons/react/24/outline";
import { ChevronDownIcon, ChevronRightIcon } from "@heroicons/react/20/solid";
import { Disclosure } from "@headlessui/react";
import Session from "supertokens-web-js/recipe/session";
import { useRouter } from "next/router";

let navigation = [
  { name: "Dashboard", href: "/", icon: HomeIcon, current: true },
  { name: "Product", href: "/products", icon: CalendarIcon, current: false },
  {
    name: "Serial Number",
    href: "/serial-numbers",
    icon: DocumentDuplicateIcon,
    current: false,
  },
  {
    name: "Product Serials",
    href: "/product-serials",
    icon: BookmarkSquareIcon,
    current: false,
  },
  {
    name: "Users",
    icon: UsersIcon,
    current: false,
    children: [
      { name: "Team", href: "/users/teams", current: false },
      { name: "User", href: "/users", current: false },
    ],
  },
];

const userNavigation = [{ name: "Your profile", href: "/users/your-profile" }];

function classNames(...classes: any[]) {
  return classes.filter(Boolean).join(" ");
}

export default function SidebarLayout({ children }: any) {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [user, setUser] = useState<any>({});

  useEffect(() => {
    const userInfo = localStorage.getItem("user");
    if (userInfo) {
      const data = JSON.parse(userInfo);
      setUser(data);
    }
  }, []);

  navigation = navigation.filter((nav) => {
    if (user?.role === "demo") {
      if (nav.name === "Users") {
        return false;
      }
    }

    return true;
  });

  const logout = async (event: any) => {
    event.preventDefault();

    if (!router.isReady) return;

    await Session.signOut();

    localStorage.removeItem("user");

    router.replace("/auth/login");
  };

  return (
    <>
      <div>
        <Transition.Root show={sidebarOpen} as={Fragment}>
          <Dialog
            as="div"
            className="relative z-50 lg:hidden"
            onClose={setSidebarOpen}
          >
            <Transition.Child
              as={Fragment}
              enter="transition-opacity ease-linear duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="transition-opacity ease-linear duration-300"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div className="fixed inset-0 bg-gray-900/80" />
            </Transition.Child>

            <div className="fixed inset-0 flex">
              <Transition.Child
                as={Fragment}
                enter="transition ease-in-out duration-300 transform"
                enterFrom="-translate-x-full"
                enterTo="translate-x-0"
                leave="transition ease-in-out duration-300 transform"
                leaveFrom="translate-x-0"
                leaveTo="-translate-x-full"
              >
                <Dialog.Panel className="relative mr-16 flex w-full max-w-xs flex-1">
                  <Transition.Child
                    as={Fragment}
                    enter="ease-in-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in-out duration-300"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                  >
                    <div className="absolute left-full top-0 flex w-16 justify-center pt-5">
                      <button
                        type="button"
                        className="-m-2.5 p-2.5"
                        onClick={() => setSidebarOpen(false)}
                      >
                        <span className="sr-only">Close sidebar</span>
                        <XMarkIcon
                          className="h-6 w-6 text-white"
                          aria-hidden="true"
                        />
                      </button>
                    </div>
                  </Transition.Child>
                  {/* Sidebar component, swap this element with another sidebar if you like */}
                  <div className="flex grow flex-col gap-y-5 overflow-y-auto border-r border-gray-200 bg-white px-6 pb-4">
                    <div className="flex h-16 shrink-0 items-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="120"
                        height="18"
                        fill="none"
                      >
                        <path
                          fill="#113A5D"
                          d="M17.882 2.903h-1.555v12.224h1.555V2.903Zm94.295 10.787V9.52h6.477V8.083h-6.477V4.34h6.914V2.903h-8.468v12.224h8.741V13.69h-7.187Zm-5.782 1.437h1.582V2.903h-1.486v9.591l-6.15-9.591h-1.596v12.224h1.487V5.521l6.163 9.606Zm-12.368-.54c.882-.503 1.564-1.248 2.046-2.235.472-.977.709-2.082.709-3.316 0-1.224-.223-2.32-.668-3.287-.464-.968-1.128-1.717-1.991-2.249-.873-.54-1.85-.81-2.932-.81-1.646 0-2.991.573-4.037 1.721-1.045 1.148-1.568 2.737-1.568 4.768 0 1.072.223 2.087.668 3.045a5.301 5.301 0 0 0 1.978 2.277c.863.56 1.85.84 2.959.84a5.585 5.585 0 0 0 2.836-.755Zm-.736-9.891c.618.408 1.09.982 1.418 1.722.318.74.477 1.608.477 2.604 0 1.575-.373 2.79-1.118 3.643-.764.854-1.727 1.28-2.89 1.28-1.146 0-2.096-.421-2.85-1.266-.764-.844-1.146-2.006-1.146-3.486 0-1.84.4-3.15 1.2-3.928.781-.787 1.722-1.181 2.822-1.181.773 0 1.469.204 2.087.612Zm-8.905 10.431V13.69h-7.472l7.281-9.35V2.903H75.81V4.34h6.532a23.64 23.64 0 0 0-1.214 1.452l-6 7.84v1.495h9.26Zm-13.786 0V4.34h3.873V2.903h-9.287V4.34h3.86v10.787H70.6Zm-8.727 0h1.581V2.903h-1.486v9.591l-6.15-9.591h-1.595v12.224h1.486V5.521l6.164 9.606Zm-9.764 0V13.69h-7.186V9.52H51.4V8.083h-6.477V4.34h6.913V2.903h-8.468v12.224h8.741Zm-14.74 0 4.58-12.224h-1.58l-3.165 8.88a26.917 26.917 0 0 0-.627 2.006 27.467 27.467 0 0 0-.613-2.006l-3.055-8.88h-1.677l4.54 12.224h1.596Zm-16.787 0h1.486V5.521l6.164 9.606h1.582V2.903h-1.487v9.591l-6.15-9.591h-1.595v12.224Z"
                        />
                        <path
                          fill="#113A5D"
                          stroke="#113A5D"
                          strokeLinecap="square"
                          strokeLinejoin="round"
                          d="M110.414 15.137V2.912h8.468V4.35h-6.914v3.743h6.477V9.53h-6.477v4.17h7.187v1.437h-8.741Zm-11.878 0V2.912h1.596l6.15 9.592V2.912h1.486v12.225h-1.582l-6.163-9.606v9.606h-1.487ZM85.377 9.188c0-2.03.523-3.62 1.568-4.767 1.046-1.148 2.391-1.722 4.037-1.722 1.082 0 2.059.27 2.932.81.863.532 1.527 1.282 1.99 2.25.446.967.669 2.063.669 3.287 0 1.233-.237 2.338-.71 3.316-.481.986-1.163 1.731-2.045 2.234a5.585 5.585 0 0 1-2.836.754c-1.11 0-2.096-.28-2.96-.84a5.301 5.301 0 0 1-1.977-2.277 7.14 7.14 0 0 1-.668-3.045Zm1.596.014c0 1.48.382 2.643 1.145 3.487.755.844 1.705 1.266 2.85 1.266 1.164 0 2.127-.427 2.891-1.28.746-.854 1.118-2.069 1.118-3.644 0-.996-.159-1.864-.477-2.604-.327-.74-.8-1.314-1.418-1.722a3.704 3.704 0 0 0-2.087-.612c-1.1 0-2.04.394-2.822 1.181-.8.778-1.2 2.088-1.2 3.928Zm-12.055 5.935v-1.495l6-7.841a23.64 23.64 0 0 1 1.214-1.452H75.6V2.912h8.386V4.35l-7.282 9.35h7.473v1.438h-9.259Zm-6.082 0V4.349h-3.859V2.912h9.287V4.35H70.39v10.788h-1.555Zm-48.463 0V2.912h1.595l6.15 9.592V2.912h1.487v12.225h-1.582L21.859 5.53v9.606h-1.486Zm-4.255 0V2.912h1.555v12.225h-1.555Zm37.896 0V2.912h1.595l6.15 9.592V2.912h1.486v12.225h-1.581L55.5 5.53v9.606h-1.486Zm-10.855 0V2.912h8.468V4.35h-6.913v3.743h6.477V9.53h-6.477v4.17H51.9v1.437h-8.74Zm-7.595 0L31.023 2.912H32.7l3.054 8.88c.246.712.45 1.38.614 2.007.182-.674.391-1.343.627-2.007l3.164-8.88h1.582l-4.582 12.225h-1.595Z"
                        />
                        <path
                          fill="#113A5D"
                          d="M11.036 5.393c0-.949-.404-1.551-1.213-1.807L1.013.782V14.174l4.773 1.522 4.037 1.281c.809.256 1.213-.09 1.213-1.039V5.393ZM9.823 3.586c.809.256 1.213.858 1.213 1.807v8.766c.828-.047 1.241-.521 1.241-1.423V2.191c0-.949-.454-1.423-1.363-1.423H1v13.391h.014V.782l8.809 2.804Z"
                        />
                        <path
                          stroke="#fff"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth=".5"
                          d="M11.036 14.16c.828-.048 1.241-.522 1.241-1.424V2.191c0-.949-.454-1.423-1.363-1.423H1v13.391"
                        />
                        <path
                          stroke="#fff"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth=".5"
                          d="m5.786 15.696-4.772-1.522V.781l8.809 2.804c.809.256 1.213.858 1.213 1.807v10.546c0 .948-.404 1.294-1.213 1.038l-4.037-1.28Zm0 0V3.415M3.21 2.76v11.983m5.073-10.63v12.224"
                        />
                      </svg>
                    </div>
                    <nav className="flex flex-1 flex-col">
                      <ul role="list" className="flex flex-1 flex-col gap-y-7">
                        <li>
                          <ul role="list" className="-mx-2 space-y-1">
                            {navigation.map((item) => (
                              <li key={item.name}>
                                {!item.children ? (
                                  <Link
                                    href={item.href as string}
                                    className={classNames(
                                      item.current
                                        ? "bg-gray-50"
                                        : "hover:bg-gray-50",
                                      "group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold text-gray-700"
                                    )}
                                  >
                                    <item.icon
                                      className="h-6 w-6 shrink-0 text-gray-400"
                                      aria-hidden="true"
                                    />
                                    {item.name}
                                  </Link>
                                ) : (
                                  <Disclosure as="div">
                                    {({ open }) => (
                                      <>
                                        <Disclosure.Button
                                          className={classNames(
                                            item.current
                                              ? "bg-gray-50"
                                              : "hover:bg-gray-50",
                                            "flex items-center w-full text-left rounded-md p-2 gap-x-3 text-sm leading-6 font-semibold text-gray-700"
                                          )}
                                        >
                                          <item.icon
                                            className="h-6 w-6 shrink-0 text-gray-400"
                                            aria-hidden="true"
                                          />
                                          {item.name}
                                          <ChevronRightIcon
                                            className={classNames(
                                              open
                                                ? "rotate-90 text-gray-500"
                                                : "text-gray-400",
                                              "ml-auto h-5 w-5 shrink-0"
                                            )}
                                            aria-hidden="true"
                                          />
                                        </Disclosure.Button>
                                        <Disclosure.Panel
                                          as="ul"
                                          className="mt-1 px-2"
                                        >
                                          {item.children.map((subItem) => (
                                            <li key={subItem.name}>
                                              {/* 44px */}
                                              <Disclosure.Button
                                                as={Link}
                                                href={subItem.href as string}
                                                className={classNames(
                                                  subItem.current
                                                    ? "bg-gray-50"
                                                    : "hover:bg-gray-50",
                                                  "flex gap-x-3 rounded-md py-2 pr-2 pl-9 text-sm leading-6 text-gray-700"
                                                )}
                                              >
                                                <item.icon
                                                  className="h-6 w-6 shrink-0 text-gray-400"
                                                  aria-hidden="true"
                                                />
                                                {subItem.name}
                                              </Disclosure.Button>
                                            </li>
                                          ))}
                                        </Disclosure.Panel>
                                      </>
                                    )}
                                  </Disclosure>
                                )}
                              </li>
                            ))}
                          </ul>
                        </li>
                        <li className="mt-auto">
                          <button
                            onClick={logout}
                            className="group -mx-2 flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6 text-gray-700 hover:bg-gray-50 hover:text-indigo-600"
                          >
                            <ArrowRightOnRectangleIcon
                              className="h-6 w-6 shrink-0 text-gray-400 group-hover:text-indigo-600"
                              aria-hidden="true"
                            />
                            Logout
                          </button>
                        </li>
                      </ul>
                    </nav>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </Dialog>
        </Transition.Root>

        {/* Static sidebar for desktop */}
        <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col">
          {/* Sidebar component, swap this element with another sidebar if you like */}
          <div className="flex grow flex-col gap-y-5 overflow-y-auto border-r border-gray-200 bg-white px-6 pb-4">
            <div className="flex h-16 shrink-0 items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="120"
                height="18"
                fill="none"
              >
                <path
                  fill="#113A5D"
                  d="M17.882 2.903h-1.555v12.224h1.555V2.903Zm94.295 10.787V9.52h6.477V8.083h-6.477V4.34h6.914V2.903h-8.468v12.224h8.741V13.69h-7.187Zm-5.782 1.437h1.582V2.903h-1.486v9.591l-6.15-9.591h-1.596v12.224h1.487V5.521l6.163 9.606Zm-12.368-.54c.882-.503 1.564-1.248 2.046-2.235.472-.977.709-2.082.709-3.316 0-1.224-.223-2.32-.668-3.287-.464-.968-1.128-1.717-1.991-2.249-.873-.54-1.85-.81-2.932-.81-1.646 0-2.991.573-4.037 1.721-1.045 1.148-1.568 2.737-1.568 4.768 0 1.072.223 2.087.668 3.045a5.301 5.301 0 0 0 1.978 2.277c.863.56 1.85.84 2.959.84a5.585 5.585 0 0 0 2.836-.755Zm-.736-9.891c.618.408 1.09.982 1.418 1.722.318.74.477 1.608.477 2.604 0 1.575-.373 2.79-1.118 3.643-.764.854-1.727 1.28-2.89 1.28-1.146 0-2.096-.421-2.85-1.266-.764-.844-1.146-2.006-1.146-3.486 0-1.84.4-3.15 1.2-3.928.781-.787 1.722-1.181 2.822-1.181.773 0 1.469.204 2.087.612Zm-8.905 10.431V13.69h-7.472l7.281-9.35V2.903H75.81V4.34h6.532a23.64 23.64 0 0 0-1.214 1.452l-6 7.84v1.495h9.26Zm-13.786 0V4.34h3.873V2.903h-9.287V4.34h3.86v10.787H70.6Zm-8.727 0h1.581V2.903h-1.486v9.591l-6.15-9.591h-1.595v12.224h1.486V5.521l6.164 9.606Zm-9.764 0V13.69h-7.186V9.52H51.4V8.083h-6.477V4.34h6.913V2.903h-8.468v12.224h8.741Zm-14.74 0 4.58-12.224h-1.58l-3.165 8.88a26.917 26.917 0 0 0-.627 2.006 27.467 27.467 0 0 0-.613-2.006l-3.055-8.88h-1.677l4.54 12.224h1.596Zm-16.787 0h1.486V5.521l6.164 9.606h1.582V2.903h-1.487v9.591l-6.15-9.591h-1.595v12.224Z"
                />
                <path
                  fill="#113A5D"
                  stroke="#113A5D"
                  strokeLinecap="square"
                  strokeLinejoin="round"
                  d="M110.414 15.137V2.912h8.468V4.35h-6.914v3.743h6.477V9.53h-6.477v4.17h7.187v1.437h-8.741Zm-11.878 0V2.912h1.596l6.15 9.592V2.912h1.486v12.225h-1.582l-6.163-9.606v9.606h-1.487ZM85.377 9.188c0-2.03.523-3.62 1.568-4.767 1.046-1.148 2.391-1.722 4.037-1.722 1.082 0 2.059.27 2.932.81.863.532 1.527 1.282 1.99 2.25.446.967.669 2.063.669 3.287 0 1.233-.237 2.338-.71 3.316-.481.986-1.163 1.731-2.045 2.234a5.585 5.585 0 0 1-2.836.754c-1.11 0-2.096-.28-2.96-.84a5.301 5.301 0 0 1-1.977-2.277 7.14 7.14 0 0 1-.668-3.045Zm1.596.014c0 1.48.382 2.643 1.145 3.487.755.844 1.705 1.266 2.85 1.266 1.164 0 2.127-.427 2.891-1.28.746-.854 1.118-2.069 1.118-3.644 0-.996-.159-1.864-.477-2.604-.327-.74-.8-1.314-1.418-1.722a3.704 3.704 0 0 0-2.087-.612c-1.1 0-2.04.394-2.822 1.181-.8.778-1.2 2.088-1.2 3.928Zm-12.055 5.935v-1.495l6-7.841a23.64 23.64 0 0 1 1.214-1.452H75.6V2.912h8.386V4.35l-7.282 9.35h7.473v1.438h-9.259Zm-6.082 0V4.349h-3.859V2.912h9.287V4.35H70.39v10.788h-1.555Zm-48.463 0V2.912h1.595l6.15 9.592V2.912h1.487v12.225h-1.582L21.859 5.53v9.606h-1.486Zm-4.255 0V2.912h1.555v12.225h-1.555Zm37.896 0V2.912h1.595l6.15 9.592V2.912h1.486v12.225h-1.581L55.5 5.53v9.606h-1.486Zm-10.855 0V2.912h8.468V4.35h-6.913v3.743h6.477V9.53h-6.477v4.17H51.9v1.437h-8.74Zm-7.595 0L31.023 2.912H32.7l3.054 8.88c.246.712.45 1.38.614 2.007.182-.674.391-1.343.627-2.007l3.164-8.88h1.582l-4.582 12.225h-1.595Z"
                />
                <path
                  fill="#113A5D"
                  d="M11.036 5.393c0-.949-.404-1.551-1.213-1.807L1.013.782V14.174l4.773 1.522 4.037 1.281c.809.256 1.213-.09 1.213-1.039V5.393ZM9.823 3.586c.809.256 1.213.858 1.213 1.807v8.766c.828-.047 1.241-.521 1.241-1.423V2.191c0-.949-.454-1.423-1.363-1.423H1v13.391h.014V.782l8.809 2.804Z"
                />
                <path
                  stroke="#fff"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth=".5"
                  d="M11.036 14.16c.828-.048 1.241-.522 1.241-1.424V2.191c0-.949-.454-1.423-1.363-1.423H1v13.391"
                />
                <path
                  stroke="#fff"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth=".5"
                  d="m5.786 15.696-4.772-1.522V.781l8.809 2.804c.809.256 1.213.858 1.213 1.807v10.546c0 .948-.404 1.294-1.213 1.038l-4.037-1.28Zm0 0V3.415M3.21 2.76v11.983m5.073-10.63v12.224"
                />
              </svg>
            </div>
            <nav className="flex flex-1 flex-col">
              <ul role="list" className="flex flex-1 flex-col gap-y-7">
                <li>
                  <ul role="list" className="-mx-2 space-y-1">
                    {navigation.map((item) => (
                      <li key={item.name}>
                        {!item.children ? (
                          <Link
                            href={item.href as string}
                            className={classNames(
                              item.current ? "bg-gray-50" : "hover:bg-gray-50",
                              "group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold text-gray-700"
                            )}
                          >
                            <item.icon
                              className="h-6 w-6 shrink-0 text-gray-400"
                              aria-hidden="true"
                            />
                            {item.name}
                          </Link>
                        ) : (
                          <Disclosure as="div">
                            {({ open }) => (
                              <>
                                <Disclosure.Button
                                  className={classNames(
                                    item.current
                                      ? "bg-gray-50"
                                      : "hover:bg-gray-50",
                                    "flex items-center w-full text-left rounded-md p-2 gap-x-3 text-sm leading-6 font-semibold text-gray-700"
                                  )}
                                >
                                  <item.icon
                                    className="h-6 w-6 shrink-0 text-gray-400"
                                    aria-hidden="true"
                                  />
                                  {item.name}
                                  <ChevronRightIcon
                                    className={classNames(
                                      open
                                        ? "rotate-90 text-gray-500"
                                        : "text-gray-400",
                                      "ml-auto h-5 w-5 shrink-0"
                                    )}
                                    aria-hidden="true"
                                  />
                                </Disclosure.Button>
                                <Disclosure.Panel as="ul" className="mt-1 px-2">
                                  {item.children.map((subItem) => (
                                    <li key={subItem.name}>
                                      {/* 44px */}
                                      <Disclosure.Button
                                        as={Link}
                                        href={subItem.href as string}
                                        className={classNames(
                                          subItem.current
                                            ? "bg-gray-50"
                                            : "hover:bg-gray-50",
                                          "flex gap-x-3 rounded-md py-2 pr-2 pl-9 text-sm leading-6 text-gray-700"
                                        )}
                                      >
                                        <item.icon
                                          className="h-6 w-6 shrink-0 text-gray-400"
                                          aria-hidden="true"
                                        />
                                        {subItem.name}
                                      </Disclosure.Button>
                                    </li>
                                  ))}
                                </Disclosure.Panel>
                              </>
                            )}
                          </Disclosure>
                        )}
                      </li>
                    ))}
                  </ul>
                </li>
                {user?.role === "demo" ? (
                  <li>
                    <a
                      href="https://forms.gle/uGkFgoRtJVgwTmc76"
                      target="_blank"
                      className="group border w-fit border-red-400 -mx-2 flex gap-x-3 rounded-md p-2 px-4 text-sm font-semibold leading-6 text-red-400 hover:bg-red-400 hover:text-white"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="1.5"
                        stroke="currentColor"
                        className="w-6 h-6"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M15.59 14.37a6 6 0 01-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 006.16-12.12A14.98 14.98 0 009.631 8.41m5.96 5.96a14.926 14.926 0 01-5.841 2.58m-.119-8.54a6 6 0 00-7.381 5.84h4.8m2.581-5.84a14.927 14.927 0 00-2.58 5.84m2.699 2.7c-.103.021-.207.041-.311.06a15.09 15.09 0 01-2.448-2.448 14.9 14.9 0 01.06-.312m-2.24 2.39a4.493 4.493 0 00-1.757 4.306 4.493 4.493 0 004.306-1.758M16.5 9a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z"
                        />
                      </svg>
                      Upgrade Plan
                    </a>
                  </li>
                ) : null}
                <li className="mt-auto">
                  <button
                    onClick={logout}
                    className="group -mx-2 flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6 text-red-400 hover:bg-red-50 hover:text-red-600"
                  >
                    <ArrowRightOnRectangleIcon
                      className="h-6 w-6 shrink-0 text-red-400 group-hover:text-red-600"
                      aria-hidden="true"
                    />
                    Logout
                  </button>
                </li>
              </ul>
            </nav>
          </div>
        </div>

        <div className="lg:pl-72">
          <div className="sticky top-0 z-40 flex justify-between lg:justify-end h-16 shrink-0 items-center gap-x-4 bg-white px-4 sm:gap-x-6 sm:px-6 lg:px-8">
            <button
              type="button"
              className="-m-2.5 p-2.5 text-gray-700 lg:hidden"
              onClick={() => setSidebarOpen(true)}
            >
              <span className="sr-only">Open sidebar</span>
              <Bars3Icon className="h-6 w-6" aria-hidden="true" />
            </button>

            {/* Profile dropdown */}
            <Menu as="div" className="relative">
              {/* <Menu.Button className="-m-1.5 flex items-center p-1.5">
                <span className="sr-only">Open user menu</span>
                <img
                  className="h-8 w-8 rounded-full bg-gray-50"
                  src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                  alt=""
                />
                <span className="hidden lg:flex lg:items-center">
                  <span
                    className="ml-4 text-sm font-semibold leading-6 text-gray-900"
                    aria-hidden="true"
                  >
                    Tom Cook
                  </span>
                  <ChevronDownIcon
                    className="ml-2 h-5 w-5 text-gray-400"
                    aria-hidden="true"
                  />
                </span>
              </Menu.Button> */}
              <Transition
                as={Fragment}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
              >
                <Menu.Items className="absolute right-0 z-10 mt-2.5 w-32 origin-top-right rounded-md bg-white py-2 shadow-lg ring-1 ring-gray-900/5 focus:outline-none">
                  {userNavigation.map((item) => (
                    <Menu.Item key={item.name}>
                      {({ active }) => (
                        <Link
                          href={item.href as string}
                          className={classNames(
                            active ? "bg-gray-50" : "",
                            "block px-3 py-1 text-sm leading-6 text-gray-900"
                          )}
                        >
                          {item.name}
                        </Link>
                      )}
                    </Menu.Item>
                  ))}
                </Menu.Items>
              </Transition>
            </Menu>
          </div>

          <main className="py-10">
            <div className="px-4 sm:px-6 lg:px-8">{children}</div>
          </main>
        </div>
      </div>
    </>
  );
}
