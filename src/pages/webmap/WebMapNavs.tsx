import { BiLocationPlus } from "react-icons/bi";
import { RiLoginBoxLine } from "react-icons/ri";
import { RiListSettingsFill } from "react-icons/ri";
import { useContext } from "react";
import { Link } from "react-router-dom";
import { RefreshCw, Search, Filter, Locate, Layers, Home } from "lucide-react";

import { isAdmin, isAuthenticated } from "@/utils/auth.utils.temp";
import { Button } from "@/components/ui/button";
import { LocateContext } from "@/components/layout/WebMapLayout";

export default function WebMapNavs() {
  const locateCtx = useContext(LocateContext);
  return (
    <nav
      className="pointer-events-auto absolute top-4 right-4 z-[990] flex flex-col gap-3 sm:top-8 sm:right-8 sm:gap-4 md:top-8 md:right-auto md:left-1/2 md:-translate-x-1/2 md:flex-row md:gap-4"
      style={{ pointerEvents: "auto" }}
    >
      <Button variant={"secondary"} className="rounded-full" size="icon">
        <Search className="text-accent-foreground" />
      </Button>
      <Button variant={"secondary"} className="rounded-full" size="icon">
        <RiListSettingsFill className="text-accent-foreground" />
      </Button>
      <Button variant={"secondary"} className="rounded-full" size="icon">
        <Filter className="text-accent-foreground" />
      </Button>
      <Button variant={"secondary"} className="rounded-full" size="icon">
        <RefreshCw className="text-accent-foreground" />
      </Button>
      {!isAdmin() && (
        <Button variant={"secondary"} className="rounded-full" onClick={() => locateCtx?.requestLocate()} aria-label="Locate me" size="icon">
          <Locate className="text-accent-foreground" />
        </Button>
      )}
      <Button variant={"secondary"} className="rounded-full" size="icon">
        <Layers className="text-accent-foreground" />
      </Button>
      {!isAdmin() && (
        <Link to="/">
          <Button variant={"secondary"} className="rounded-full" size="icon">
            <Home className="text-accent-foreground" />
          </Button>
        </Link>
      )}

      {/* TODO: Adding new marker in the map*/}
      {isAdmin() && (
        <Button variant={"secondary"} className="rounded-full" size="icon">
          <BiLocationPlus />
        </Button>
      )}

      {/* Show Login button only when the user is NOT authenticated */}
      {!isAuthenticated() && (
        <Link to={"/login"}>
          <Button variant={"secondary"} className="rounded-full" size="default">
            <RiLoginBoxLine />
            Login
          </Button>
        </Link>
      )}
    </nav>
  );
}
