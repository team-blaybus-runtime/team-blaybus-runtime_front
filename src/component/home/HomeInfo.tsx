import { CenterColumn } from "@/styles/base/BaseComponents";
import { Img } from "@/styles/base/BaseStyledTags";

export default function HomeInfo() {
  return (
    <CenterColumn width="1200px" height="208px" gridGap="25px">
      <Img
        src="/icons/home/homeLogo.svg"
        alt="home-info"
        width="145.6px"
        height="auto"
      />
      <CenterColumn gridGap="30px">
        <Img
          src="/icons/home/homeProductName.svg"
          alt="product-name"
          width="503px"
          height="auto"
        />
        <Img
          src="/icons/home/homeProductDetail.svg"
          alt="product-detail"
          width="556px"
          height="auto"
        />
      </CenterColumn>
    </CenterColumn>
  );
}
