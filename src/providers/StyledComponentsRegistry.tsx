"use client";

import React, { useState } from "react";
import { useServerInsertedHTML } from "next/navigation";
import { ServerStyleSheet, StyleSheetManager } from "styled-components";

const STYLED_SYSTEM_PROPS = new Set([
  // space
  "m","mt","mr","mb","ml","mx","my","p","pt","pr","pb","pl","px","py",
  "margin","marginTop","marginRight","marginBottom","marginLeft","marginX","marginY",
  "padding","paddingTop","paddingRight","paddingBottom","paddingLeft","paddingX","paddingY",
  // color
  "bg","backgroundColor","opacity",
  // typography
  "fontFamily","fontWeight","lineHeight","letterSpacing","textAlign",
  // layout
  "display","size","maxWidth","minWidth","maxHeight","minHeight","overflow","overflowX","overflowY","verticalAlign",
  // flexbox
  "alignItems","alignContent","justifyItems","justifyContent","flexWrap","flexDirection",
  "flex","flexGrow","flexShrink","flexBasis","justifySelf","alignSelf","order",
  // grid
  "gridGap","gridRowGap","gridColumnGap","gridColumn","gridRow","gridArea",
  "gridAutoFlow","gridAutoRows","gridAutoColumns","gridTemplateRows","gridTemplateColumns","gridTemplateAreas",
  // border
  "borderRadius","borderColor","borderStyle","borderWidth",
  "borderTop","borderRight","borderBottom","borderLeft",
  // position
  "position","zIndex","top","right","bottom","left",
  // background
  "backgroundImage","backgroundSize","backgroundPosition","backgroundRepeat",
  // custom
  "typo",
]);

function shouldForwardProp(prop: string): boolean {
  return !STYLED_SYSTEM_PROPS.has(prop);
}

export default function StyledComponentsRegistry({
  children,
}: {
  children: React.ReactNode;
}) {
  const [styledComponentsStyleSheet] = useState(() => new ServerStyleSheet());

  useServerInsertedHTML(() => {
    const styles = styledComponentsStyleSheet.getStyleElement();
    styledComponentsStyleSheet.instance.clearTag();
    return <>{styles}</>;
  });

  if (typeof window !== "undefined")
    return (
      <StyleSheetManager shouldForwardProp={shouldForwardProp}>
        {children}
      </StyleSheetManager>
    );

  return (
    <StyleSheetManager
      sheet={styledComponentsStyleSheet.instance}
      shouldForwardProp={shouldForwardProp}
    >
      {children}
    </StyleSheetManager>
  );
}
