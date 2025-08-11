"use client";

import NavbarMobile from "./NavbarMobile";
import NavbarDesktop from "./NavbarDesktop";
import BottomTabBar from "./BottomTabBar";

export default function NavbarWrapper() {
  return (
    <>
      <NavbarMobile />
      <NavbarDesktop />
      <BottomTabBar />
    </>
  );
}
