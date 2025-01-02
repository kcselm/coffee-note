import Link from "next/link";
import { Menu, X } from "lucide-react";
import { Button, buttonVariants } from "./ui/button";
import { auth } from "~/server/auth";
import { ModeToggle } from "./ThemeToggle";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@radix-ui/react-popover";

const NavBar = async () => {
  const session = await auth();

  return (
    <nav className="absolute right-2 flex gap-3 p-4 text-black">
      <ModeToggle />
      {session && (
        <Popover>
          <PopoverTrigger>
            <img
              src={session?.user?.image ?? ""}
              alt={session?.user?.name ?? ""}
              className={buttonVariants({
                variant: "outline",
                size: "icon",
              })}
            />
          </PopoverTrigger>
          <PopoverContent className="p-2">
            <div className="">
              <Link
                href="/api/auth/signout"
                className={buttonVariants({ size: "default" })}
              >
                Sign{" "}
                <span className="text-md font-extrabold">
                  {session.user.name}
                </span>{" "}
                Out
              </Link>
            </div>
          </PopoverContent>
        </Popover>
      )}
    </nav>
  );
};

export default NavBar;
