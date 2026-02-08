"use client";
import { useFetchUserInfoQuery } from "@/queries/users/useFetchUserInfoQuery";
import { CenterRow } from "@/styles/base/BaseComponents";
import { Img } from "@/styles/base/BaseStyledTags";
import { Font } from "@/styles/typo/typography";
import { useRouter } from "next/navigation";
import { getAccessToken } from "@/utils/authTokens";

export default function StudyBtn() {
  const router = useRouter();
  const accessToken = getAccessToken();
  const { data: userInfo } = useFetchUserInfoQuery(Boolean(accessToken));
  const isLoggedIn = Boolean(userInfo);
  const handleStudyClick = () => {
    if (isLoggedIn) {
      router.push("/main");
    } else {
      router.push("/login");
    }
  };
  return (
    <CenterRow
      p="10px 12px"
      bg="blue_700"
      borderRadius="8px"
      gridGap="4px"
      width="480px"
      height="40px"
      style={{
        cursor: "pointer",
      }}
      onClick={handleStudyClick}
    >
      <Font typo="button_2" color="neutral_0">
        학습하기
      </Font>
      <Img
        src="/icons/common/rightArrow.svg"
        alt="study-arrow"
        width="20px"
        height="20px"
      />
    </CenterRow>
  );
}
