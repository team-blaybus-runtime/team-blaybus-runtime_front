import { useCallback, useEffect, useMemo, useState } from "react";
import type { MemoItem } from "@/type/memo";
import { useDeleteUserMemoMutation } from "@/queries/users/memos/useDeleteUserMemoMutation";
import { useUpdateUserMemoMutation } from "@/queries/users/memos/useUpdateUserMemoMutation";

interface UseMemoDetailModalParams {
  memo: MemoItem;
  onClose: () => void;
  onEditingChange?: (isEditing: boolean) => void;
}

export default function useMemoDetailModal({
  memo,
  onClose,
  onEditingChange,
}: UseMemoDetailModalParams) {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(memo.title);
  const [editContent, setEditContent] = useState(memo.content);
  const { mutate: updateMemo, isPending } = useUpdateUserMemoMutation();
  const { mutate: deleteMemo, isPending: isDeleting } =
    useDeleteUserMemoMutation();

  useEffect(() => {
    setIsEditing(false);
    setEditTitle(memo.title);
    setEditContent(memo.content);
  }, [memo.content, memo.memoId, memo.title]);

  useEffect(() => {
    onEditingChange?.(isEditing);
  }, [isEditing, onEditingChange]);

  const trimmedTitle = editTitle.trim();
  const trimmedContent = editContent.trim();
  const memoIdNumber = useMemo(() => Number(memo.memoId), [memo.memoId]);
  const isSaveDisabled =
    !trimmedTitle ||
    !trimmedContent ||
    (trimmedTitle === memo.title && trimmedContent === memo.content) ||
    isPending ||
    Number.isNaN(memoIdNumber);

  const handleEditStart = useCallback(() => {
    setIsEditing(true);
    setEditTitle(memo.title);
    setEditContent(memo.content);
  }, [memo.content, memo.title]);

  const handleSave = useCallback(() => {
    if (isSaveDisabled) return;

    updateMemo(
      {
        memoId: memoIdNumber,
        title: trimmedTitle,
        content: trimmedContent,
      },
      {
        onSuccess: () => {
          setIsEditing(false);
        },
      },
    );
  }, [
    isSaveDisabled,
    memoIdNumber,
    trimmedContent,
    trimmedTitle,
    updateMemo,
  ]);

  const handleDelete = useCallback(() => {
    if (Number.isNaN(memoIdNumber) || isDeleting) return;

    deleteMemo(
      { memoId: memoIdNumber },
      {
        onSuccess: () => {
          onClose();
        },
      },
    );
  }, [deleteMemo, isDeleting, memoIdNumber, onClose]);

  return {
    isEditing,
    editTitle,
    editContent,
    isPending,
    isSaveDisabled,
    setEditTitle,
    setEditContent,
    handleEditStart,
    handleSave,
    handleDelete,
  };
}
