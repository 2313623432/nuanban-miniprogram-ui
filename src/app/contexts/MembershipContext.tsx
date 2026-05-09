import { createContext, useContext, useState, ReactNode } from "react";

interface MembershipContextType {
  isMember: boolean;
  memberExpiryDate: string;
  setIsMember: (value: boolean) => void;
  setMemberExpiryDate: (date: string) => void;
  activateMembership: (plan: "single-month" | "single-year" | "trial-week") => void;
}

const MembershipContext = createContext<MembershipContextType | undefined>(undefined);

export function MembershipProvider({ children }: { children: ReactNode }) {
  const [isMember, setIsMember] = useState(false);
  const [memberExpiryDate, setMemberExpiryDate] = useState("");

  // 激活会员并计算到期日期
  const activateMembership = (plan: "single-month" | "single-year" | "trial-week") => {
    const today = new Date();
    let expiryDate: Date;

    if (memberExpiryDate && isMember) {
      // 如果已经是会员，从到期日期开始累加
      expiryDate = new Date(memberExpiryDate);
    } else {
      // 新会员从今天开始
      expiryDate = new Date(today);
    }

    // 根据套餐类型累加时间
    if (plan === "single-month") {
      expiryDate.setMonth(expiryDate.getMonth() + 1);
    } else if (plan === "single-year") {
      expiryDate.setFullYear(expiryDate.getFullYear() + 1);
    } else if (plan === "trial-week") {
      expiryDate.setDate(expiryDate.getDate() + 7);
    }

    // 格式化日期为 YYYY-MM-DD
    const formattedDate = expiryDate.toISOString().split("T")[0];
    
    setIsMember(true);
    setMemberExpiryDate(formattedDate);
  };

  return (
    <MembershipContext.Provider
      value={{
        isMember,
        memberExpiryDate,
        setIsMember,
        setMemberExpiryDate,
        activateMembership,
      }}
    >
      {children}
    </MembershipContext.Provider>
  );
}

export function useMembership() {
  const context = useContext(MembershipContext);
  if (context === undefined) {
    throw new Error("useMembership must be used within a MembershipProvider");
  }
  return context;
}