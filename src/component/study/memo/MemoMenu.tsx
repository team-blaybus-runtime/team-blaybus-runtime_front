"use client";

import { useCallback, useState } from "react";
import styled from "styled-components";
import { Column } from "@/styles/base/BaseComponents";
import { Button, Img } from "@/styles/base/BaseStyledTags";
import colors from "@/styles/constant/colors";
import { zIndex } from "@/styles/constant/zIndex";

interface MemoMenuProps {
  onEdit?: () => void;
  onDelete?: () => void;
}

export default function MemoMenu({ onEdit, onDelete }: MemoMenuProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleToggle = useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      event.stopPropagation();
      setIsOpen((prev) => !prev);
    },
    [],
  );

  const handleClose = useCallback(() => {
    setIsOpen(false);
  }, []);

  return (
    <MenuWrapper>
      <MenuButton type="button" onClick={handleToggle}>
        <Img
          src="/icons/common/verticalDot.svg"
          alt="edit"
          width="24px"
          height="24px"
        />
      </MenuButton>
      {isOpen && (
        <MenuDropdown onClick={(event) => event.stopPropagation()}>
          <MenuItem
            type="button"
            onClick={() => {
              onEdit?.();
              handleClose();
            }}
          >
            수정
          </MenuItem>
          <MenuItem
            type="button"
            onClick={() => {
              onDelete?.();
              handleClose();
            }}
          >
            삭제
          </MenuItem>
        </MenuDropdown>
      )}
    </MenuWrapper>
  );
}

const MenuWrapper = styled.div`
  position: relative;
`;

const MenuButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  padding: 0;
  background: transparent;
  border: none;
  cursor: pointer;
`;

const MenuDropdown = styled(Column)`
  width: 100%;
  min-width: 177px;
  position: absolute;
  right: 0;
  bottom: 120px;
  transform: translateY(100%);
  background: ${colors.neutral_700};
  border-radius: 4px;
  z-index: ${zIndex.dropdown};
`;

const MenuItem = styled(Button).attrs({ typo: "body_1" })`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  width: 100%;
  padding: 10px 20px;
  height: 42px;
  cursor: pointer;
  text-align: left;
  color: ${colors.neutral_0};
`;
