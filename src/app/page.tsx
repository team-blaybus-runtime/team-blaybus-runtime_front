import { CenterColumn } from "@/styles/base/BaseComponents";
import HomeInfo from "@/component/home/HomeInfo";
import StudyBtn from "@/component/home/StudyBtn";

export default function Home() {
  return (
    <CenterColumn width="100%" height="100%" p="289px 360px" gridGap="40px">
      <HomeInfo />
      <StudyBtn />
    </CenterColumn>
  );
}
