import { Button } from "@/styles/base/BaseStyledTags";
import { Font } from "@/styles/typo/typography";
import { useRouter } from "next/navigation";

export default function LoginBtn() {
  const router = useRouter();
  return (
    <Button
      bg="neutral_0"
      width="auto"
      height="32px"
      borderRadius="8px"
      p="6px 8px"
    >
      <Font
        typo="button_3"
        color="blue_700"
        textAlign="center"
        bg="neutral_0"
        onClick={() => router.push("/login")}
        style={{ cursor: "pointer" }}
      >
        로그인/회원가입
      </Font>
    </Button>
  );
}
