import { CenterColumn } from "@/styles/base/BaseComponents";
import HomeInfo from "@/component/home/HomeInfo";
import StudyBtn from "@/component/home/StudyBtn";

export default function Home() {
  return (
    <CenterColumn width="100%" height="100%" py="289px" gridGap="40px">
      <HomeInfo />
      <StudyBtn />
    </CenterColumn>
  );
}
