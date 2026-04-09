import { useQuery } from "@tanstack/react-query";
import {
  Wallet,
  ReceiptText,
  CheckCircle2,
  CalendarDays,
  CreditCard,
  AlertCircle,
  IndianRupee,
  User,
  GraduationCap,
} from "lucide-react";
import api from "../../../api/apiConfig"; // Adjust path if necessary
import { useParentPayments } from "../../../hooks/useQueryMutations";

// ─── SKELETON LOADER ──────────────────────────────────────────────────────────
const PaymentsSkeleton = () => (
  <div className="animate-pulse space-y-8">
    {[1, 2].map((studentIdx) => (
      <div key={studentIdx} className="space-y-4">
        {/* Student Header Skeleton */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-surface-card rounded-full border border-border"></div>
          <div className="h-5 bg-surface-card rounded w-48 border border-border"></div>
        </div>
        {/* Payment Cards Skeleton */}
        <div className="grid gap-3">
          {[1, 2].map((cardIdx) => (
            <div
              key={cardIdx}
              className="h-24 bg-surface-card border border-border rounded-2xl"
            ></div>
          ))}
        </div>
      </div>
    ))}
  </div>
);

// ─── UTILS ────────────────────────────────────────────────────────────────────
const formatCurrency = (amount) => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
};

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const getStatusConfig = (status) => {
  switch (status?.toUpperCase()) {
    case "SUCCESS":
    case "COMPLETED":
      return {
        color: "text-success",
        bg: "bg-success/10",
        border: "border-success/20",
        icon: CheckCircle2,
        text: "Success",
      };
    case "PENDING":
      return {
        color: "text-warning",
        bg: "bg-warning/10",
        border: "border-warning/20",
        icon: AlertCircle,
        text: "Pending",
      };
    case "FAILED":
      return {
        color: "text-error",
        bg: "bg-error/10",
        border: "border-error/20",
        icon: AlertCircle,
        text: "Failed",
      };
    default:
      return {
        color: "text-text-secondary",
        bg: "bg-surface-page",
        border: "border-border",
        icon: ReceiptText,
        text: status || "Unknown",
      };
  }
};

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────

export default function ParentPayments() {
 const { data: response, isLoading } = useParentPayments();

  // Assuming Axios wraps the response in `data`
  const groupedPayments = response?.data || [];
  console.log(groupedPayments)

  return (
    <div className="p-4 sm:p-6 lg:p-8 min-h-screen bg-surface-page animate-fadeUp">
      {/* ─── HEADER ─── */}
      <div className="mb-6 sm:mb-8">
        <h1 className="text-xl sm:text-2xl font-['Montserrat'] font-bold text-text-heading flex items-center gap-2">
          <Wallet className="text-primary" size={24} />
          Fee & Payment History
        </h1>
        <p className="text-xs sm:text-sm text-text-secondary mt-1 max-w-lg">
          Track all your transaction records, tuition fees, and payment statuses
          across all your children.
        </p>
      </div>

      {isLoading ? (
        <PaymentsSkeleton />
      ) : groupedPayments.length > 0 ? (
        <div className="space-y-10">
          {groupedPayments.map((studentGroup) => (
            <div key={studentGroup.student._id} className="animate-fadeUp">
              {/* Student Header */}
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold uppercase border border-primary/20 shadow-sm">
                  {studentGroup.student.name.charAt(0)}
                </div>
                <h2 className="text-lg font-['Montserrat'] font-bold text-text-heading">
                  {studentGroup.student.name}
                </h2>
              </div>

              {/* Transaction List */}
              {studentGroup.payments && studentGroup.payments.length > 0 ? (
                <div className="grid gap-4">
                  {studentGroup.payments.map((payment) => {
                    const statusConfig = getStatusConfig(payment.status);
                    const StatusIcon = statusConfig.icon;

                    return (
                      <div
                        key={payment._id}
                        className="group bg-surface-card border border-border rounded-2xl p-4 sm:p-5 hover:shadow-md hover:border-primary/30 transition-all duration-300 relative overflow-hidden"
                      >
                        {/* Hover Accent Line */}
                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary/20 group-hover:bg-primary transition-colors duration-300"></div>

                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                          {/* Left: Amount & Transaction Info */}
                          <div className="flex items-start gap-4">
                            <div className="w-12 h-12 rounded-xl bg-surface-page border border-border flex items-center justify-center flex-shrink-0 text-text-secondary group-hover:text-primary transition-colors">
                              <ReceiptText size={22} />
                            </div>

                            <div>
                              <div className="flex items-center gap-1 mb-1">
                                <IndianRupee
                                  size={16}
                                  className="text-text-primary"
                                />
                                <span className="text-xl sm:text-2xl font-bold font-['Montserrat'] text-text-heading leading-none tracking-tight">
                                  {payment.amount.toLocaleString("en-IN")}
                                </span>
                              </div>
                              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-text-secondary font-medium">
                                <span className="flex items-center gap-1.5">
                                  <GraduationCap
                                    size={13}
                                    className="opacity-70"
                                  />
                                  Class {payment.class?.name || "N/A"}
                                </span>
                                <span className="hidden sm:inline text-border">
                                  •
                                </span>
                                <span className="flex items-center gap-1.5">
                                  <CreditCard
                                    size={13}
                                    className="opacity-70"
                                  />
                                  {payment.paymentMode || "N/A"}
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Right: Date & Status */}
                          <div className="flex flex-row sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-2 border-t border-border sm:border-t-0 pt-3 sm:pt-0 mt-1 sm:mt-0">
                            <div className="flex items-center gap-1.5 text-xs text-text-secondary font-medium">
                              <CalendarDays size={13} className="opacity-70" />
                              {formatDate(payment.paymentDate)}
                            </div>

                            <div
                              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-bold uppercase tracking-wider border ${statusConfig.bg} ${statusConfig.color} ${statusConfig.border}`}
                            >
                              <StatusIcon size={14} />
                              {statusConfig.text}
                            </div>
                          </div>
                        </div>

                        {/* Remark Section (Optional) */}
                        {payment.remark && (
                          <div className="mt-3 text-xs text-text-secondary bg-surface-page p-2.5 rounded-lg border border-border/50 italic">
                            <span className="font-semibold not-italic mr-1">
                              Note:
                            </span>{" "}
                            {payment.remark}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="p-6 bg-surface-card border border-border rounded-2xl text-center shadow-sm">
                  <p className="text-sm text-text-secondary">
                    No payment records found for this student.
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        /* ─── EMPTY STATE ─── */
        <div className="flex flex-col items-center justify-center py-20 text-center bg-surface-card border border-dashed border-border rounded-2xl animate-fadeUp shadow-sm">
          <div className="w-16 h-16 bg-surface-page rounded-full flex items-center justify-center mb-4 border border-border">
            <ReceiptText className="text-text-secondary opacity-50" size={32} />
          </div>
          <h3 className="text-[16px] font-bold text-text-primary mb-1">
            No Payment History
          </h3>
          <p className="text-sm text-text-secondary max-w-[280px]">
            You do not have any recorded transactions or fee payments at this
            time.
          </p>
        </div>
      )}
    </div>
  );
}
