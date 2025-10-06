'use client';

import { createContext, useContext, useState, useMemo, useCallback, ReactNode, useEffect } from 'react';

interface ModalVisibilityContextValue {
  activeModals: Set<string>;
  registerModal: (id: string) => void;
  unregisterModal: (id: string) => void;
}

const ModalVisibilityContext = createContext<ModalVisibilityContextValue | undefined>(undefined);

export function ModalVisibilityProvider({ children }: { children: ReactNode }) {
  const [activeModals, setActiveModals] = useState<Set<string>>(new Set());

  const registerModal = useCallback((id: string) => {
    setActiveModals(prev => {
      if (prev.has(id)) return prev;
      const next = new Set(prev);
      next.add(id);
      return next;
    });
  }, []);

  const unregisterModal = useCallback((id: string) => {
    setActiveModals(prev => {
      if (!prev.has(id)) return prev;
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
  }, []);

  const value = useMemo<ModalVisibilityContextValue>(() => ({ activeModals, registerModal, unregisterModal }), [activeModals, registerModal, unregisterModal]);

  return (
    <ModalVisibilityContext.Provider value={value}>
      {children}
    </ModalVisibilityContext.Provider>
  );
}

export function useModalVisibility() {
  const context = useContext(ModalVisibilityContext);
  if (!context) {
    throw new Error('useModalVisibility must be used within a ModalVisibilityProvider');
  }
  return context;
}

export function useModalRegistration(id: string, isOpen: boolean) {
  const { registerModal, unregisterModal } = useModalVisibility();

  useEffect(() => {
    if (isOpen) {
      registerModal(id);
    } else {
      unregisterModal(id);
    }

    return () => unregisterModal(id);
  }, [id, isOpen, registerModal, unregisterModal]);
}

