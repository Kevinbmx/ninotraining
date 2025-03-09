import React from "react";
import { Sidebar } from "./sidebar.styles";
import { Avatar, Tooltip } from "@nextui-org/react";
import { CompaniesDropdown } from "./companies-dropdown";
import { HomeIcon } from "../icons/sidebar/home-icon";
import { PaymentsIcon } from "../icons/sidebar/payments-icon";
import { BalanceIcon } from "../icons/sidebar/balance-icon";
import { AccountsIcon } from "../icons/sidebar/accounts-icon";
import { CustomersIcon } from "../icons/sidebar/customers-icon";
import { ProductsIcon } from "../icons/sidebar/products-icon";
import { ReportsIcon } from "../icons/sidebar/reports-icon";
import { DevIcon } from "../icons/sidebar/dev-icon";
import { ViewIcon } from "../icons/sidebar/view-icon";
import { SettingsIcon } from "../icons/sidebar/settings-icon";
import { CollapseItems } from "./collapse-items";
import { SidebarItem } from "./sidebar-item";
import { SidebarMenu } from "./sidebar-menu";
import { FilterIcon } from "../icons/sidebar/filter-icon";
import { useSidebarContext } from "../layout/layout-context";
import { ChangeLogIcon } from "../icons/sidebar/changelog-icon";
import { usePathname } from "next/navigation";
import { internalRoutes } from "@/utils/routes";

export const SidebarWrapper = () => {
  const pathname = usePathname();
  const { collapsed, setCollapsed } = useSidebarContext();

  return (
    <aside className="h-screen z-[20] sticky top-0">
      {collapsed ? (
        <div className={Sidebar.Overlay()} onClick={setCollapsed} />
      ) : null}
      <div
        className={Sidebar({
          collapsed: collapsed,
        })}
      >
        <div className={Sidebar.Header()}>
          <CompaniesDropdown />
        </div>
        <div className="flex flex-col justify-between h-full">
          <div className={Sidebar.Body()}>
            <SidebarItem
              title="Principal"
              icon={<HomeIcon />}
              isActive={pathname === internalRoutes.admin}
              href={internalRoutes.admin}
            />
            <SidebarMenu title="Menu Principal">
              <SidebarItem
                isActive={pathname === internalRoutes.adminGrupo}
                title="Grupo"
                icon={<CustomersIcon />}
                href={internalRoutes.adminGrupo}
              />
              <SidebarItem
                isActive={pathname === internalRoutes.adminPiloto}
                title="Pilotos"
                icon={<AccountsIcon />}
                href={internalRoutes.adminPiloto}
              />
              <SidebarItem
                isActive={pathname === internalRoutes.adminTutor}
                title="Tutores"
                icon={<PaymentsIcon />}
                href={internalRoutes.adminTutor}
              />

              {/* <CollapseItems
                icon={<BalanceIcon />}
                items={["Banks Accounts", "Credit Cards", "Loans"]}
                title="Balances"
              /> */}
              <SidebarItem
                isActive={pathname === internalRoutes.adminAsistencia}
                title="Asistencia"
                icon={<CustomersIcon />}
                href={internalRoutes.adminAsistencia}
              />
              <SidebarItem
                isActive={pathname === "/admin/products"}
                title="Seguros"
                icon={<ProductsIcon />}
              />
            </SidebarMenu>

            <SidebarMenu title="Registrar">
              <SidebarItem
                isActive={pathname === "/admin/developers"}
                title="Grupo"
                icon={<CustomersIcon />}
              />
              <SidebarItem
                isActive={pathname === "/admin/view"}
                title="Inscribir"
                icon={<ViewIcon />}
              />
              <SidebarItem
                isActive={pathname === "/admin/settings"}
                title="Balance"
                icon={<SettingsIcon />}
              />
            </SidebarMenu>
          </div>
          {/* <div className={Sidebar.Footer()}>
            <Tooltip content={"Settings"} color="primary">
              <div className="max-w-fit">
                <SettingsIcon />
              </div>
            </Tooltip>
            <Tooltip content={"Adjustments"} color="primary">
              <div className="max-w-fit">
                <FilterIcon />
              </div>
            </Tooltip>
            <Tooltip content={"Profile"} color="primary">
              <Avatar
                src="https://i.pravatar.cc/150?u=a042581f4e29026704d"
                size="sm"
              />
            </Tooltip>
          </div> */}
        </div>
      </div>
    </aside>
  );
};
