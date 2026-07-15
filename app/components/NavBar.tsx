"use client"

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Disc3, LibraryBig } from "lucide-react";

const links = [
    { href: "/", label: "Now Playing", icon: Disc3 },
    { href: "/library", label: "Library", icon: LibraryBig },
];

export default function NavBar() {
    const pathname = usePathname();

    return (
        <nav className="flex items-center gap-1 px-4 py-2 bg-[#121212] border-b border-white/5">
            <span className="text-sm font-semibold mr-4 text-green-400 hidden sm:block">🎧 Nasheed Player</span>
            {links.map(({ href, label, icon: Icon }) => {
                const active = href === "/" ? pathname === "/" : pathname.startsWith(href);
                return (
                    <Link
                        key={href}
                        href={href}
                        className={`flex items-center gap-2 text-sm px-3 py-1.5 rounded-full transition
                            ${active ? "bg-white/10 text-white" : "text-gray-400 hover:text-white"}`}
                    >
                        <Icon size={16} />
                        {label}
                    </Link>
                );
            })}
        </nav>
    );
}
