"use client"
import React from "react";
import { Navbar, NavbarBrand, NavbarContent, NavbarItem, NavbarMenuToggle, DropdownItem, Link, Dropdown, DropdownMenu, DropdownTrigger, Avatar } from "@nextui-org/react";
import { usePathname } from "next/navigation";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const pathname = usePathname();
  return (
    <header>
      <Navbar onMenuOpenChange={setIsMenuOpen}>
        <NavbarContent>
          <NavbarBrand  >
            <Link href="/">
              <h1 className="font-bold ">Niño Training</h1>
            </Link>
          </NavbarBrand>
        </NavbarContent>
        <NavbarContent as="div" justify="end">
          <Dropdown backdrop="blur" placement="bottom-end">
            <DropdownTrigger>
              <Avatar
                isBordered
                as="button"
                className="transition-transform"
                color="secondary"
                name="Jason Hughes"
                size="sm"
                src="https://i.pravatar.cc/150?u=a042581f4e29026704d"
              />
            </DropdownTrigger>
            <DropdownMenu aria-label="Profile Actions" variant="flat">
              <DropdownItem key="profile" className="h-14 gap-2" textValue="sesion">
                <p className="font-semibold">Inició sesión como</p>
                <p className="font-semibold">kevi3195@gmail.com</p>
              </DropdownItem>
              <DropdownItem key="sobreMi" href="#">Sobre Mi</DropdownItem>
              <DropdownItem key="misGrupo" href="#">Mis Grupo</DropdownItem>
              <DropdownItem key="contactame" href="#">Contactame</DropdownItem>
              <DropdownItem key="logout" className="text-danger" color="danger">
                Cerrar Sesion
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </NavbarContent>
      </Navbar>
    </header >
  )
}

export default Header
