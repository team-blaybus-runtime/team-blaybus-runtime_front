"use client";

import { CenterRow, Row } from "@/styles/base/BaseComponents";
import { Img } from "@/styles/base/BaseStyledTags";
import { Font } from "@/styles/typo/typography";
import { useRouter } from "next/navigation";
import LoginBtn from "@/component/common/header/LoginBtn";

export default function Header() {
  const router = useRouter();
  const menuList = [
    {
      name: "Home",
      href: "/main",
    },
    {
      name: "My Page",
      href: "/mypage",
    },
    {
      name: "Settings",
      href: "/settings",
    },
    {
      name: "Workflow",
      href: "/workflow",
    },
  ];

  return (
    <CenterRow
      width="100%"
      height="68px"
      py="16px"
    >
      <Img
        src="/icons/common/Logo.svg"
        alt="logo"
        width="120px"
        height="20px"
      />
      <Row flex="1" justifyContent="flex-end" gridGap="24px">
        <Row gridGap="16px" alignItems="center">
          {menuList.map((menu) => (
            <Font
              key={menu.name}
              typo="button_2"
              color="neutral_200"
              width="69px"
              onClick={() => router.push(menu.href)}
              style={{ cursor: "pointer", whiteSpace: "nowrap", textAlign: "center" }}
            >
              {menu.name}
            </Font>
          ))}
        </Row>
        <LoginBtn />
      </Row>
    </CenterRow>
  );
}
