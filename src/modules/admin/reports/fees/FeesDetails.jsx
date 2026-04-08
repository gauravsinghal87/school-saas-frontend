// FeeDetails.jsx
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Button from "../../../../components/common/Button";
import { ArrowLeft, Download, Printer } from "lucide-react";
import { addFeesMutation, getPaymentHistoryDetailsQuery } from "../../../../hooks/useQueryMutations";
import { showError, showSuccess } from "../../../../utils/toast";

export default function FeeDetails() {
    const { id } = useParams(); // Get student ID from URL params
    const navigate = useNavigate();
    const [showAddFees, setShowAddFees] = useState(false);
    const [amount, setAmount] = useState("");
    const [confirmAmount, setConfirmAmount] = useState("");
    const [paymentMethod, setPaymentMethod] = useState("CASH"); // Changed to uppercase to match backend
    const [remarks, setRemarks] = useState("");
    const [paymentHistory, setPaymentHistory] = useState([]);
    const [studentDetails, setStudentDetails] = useState(null);
    const [feeStructure, setFeeStructure] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [feeSummary, setFeeSummary] = useState({
        totalFees: 0,
        paidAmount: 0,
        dueAmount: 0,
        status: "unpaid"
    });

    // Get the add fees mutation
    const { mutateAsync: addFees, isPending: isAddingFees } = addFeesMutation();

    // Fetch student details using the ID from params
    const {
        data: studentDetailsResponse,
        isLoading: isLoadingStudent,
        refetch: refetchStudent
    } = getPaymentHistoryDetailsQuery(id);

    // Process student details when API response changes
    useEffect(() => {
        if (studentDetailsResponse?.result && studentDetailsResponse.result[0]) {
            const student = studentDetailsResponse.result[0];

            // Extract student information
            const studentInfo = {
                _id: student._id,
                studentId: student.studentId?._id,
                studentName: student.studentId ?
                    `${student.studentId.firstName || ''} ${student.studentId.lastName || ''}`.trim() :
                    "N/A",
                admissionNumber: student.studentId?.admissionNumber || "N/A",
                rollNumber: student.rollNumber || "N/A",
                className: student.classId?.name || "N/A",
                classId: student.classId?._id,
                section: student.sectionId?.name || "N/A",
                sectionId: student.sectionId?._id,
                sessionId: student.sessionId,
                status: student.result || "active",
                gender: student.studentId?.gender,
                dob: student.studentId?.dob,
                address: student.studentId?.address,
                parentContact: "N/A"
            };

            setStudentDetails(studentInfo);

            // Process fee structure from API response
            if (student.feestructure) {
                const feeData = student.feestructure;
                const feeHeads = feeData.feeHeads || [];

                // Calculate total fees from fee heads
                const totalFees = feeData.totalAmount || 0;

                setFeeStructure({
                    feeHeads: feeHeads,
                    totalAmount: totalFees,
                    _id: feeData._id,
                    classId: feeData.classId,
                    academicSessionId: feeData.academicSessionId
                });

                // For now, set paid amount to 0 (you can fetch from payment history API)
                const paidAmount = 0;
                const dueAmount = totalFees - paidAmount;
                const status = dueAmount === 0 ? "paid" : paidAmount > 0 ? "partial" : "unpaid";

                setFeeSummary({
                    totalFees: totalFees,
                    paidAmount: paidAmount,
                    dueAmount: dueAmount,
                    status: status
                });
            }
        }
    }, [studentDetailsResponse]);

    // Fetch payment history (you'll need to implement this API)
    const fetchPaymentHistory = async () => {
        try {
            setIsLoading(true);
            // Replace with your actual payment history API
            // const response = await getPaymentHistory(id, { page: 1, limit: 10 });
            // if (response?.success && response?.results) {
            //   setPaymentHistory(response.results.docs || response.results || []);
            // }

            // Static payment history for now
            setPaymentHistory([
                {
                    _id: "pay1",
                    date: "2024-01-15",
                    amount: 5000,
                    method: "Online",
                    receiptNo: "RCP001",
                    status: "success"
                },
                {
                    _id: "pay2",
                    date: "2024-02-20",
                    amount: 5000,
                    method: "Cash",
                    receiptNo: "RCP002",
                    status: "success"
                }
            ]);
        } catch (error) {
            console.error("Error fetching payment history:", error);
            setPaymentHistory([]);
        } finally {
            setIsLoading(false);
        }
    };

    // Fetch payment history on component mount
    useEffect(() => {
        if (id) {
            fetchPaymentHistory();
        }
    }, [id]);

    const getStatusBadge = (status) => {
        const statusMap = {
            paid: { label: "Paid", className: "bg-success/10 text-success" },
            partial: { label: "Partial", className: "bg-warning/10 text-warning" },
            unpaid: { label: "Unpaid", className: "bg-error/10 text-error" },
            active: { label: "Active", className: "bg-success/10 text-success" },
            inactive: { label: "Inactive", className: "bg-error/10 text-error" },
            success: { label: "Success", className: "bg-success/10 text-success" },
            pending: { label: "Pending", className: "bg-warning/10 text-warning" },
            failed: { label: "Failed", className: "bg-error/10 text-error" }
        };

        const statusInfo = statusMap[status] || statusMap.unpaid;

        return (
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusInfo.className}`}>
                {statusInfo.label}
            </span>
        );
    };

    const handleAddFees = async () => {
        // Validation
        if (!amount || parseFloat(amount) <= 0) {
            showError("Please enter a valid amount");
            return;
        }

        if (parseFloat(amount) !== parseFloat(confirmAmount)) {
            showError("Amount and confirm amount do not match");
            return;
        }

        if (parseFloat(amount) > feeSummary.dueAmount) {
            showError(`Amount cannot exceed due amount of ₹ ${feeSummary.dueAmount.toLocaleString()}`);
            return;
        }

        try {
            // Prepare payload according to backend requirements
            const payload = {
                studentId: studentDetails?.studentId, // Use studentId._id from the API response
                classId: studentDetails?.classId, // Class ID from student details
                academicSession: studentDetails?.sessionId, // Session ID from student details
                amount: parseFloat(amount),
                paymentMode: paymentMethod.toUpperCase(), // Convert to uppercase: "CASH", "ONLINE", etc.
                remark: remarks || "" // Empty string if no remarks
            };

            console.log("Sending payload:", payload); // For debugging

            // Call the API mutation
            const response = await addFees(payload);

            if (response?.success) {
                showSuccess("Fees added successfully!");

                // Reset form
                setShowAddFees(false);
                setAmount("");
                setConfirmAmount("");
                setPaymentMethod("CASH");
                setRemarks("");

                // Refresh payment history
                await fetchPaymentHistory();

                // Update fee summary
                const newPaidAmount = feeSummary.paidAmount + parseFloat(amount);
                const newDueAmount = feeSummary.totalFees - newPaidAmount;
                const newStatus = newDueAmount === 0 ? "paid" : newPaidAmount > 0 ? "partial" : "unpaid";

                setFeeSummary({
                    ...feeSummary,
                    paidAmount: newPaidAmount,
                    dueAmount: newDueAmount,
                    status: newStatus
                });
            }
        } catch (error) {
            console.error("Error adding fees:", error);
            showError(error?.message || "Failed to add fees. Please try again.");
        }
    };

    const handlePrintReceipt = (payment) => {
        console.log("Printing receipt for:", payment);
    };

    const handleDownloadReceipt = (payment) => {
        console.log("Downloading receipt for:", payment);
    };

    if (isLoadingStudent) {
        return (
            <div className="p-6 text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                <p className="text-text-secondary mt-4">Loading student details...</p>
            </div>
        );
    }

    if (!studentDetails) {
        return (
            <div className="p-6 text-center">
                <p className="text-text-secondary">No student data found</p>
                <Button onClick={() => navigate(-1)} className="mt-4">
                    Go Back
                </Button>
            </div>
        );
    }

    return (
        <div className="p-6">
            {/* Header with Back Button */}
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => navigate(-1)}
                        className="p-2 hover:bg-surface-page rounded-lg transition"
                    >
                        <ArrowLeft size={20} />
                    </button>
                    <div>
                        <h1 className="text-2xl font-bold text-text-heading">Fee Details</h1>
                        <p className="text-sm text-text-secondary mt-0.5">
                            Complete fee information for {studentDetails.studentName}
                        </p>
                    </div>
                </div>

                {/* Export Options */}
                <div className="flex gap-2">
                    <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => window.print()}
                    >
                        <Printer size={16} className="mr-2" />
                        Print
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column - Student Info & Fee Structure */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Student Information Card */}
                    <div className="bg-surface-card rounded-xl border border-border p-6">
                        <h2 className="text-lg font-semibold text-text-heading mb-4">
                            Student Information
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="text-xs text-text-secondary">Student Name</label>
                                <p className="text-sm font-medium text-text-heading mt-1">
                                    {studentDetails.studentName}
                                </p>
                            </div>
                            <div>
                                <label className="text-xs text-text-secondary">Admission Number</label>
                                <p className="text-sm font-medium text-text-heading mt-1">
                                    {studentDetails.admissionNumber}
                                </p>
                            </div>
                            <div>
                                <label className="text-xs text-text-secondary">Roll Number</label>
                                <p className="text-sm font-medium text-text-heading mt-1">
                                    {studentDetails.rollNumber || "Not assigned"}
                                </p>
                            </div>
                            <div>
                                <label className="text-xs text-text-secondary">Class & Section</label>
                                <p className="text-sm font-medium text-text-heading mt-1">
                                    {studentDetails.className} - {studentDetails.section}
                                </p>
                            </div>
                            {studentDetails.gender && (
                                <div>
                                    <label className="text-xs text-text-secondary">Gender</label>
                                    <p className="text-sm font-medium text-text-heading mt-1">
                                        {studentDetails.gender}
                                    </p>
                                </div>
                            )}
                            {studentDetails.dob && (
                                <div>
                                    <label className="text-xs text-text-secondary">Date of Birth</label>
                                    <p className="text-sm font-medium text-text-heading mt-1">
                                        {new Date(studentDetails.dob).toLocaleDateString()}
                                    </p>
                                </div>
                            )}
                            <div>
                                <label className="text-xs text-text-secondary">Status</label>
                                <div className="mt-1">
                                    {getStatusBadge(studentDetails.status)}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Fee Structure Card */}
                    {feeStructure && feeStructure.feeHeads && feeStructure.feeHeads.length > 0 && (
                        <div className="bg-surface-card rounded-xl border border-border p-6">
                            <h2 className="text-lg font-semibold text-text-heading mb-4">
                                Fee Structure
                            </h2>
                            <div className="space-y-3">
                                {feeStructure.feeHeads.map((fee, index) => (
                                    <div key={index} className="flex justify-between items-center py-2 border-b border-border">
                                        <span className="text-text-secondary">{fee.type}</span>
                                        <span className="font-medium text-text-heading">
                                            ₹ {fee.amount?.toLocaleString()}
                                        </span>
                                    </div>
                                ))}
                                <div className="flex justify-between items-center pt-3">
                                    <span className="font-semibold text-text-heading">Total Fees</span>
                                    <span className="font-bold text-lg text-primary">
                                        ₹ {feeStructure.totalAmount?.toLocaleString()}
                                    </span>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Payment History Card */}
                    <div className="bg-surface-card rounded-xl border border-border p-6">
                        <h2 className="text-lg font-semibold text-text-heading mb-4">
                            Payment History
                        </h2>
                        {isLoading ? (
                            <div className="text-center py-8">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                                <p className="text-text-secondary mt-2">Loading payment history...</p>
                            </div>
                        ) : paymentHistory.length > 0 ? (
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="border-b border-border">
                                        <tr className="text-left text-sm text-text-secondary">
                                            <th className="pb-2">Date</th>
                                            <th className="pb-2">Amount (₹)</th>
                                            <th className="pb-2">Payment Method</th>
                                            <th className="pb-2">Receipt No</th>
                                            <th className="pb-2">Status</th>
                                            <th className="pb-2">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {paymentHistory.map((payment) => (
                                            <tr key={payment._id} className="border-b border-border">
                                                <td className="py-2 text-sm">
                                                    {new Date(payment.date || payment.paymentDate).toLocaleDateString()}
                                                </td>
                                                <td className="py-2 text-sm font-medium">
                                                    ₹ {payment.amount?.toLocaleString()}
                                                </td>
                                                <td className="py-2 text-sm">
                                                    {payment.method || payment.paymentMethod}
                                                </td>
                                                <td className="py-2 text-sm">
                                                    {payment.receiptNo || payment.receiptNumber}
                                                </td>
                                                <td className="py-2">
                                                    {getStatusBadge(payment.status || "success")}
                                                </td>
                                                <td className="py-2">
                                                    <div className="flex gap-2">
                                                        <button
                                                            onClick={() => handlePrintReceipt(payment)}
                                                            className="text-text-secondary hover:text-primary"
                                                            title="Print Receipt"
                                                        >
                                                            <Printer size={14} />
                                                        </button>
                                                        <button
                                                            onClick={() => handleDownloadReceipt(payment)}
                                                            className="text-text-secondary hover:text-primary"
                                                            title="Download Receipt"
                                                        >
                                                            <Download size={14} />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <p className="text-text-secondary text-center py-4">
                                No payment history available
                            </p>
                        )}
                    </div>
                </div>

                {/* Right Column - Fee Summary & Add Fees */}
                <div className="space-y-6">
                    {/* Fee Summary Card */}
                    <div className="bg-surface-card rounded-xl border border-border p-6 sticky top-6">
                        <h2 className="text-lg font-semibold text-text-heading mb-4">
                            Fee Summary
                        </h2>
                        <div className="space-y-3 mb-6">
                            <div className="flex justify-between items-center">
                                <span className="text-text-secondary">Total Fees</span>
                                <span className="font-medium text-text-heading">
                                    ₹ {feeSummary.totalFees.toLocaleString()}
                                </span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-text-secondary">Paid Amount</span>
                                <span className="font-medium text-success">
                                    ₹ {feeSummary.paidAmount.toLocaleString()}
                                </span>
                            </div>
                            <div className="flex justify-between items-center pt-3 border-t border-border">
                                <span className="font-semibold text-text-heading">Due Amount</span>
                                <span className="font-bold text-lg text-error">
                                    ₹ {feeSummary.dueAmount.toLocaleString()}
                                </span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-text-secondary">Status</span>
                                {getStatusBadge(feeSummary.status)}
                            </div>
                        </div>

                        {!showAddFees ? (
                            <Button
                                onClick={() => setShowAddFees(true)}
                                className="w-full"
                                disabled={feeSummary.dueAmount === 0}
                            >
                                Add Fees
                            </Button>
                        ) : (
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-text-heading mb-1">
                                        Amount (₹)
                                    </label>
                                    <input
                                        type="number"
                                        value={amount}
                                        onChange={(e) => setAmount(e.target.value)}
                                        placeholder="Enter amount"
                                        className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-surface text-text-heading"
                                        autoFocus
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-text-heading mb-1">
                                        Confirm Amount (₹)
                                    </label>
                                    <input
                                        type="number"
                                        value={confirmAmount}
                                        onChange={(e) => setConfirmAmount(e.target.value)}
                                        placeholder="Confirm amount"
                                        className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-surface text-text-heading"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-text-heading mb-1">
                                        Payment Method
                                    </label>
                                    <select
                                        value={paymentMethod}
                                        onChange={(e) => setPaymentMethod(e.target.value)}
                                        className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-surface text-text-heading"
                                    >
                                        <option value="CASH">Cash</option>
                                        <option value="ONLINE">Online</option>
                                        <option value="CHEQUE">Cheque</option>
                                        <option value="CARD">Card</option>
                                        <option value="BANK_TRANSFER">Bank Transfer</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-text-heading mb-1">
                                        Remarks (Optional)
                                    </label>
                                    <textarea
                                        value={remarks}
                                        onChange={(e) => setRemarks(e.target.value)}
                                        rows="3"
                                        placeholder="Add any remarks"
                                        className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-surface text-text-heading"
                                    />
                                </div>

                                <div className="flex gap-2">
                                    <Button
                                        onClick={handleAddFees}
                                        loading={isAddingFees}
                                        loadingLabel="Processing..."
                                        className="flex-1"
                                    >
                                        Confirm Payment
                                    </Button>
                                    <Button
                                        variant="secondary"
                                        onClick={() => {
                                            setShowAddFees(false);
                                            setAmount("");
                                            setConfirmAmount("");
                                            setPaymentMethod("CASH");
                                            setRemarks("");
                                        }}
                                        className="flex-1"
                                    >
                                        Cancel
                                    </Button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}