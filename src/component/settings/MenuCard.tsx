"use client";

import { useRouter } from "next/navigation";
import { Column, Row } from "@/styles/base/BaseComponents";
import { Img } from "@/styles/base/BaseStyledTags";
import { Font } from "@/styles/typo/typography";
import { clearTokens } from "@/utils/authTokens";

const ACCOUNT_MENU_ITEMS = [
  "비밀번호 변경",
  "보안 설정",
  "로그아웃",
  "탈퇴하기",
];

const SUPPORT_MENU_ITEMS = ["알림 설정", "FAQ", "피드백"];

export default function MenuCard({ type }: { type: "account" | "support" }) {
  const router = useRouter();
  const title = type === "account" ? "계정 설정" : "지원";
  const icon =
    type === "account"
      ? "/icons/settings/settingAccount.svg"
      : "/icons/settings/settingSupport.svg";
  const menuItems =
    type === "account" ? ACCOUNT_MENU_ITEMS : SUPPORT_MENU_ITEMS;

  const handleMenuClick = (label: string) => {
    if (label !== "로그아웃") return;

    clearTokens();
    router.push("/login");
  };

  return (
    <Column
      width="588px"
      height="100%"
      bg="neutral_1000"
      borderRadius="16px"
      p="24px"
      gridGap="16px"
    >
      <Img src={icon} alt="settingAccount" width="48px" height="48px" />
      <Column width="100%" height="100%" gridGap="8px">
        <Font typo="label_l" color="neutral_0">
          {title}
        </Font>
        {menuItems.map((label) => (
          <Row
            key={label}
            alignItems="center"
            width="100%"
            height="29px"
            gridGap="4px"
            style={{ cursor: "pointer" }}
            onClick={() => handleMenuClick(label)}
          >
            <Img
              src="/icons/settings/arrowRightGrey.svg"
              alt="arrowRightGrey"
              width="20px"
              height="20px"
            />
            <Font typo="body_2" color="neutral_600">
              {label}
            </Font>
          </Row>
        ))}
      </Column>
    </Column>
  );
}
