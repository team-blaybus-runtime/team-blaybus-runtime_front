import { CenterColumn } from "@/styles/base/BaseComponents";
import FormInput from "@/component/common/FormInput";

export default function LoginInfo() {
  return (
    <CenterColumn width="100%" gridGap="10px">
      <FormInput
        label="이메일"
        placeholder="이메일을 입력해주세요."
        errorMessage="이메일 형식이 올바르지 않습니다."
      />
      <FormInput label="패스워드" placeholder="패스워드를 입력해주세요." />
    </CenterColumn>
  );
}
