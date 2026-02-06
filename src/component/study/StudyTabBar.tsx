"use client";

import { useState } from "react";
import styled from "styled-components";
import { Row } from "@/styles/base/BaseComponents";
import { Button } from "@/styles/base/BaseStyledTags";
import { Font } from "@/styles/typo/typography";
import colors from "@/styles/constant/colors";

const TABS = ["단일 부품", "조립도", "편집", "시뮬레이터"] as const;

export default function StudyTabBar() {
  const [activeTab, setActiveTab] = useState<string>(TABS[0]);

  return (
    <TabContainer>
      {TABS.map((tab) => (
        <TabButton
          key={tab}
          $active={activeTab === tab}
          onClick={() => setActiveTab(tab)}
        >
          <Font
            typo="button_2"
            color={activeTab === tab ? colors.neutral_0 : "#969696"}
          >
            {tab}
          </Font>
        </TabButton>
      ))}
    </TabContainer>
  );
}

const TabContainer = styled(Row)`
  background-color: #242424;
  border-radius: 16px;
  padding: 9px 10px;
  gap: 16px;
  flex-shrink: 0;
`;

const TabButton = styled(Button)<{ $active?: boolean }>`
  padding: 8px 12px;
  border-radius: 8px;
  background-color: ${({ $active }) => ($active ? colors.blue_700 : "transparent")};
  transition: background-color 0.2s;

  &:hover {
    background-color: ${({ $active }) =>
      $active ? colors.blue_700 : "rgba(255, 255, 255, 0.05)"};
  }
`;
