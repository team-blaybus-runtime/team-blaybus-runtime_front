import StudyBtn from "@/component/landing/StudyBtn";
import { CenterColumn } from "@/styles/base/BaseComponents";
import { Div, Img } from "@/styles/base/BaseStyledTags";

export default function Home() {
  return (
    <CenterColumn width="100%" height="100%">
      <Img src="/icons/landing/landing.svg" alt="landing-img" />
      <Div
        position="absolute"
        bottom="40px"
        left="0"
        right="0"
        height="100px"
        width="100%"
        display="flex"
        justifyContent="center"
      >
        <StudyBtn />
      </Div>
    </CenterColumn>
  );
}
