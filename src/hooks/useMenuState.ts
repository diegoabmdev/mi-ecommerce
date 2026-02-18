// src/hooks/useMenuState.ts
// manejo de sheets/menús abiertos
import { useState } from "react";

export const useMenuState = () => {
  const [mainOpen, setMainOpen] = useState(false);
  const [categoriesOpen, setCategoriesOpen] = useState(false);

  const openCategories = () => {
    setMainOpen(false);
    setTimeout(() => setCategoriesOpen(true), 300);
  };

  const closeCategoriesAndOpenMain = () => {
    setCategoriesOpen(false);
    setTimeout(() => setMainOpen(true), 300);
  };

  return {
    mainOpen,
    setMainOpen,
    categoriesOpen,
    setCategoriesOpen,
    openCategories,
    closeCategoriesAndOpenMain,
  };
};
