import StudyBtn from "@/component/landing/StudyBtn";
import { CenterColumn } from "@/styles/base/BaseComponents";
import { Div, Img } from "@/styles/base/BaseStyledTags";

export default function Home() {
  return (
    <CenterColumn width="100%" height="100%">
      <Img src="/icons/landing/landing.svg" alt="landing-img" />
      {/* <Div
        position="absolute"
        bottom="0"
        left="5%"
        right="0"
        height="100px"
        width="80%"
      >
        <StudyBtn />
      </Div> */}
    </CenterColumn>
  );
}
