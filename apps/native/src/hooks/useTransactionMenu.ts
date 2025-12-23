/**
 * @fileoverview useTransactionMenu hook
 * @module @kakeibo/native/hooks
 */

import { useState } from 'react';

export const useTransactionMenu = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const openMenu = () => setMenuOpen(true);
  const closeMenu = () => setMenuOpen(false);
  const toggleMenu = () => setMenuOpen(!menuOpen);

  return {
    menuOpen,
    openMenu,
    closeMenu,
    toggleMenu,
  };
};
