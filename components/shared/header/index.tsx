import Image from "next/image";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { APP_NAME } from "@/lib/constants";
import Menu from "./menu";

const categoryLinks = [
  {
    label: "Men",
    href: "/men",
  },
  {
    label: "Women",
    href: "/women",
  },
  {
    label: "Beauty",
    href: "/beauty",
  },
  {
    label: "Sport",
    href: "/sport",
  },
];

const Header = async () => {
  return (
    <header className="w-full border-b">
      <div className="wrapper flex-between">
        <div className="flex-start">
          <Link href="/" className="flex-start">
            <Image
              src="/assets/icons/shopping-logo.png"
              width={48}
              height={48}
              alt={`${APP_NAME} logo`}
            />
            {APP_NAME}
          </Link>
        </div>

        <nav className="hidden lg:flex gap-6">
          {categoryLinks.map((link, i) => (
            <Button asChild variant="ghost" key={i}>
              <Link href={link.href}>{link.label}</Link>
            </Button>
          ))}
        </nav>

        <Menu />
      </div>
    </header>
  );
};

export default Header;
