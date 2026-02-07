import { CenterColumn } from "@/styles/base/BaseComponents";
import HomeInfo from "@/component/landing/HomeInfo";
import StudyBtn from "@/component/landing/StudyBtn";
import { Div, Img } from "@/styles/base/BaseStyledTags";

export default function Home() {
  return (
    <CenterColumn width="100%" height="100%">
      <Img src="/icons/landing/landing.svg" alt="landing-img" />
      <Div
        position="absolute"
        bottom="0"
        left="0"
        right="0"
        height="100px"
        bg="red_700"
        width="100px"
      ></Div>
    </CenterColumn>
  );
}
