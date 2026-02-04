import { Column, Row } from "@/styles/base/BaseComponents";
import { Img } from "@/styles/base/BaseStyledTags";
import { Font } from "@/styles/typo/typography";
import React from "react";

const FOOTER_SECTIONS = [
  {
    title: "ABOUT US",
    items: ["서비스 소개"],
  },
  {
    title: "HELP",
    items: ["FAQ", "Feedback"],
  },
];

export default function Footer() {
  return (
    <Column
      width="100%"
      height="284px"
      bg="neutral_1100"
      p="48px 360px"
      gridGap="24px"
    >
      <Row width="100%" justifyContent="space-between">
        <Img
          src="/icons/common/Logo.svg"
          alt="logo"
          width="120px"
          height="20px"
        />
        <Row width="auto" gridGap="24px">
          {FOOTER_SECTIONS.map((section) => (
            <Column key={section.title} width="201px" gridGap="10px">
              <Font
                typo="caption_s"
                color="neutral_300"
                textAlign="left"
                style={{ cursor: "pointer" }}
              >
                {section.title}
              </Font>
              {section.items.map((item) => (
                <Font
                  key={`${section.title}-${item}`}
                  typo="caption_s"
                  color="neutral_300"
                  textAlign="left"
                >
                  {item}
                </Font>
              ))}
            </Column>
          ))}
        </Row>
      </Row>
    </Column>
  );
}
