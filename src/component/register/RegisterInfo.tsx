import { CenterColumn } from "@/styles/base/BaseComponents";
import FormInput from "@/component/common/FormInput";

export default function RegisterInfo() {
  return (
    <CenterColumn width="100%" gridGap="10px">
      <FormInput
        label="이메일"
        placeholder="user@email.com"
        errorMessage="이메일 형식이 올바르지 않습니다."
      />
      <FormInput label="패스워드" placeholder="영문, 숫자를 조합한 6자 이상" />
      <FormInput
        label="패스워드 확인"
        placeholder="패스워드를 다시 입려해 주세요."
      />
    </CenterColumn>
  );
}
