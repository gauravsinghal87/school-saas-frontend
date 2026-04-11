import { useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import Button from "../../../components/common/Button";
import DataTable from "../../../components/common/ReusableTable";
import {sectionList} from "../../../hooks/useQueryMutations";
import {sectionListById} from "../../../hooks/useQueryMutations";

import {
    examResultsOfStudentsMutation,

} from "../../../hooks/useQueryMutations";

import { ArrowLeft, RefreshCw } from "lucide-react";
import { showSuccess, showError } from "../../../utils/toast";

export default function ExamResults() {
    const { id } = useParams(); // examIdx
    const location = useLocation();
    const navigate = useNavigate();

    // ✅ GET classId from URL
    const queryParams = new URLSearchParams(location.search);
    const classId = queryParams.get("classId");

    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [sectionId, setSectionId] = useState(""); // ✅ NEW
    console.log("sectionId",sectionId);
    const [generating, setGenerating] = useState(false);

    // Fetch exam details
    // const { data: examData } = examById(id);
    // const exam = examData?.data?.results || examData?.results;

    // ✅ API PARAMS (MAIN LOGIC)


    const { data: resultsResponse, isLoading, refetch } =
        examResultsOfStudentsMutation({
            examId: id,
            classId: classId,
            sectionId: sectionId,
            page: page,
            limit: limit,
            search: search,
        });
        const {data:sectionsData} = sectionListById(classId);
        const sectionOptions = sectionsData?.data?.sections.map((sec) => ({
            label: sec.name,
            value: sec._id,
        })) || [];
       console.log("classsections",sectionOptions);

        console.log("sectionsData",sectionsData);
    console.log("resultsresponse", resultsResponse);
    const tableData = resultsResponse?.data?.results || [];
    const pagination = resultsResponse?.data?.pagination || {};

    // ✅ SECTION OPTIONS (from API response)


    // Generate Results
    // const { mutateAsync: generateResult } = generateResultMutation();

    // const handleGenerateResults = async () => {
    //     setGenerating(true);
    //     try {
    //         await generateResult(id);
    //         refetch();
    //         showSuccess("Results generated successfully!");
    //     } catch (err) {
    //         showError("Failed to generate results");
    //     } finally {
    //         setGenerating(false);
    //     }
    // };

    // TABLE COLUMNS (based on API)
    const COLUMNS = [
        {
            key: "student",
            label: "Student Name",
            render: (_, row) => row.student?.name || "—",
        },
        {
            key: "roll",
            label: "Roll No",
            render: (_, row) => row.student?.roll_number || "—",
        },
        {
            key: "class",
            label: "Class",
            render: (_, row) => row.class?.name || "—",
        },
        {
            key: "section",
            label: "Section",
            render: (_, row) => row.section?.name || "—",
        },
        {
            key: "total",
            label: "Total Marks",
            render: (_, row) => `${row.total_obtained}/${row.total_max}`,
        },
        {
            key: "percentage",
            label: "Percentage",
            render: (_, row) => `${row.percentage}%`,
        },
        {
            key: "status",
            label: "Result",
            render: (_, row) => row.result_status || "—",
        },
    ];

    return (
        <div className="p-6">

            {/* HEADER */}
            <div className="flex items-center gap-4 mb-6">
                <button onClick={() => navigate("/school-admin/exams")}>
                    <ArrowLeft size={22} />
                </button>

                <h1 className="text-xl font-semibold">
                    Exam Results
                </h1>
            </div>

            {/* FILTER */}
            <div className="flex gap-4 mb-4">
                <select
                    className="px-3 py-2 border border-gray-200 rounded"
                    value={sectionId}
                    onChange={(e) => {
                        setSectionId(e.target.value);
                        setPage(1);
                    }}
                >
                    {sectionOptions.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                            {opt.label}
                        </option>
                    ))}
                </select>
            </div>

            {/* ✅ DATATABLE */}
            <DataTable
                title="Exam Results"
                data={tableData}
                columns={COLUMNS}
                loading={isLoading}
                rowKey="student.id"
                serverMode

                // ✅ SEARCH
                onSearch={(val) => {
                    setSearch(val);
                    setPage(1);
                }}
                searchPlaceholder="Search student..."

                // ✅ PAGINATION
                pagination={{
                    currentPage: pagination.page || page,
                    totalPages: pagination.totalPages || 1,
                    totalItems: pagination.totalItems || 0,
                    onPageChange: setPage,
                }}
            />

        </div>
    );
}