"use client";

import { CenterRow, Row } from "@/styles/base/BaseComponents";
import { Img } from "@/styles/base/BaseStyledTags";
import { Font } from "@/styles/typo/typography";
import { useRouter } from "next/navigation";
import LoginBtn from "@/component/common/header/LoginBtn";
import { UserInfo } from "@/type/user";

export default function Header({ userInfo }: { userInfo?: UserInfo }) {
  const router = useRouter();
  const menuList = [
    {
      name: "Home",
      href: "/main",
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
    <CenterRow width="100%" height="68px" py="16px">
      <Img
        src="/icons/common/Logo.svg"
        alt="logo"
        width="120px"
        height="20px"
        onClick={() => router.push("/main")}
        style={{ cursor: "pointer" }}
      />
      <Row flex="1" justifyContent="flex-end" gridGap="24px">
        {userInfo && (
          <Row gridGap="16px" alignItems="center">
            {menuList.map((menu) => (
              <Font
                key={menu.name}
                typo="button_2"
                color="neutral_200"
                px="12px"
                onClick={() => router.push(menu.href)}
                style={{
                  cursor: "pointer",
                  whiteSpace: "nowrap",
                  textAlign: "center",
                }}
              >
                {menu.name}
              </Font>
            ))}
          </Row>
        )}
        {!userInfo ? (
          <LoginBtn />
        ) : (
          <Row gridGap="4px" alignItems="center">
            <Img
              src="/icons/common/mypageIcon.svg"
              alt="info"
              width="36px"
              height="36px"
              onClick={() => router.push("/mypage")}
              style={{ cursor: "pointer" }}
            />
            <Font
              typo="button_2"
              color="neutral_200"
              width="auto"
              onClick={() => router.push("/mypage")}
              style={{
                cursor: "pointer",
                whiteSpace: "nowrap",
                textAlign: "center",
              }}
            >
              {userInfo?.nickname}
            </Font>
          </Row>
        )}
      </Row>
    </CenterRow>
  );
}
