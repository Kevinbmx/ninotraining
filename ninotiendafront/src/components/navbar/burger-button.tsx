import React from "react";
import { useSidebarContext } from "@/components/layout/layout-context";
import { StyledBurgerButton } from "@/components/navbar/navbar.styles";

export const BurguerButton = () => {
  const { collapsed, setCollapsed } = useSidebarContext();

  return (
    <div
      className={StyledBurgerButton()}
      // open={collapsed}
      onClick={setCollapsed}
    >
      <div />
      <div />
    </div>
  );
};