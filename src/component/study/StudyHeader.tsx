"use client";

import styled from "styled-components";
import { Row } from "@/styles/base/BaseComponents";
import { Img } from "@/styles/base/BaseStyledTags";

export default function StudyHeader() {
  return (
    <HeaderContainer>
      <Container>
        <Img
          src="/icons/common/Logo.svg"
          alt="logo"
          width="120px"
          height="20px"
        />
      </Container>
    </HeaderContainer>
  );
}

const HeaderContainer = styled(Row)`
  width: 100%;
  height: 68px;
  align-items: center;
  padding: 16px 50px;
  background-color: #000000;
  flex-shrink: 0;
`;

const Container = styled(Row)`
  flex: 1;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
`;
