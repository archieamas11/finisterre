import { RiMapPinAddLine } from "react-icons/ri";
import { RiLoginBoxLine } from "react-icons/ri";
import { RiListSettingsFill } from "react-icons/ri";
import { useContext, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { RefreshCw, Search, Filter, Locate, Layers, Home } from "lucide-react";

import { isAdmin, isAuthenticated } from "@/utils/auth.utils.temp";
import { Button } from "@/components/ui/button";
import { LocateContext } from "@/pages/admin/map4admin/AdminMapLayout";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

export default function WebMapNavs() {
  const locateCtx = useContext(LocateContext);
  const location = useLocation();

  // 🎯 Handle add marker button click
  const onAddMarkerClick = () => {
    locateCtx?.toggleAddMarker();
  };
  const onEditMarkerClick = () => {
    locateCtx?.toggleEditMarker?.();
  };

  useEffect(() => {
    if (!locateCtx?.isAddingMarker) return;

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        e.preventDefault();
        locateCtx?.toggleAddMarker?.();
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [locateCtx?.isAddingMarker, locateCtx?.toggleAddMarker]);

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
      {(isAdmin() && location.pathname === "/") || (!isAdmin() && location.pathname === "/map") ? (
        <Button variant={"secondary"} className="rounded-full" onClick={() => locateCtx?.requestLocate()} aria-label="Locate me" size="icon">
          <Locate className="text-accent-foreground" />
        </Button>
      ) : null}

      {/* 🗺️ Layer Toggle Button */}
      <Button variant={"secondary"} className="rounded-full" size="icon">
        <Layers className="text-accent-foreground" />
      </Button>

      {/* 🏠 Home Button */}
      {(isAdmin() && location.pathname === "/map") || (!isAdmin() && location.pathname === "/map") ? (
        <Link to="/">
          <Button variant={"secondary"} className="rounded-full" size="icon">
            <Home className="text-accent-foreground" />
          </Button>
        </Link>
      ) : null}

      {/* ➕ Add Marker Button for Admin */}
      {isAdmin() && location.pathname === "/admin/map" && (
        <>
          {/* Dropdown for Add Marker Options */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="secondary" className="rounded-full" size="icon">
                <RiMapPinAddLine className={locateCtx?.isAddingMarker ? "text-primary-foreground" : "text-accent-foreground"} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={onAddMarkerClick}>{locateCtx?.isAddingMarker ? "Cancel Add" : "Add Marker"}</DropdownMenuItem>
              <DropdownMenuItem onClick={onEditMarkerClick}>{locateCtx?.isEditingMarker ? "Cancel Edit" : "Edit Marker"}</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </>
      )}

      {!isAuthenticated() && (
        <Link to="/login">
          <Button variant="secondary" size="default" className="lg:size-default md:size-icon sm:size-icon rounded-full transition-all duration-200 lg:gap-2">
            <RiLoginBoxLine className="h-4 w-4" />
            <span className="hidden lg:inline">Login</span>
          </Button>
        </Link>
      )}
    </nav>
  );
}
