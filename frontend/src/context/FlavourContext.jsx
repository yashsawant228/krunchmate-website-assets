import React, { createContext, useContext, useState, useCallback, useMemo, useEffect } from "react";
import { FLAVOURS, FLAVOUR_LIST } from "../data/flavours";

const FlavourContext = createContext(null);

export function FlavourProvider({ children }) {
  const [activeId, setActiveId] = useState("salt-vinegar");

  const active = useMemo(() => FLAVOURS[activeId], [activeId]);

  const setFlavour = useCallback((id) => {
    if (FLAVOURS[id]) setActiveId(id);
  }, []);

  const cycleFlavour = useCallback(() => {
    const idx = FLAVOUR_LIST.findIndex((f) => f.id === activeId);
    const next = FLAVOUR_LIST[(idx + 1) % FLAVOUR_LIST.length];
    setActiveId(next.id);
  }, [activeId]);

  useEffect(() => {
    document.body.setAttribute("data-palette", active.palette);
  }, [active]);

  const value = { active, activeId, setFlavour, cycleFlavour, list: FLAVOUR_LIST };
  return <FlavourContext.Provider value={value}>{children}</FlavourContext.Provider>;
}

export const useFlavour = () => {
  const ctx = useContext(FlavourContext);
  if (!ctx) throw new Error("useFlavour must be used within FlavourProvider");
  return ctx;
};
