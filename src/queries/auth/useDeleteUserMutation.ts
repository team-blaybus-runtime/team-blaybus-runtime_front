import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

import { deleteUser } from "@/apis/auth";
import { clearTokens } from "@/utils/authTokens";
import { toast } from "sonner";

export const useDeleteUserMutation = () => {
  const router = useRouter();

  return useMutation({
    mutationKey: ["deleteUser"],
    mutationFn: () => deleteUser(),
    onSuccess: () => {
      clearTokens();
      toast.success("탈퇴가 완료되었습니다.");
      router.push("/");
    },
    onError: (error) => {
      console.error(error);
    },
  });
};
