import { useState, useEffect } from "react";
import { set, useForm } from "react-hook-form";
import SidePanel from "../../../components/common/SlidePanel";
import SectionForm from "./SectionForm";
import Button from "../../../components/common/Button";
import { createSectionMutation, updateSectionMutation, deleteClassMutation, updateSubscriptionStatusMutation } from "../../../hooks/useQueryMutations";
import { sectionList } from "../../../hooks/useQueryMutations";
import DataTable from "../../../components/common/ReusableTable";
import ConfirmBox from "../../../components/common/ConfirmBox";
import ToggleButton from "../../../components/common/ToggleButton";
import { classesListMutation } from "../../../hooks/useQueryMutations";
import Select from "../../../components/common/Select";

export default function Sections() {
    const [isOpen, setIsOpen] = useState(false);
    const [isloading, setIsLoading] = useState(false);
    const [limit, setLimit] = useState(10);
    const [mode, setMode] = useState("create");
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [selectedClass, setSelectedClass] = useState("");
    const [selected, setSelected] = useState(null);
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    
    const STATUS_MAP = {
        active: { label: "Active", bg: "bg-success/10", text: "text-success" },
        inactive: { label: "Inactive", bg: "bg-error/10", text: "text-error" },
    };
    
    const { mutateAsync: updateSection, isPending: isUpdatingStatus } = updateSectionMutation();

    const handleToggleStatus = async (row) => {
        try {
            const newStatus = row.status === "active" ? "inactive" : "active";
            await updateSubscriptionStatus({
                id: row._id,
                data: { status: newStatus },
            });
            refetch();
        } catch (err) {
            console.error(err);
        }
    };

    const COLUMNS = [
        {
            key: "name",
            label: "Section",
        },
        {
            key: "class",
            label: "Class",
            render: (_, row) => row?.class?.name || "—",
        },
    ];

    const { mutateAsync: createSection, isPending } = createSectionMutation();
    const { register, handleSubmit, control, reset, formState: { errors } } = useForm({
        defaultValues: {
            name: "",
            price: "",
            duration_days: "",
            features: "",
            status: "active",
        },
    });
    
    const { data: apiResponse, isLoading, refetch } = sectionList({
        page,
        limit,
        search,
        classId: selectedClass,
    });

    const { data: classData } = classesListMutation({ page: 1, limit: 100 });
    const classOptions = classData?.results?.map((cls) => ({
        label: cls.name,
        value: cls._id,
    })) || [];

    const { mutateAsync: deleteClass } = deleteClassMutation();
    const tableData = apiResponse?.results?.docs || [];
    const total = apiResponse?.results?.totalDocs ?? 0;

    const openModal = (type, item = null) => {
        setMode(type);
        setSelected(item);
        if (type === "edit" && item) {
            reset({ name: item.name });
        } else {
            reset({ name: "" });
        }
        setIsOpen(true);
    };

    const onSubmit = async (formData) => {
        try {
            const payload = {
                name: formData.name,
                classId: selectedClass,
            };
            if (mode === "create") {
                await createSection(payload);
            } else {
                await updateSection({
                    id: selected._id,
                    data: payload,
                });
            }
            refetch();
            setIsOpen(false);
        } catch (err) {
            console.error(err);
        }
    };

    const handleDelete = async () => {
        await deleteClass(selected._id);
        refetch();
        setIsOpen(false);
    };

    // Modern section cards data
    const sectionCards = [
        { id: 1, name: "Section A", class: "Class 10", students: 32, color: "from-blue-500 to-indigo-600", icon: "📚" },
        { id: 2, name: "Section B", class: "Class 10", students: 28, color: "from-emerald-500 to-teal-600", icon: "🎓" },
        { id: 3, name: "Section C", class: "Class 9", students: 30, color: "from-purple-500 to-pink-600", icon: "📖" },
        { id: 4, name: "Section D", class: "Class 9", students: 26, color: "from-orange-500 to-red-600", icon: "✏️" },
    ];

    const [selectedSection, setSelectedSection] = useState(null);

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                
                {/* Header Section */}
                <div className="mb-8">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                            <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                                Sections
                            </h1>
                            <p className="text-sm text-gray-500 mt-1 flex items-center gap-2">
                                <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                                Manage all sections across different classes
                            </p>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="relative">
                                <Select
                                    value={selectedClass}
                                    onChange={(e) => setSelectedClass(e.target.value)}
                                    options={classOptions}
                                    placeholder="Filter by Class"
                                    className="w-48 bg-white/80 backdrop-blur-sm border-gray-200 focus:border-emerald-500 transition-all duration-200"
                                />
                            </div>
                            <Button 
                                onClick={() => openModal("create")}
                                className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                            >
                                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                </svg>
                                Add Section
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Modern Section Cards */}

                {/* Data Table Section */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
               
                    <DataTable
                        data={tableData}
                        columns={COLUMNS}
                        loading={isLoading}
                        rowKey="_id"
                        serverMode
                        onAdd={() => openModal("create")}
                        addLabel="Add Section"
                        onSearch={(val) => { setSearch(val); setPage(1); }}
                        onEdit={(row) => openModal("edit", row)}
                        onDelete={(row) => {
                            setSelected(row);
                            setConfirmOpen(true);
                        }}
                        searchPlaceholder="Search sections..."
                        className="border-0"
                    />
                </div>

                {/* Side Panel Modal */}
                <SidePanel
                    open={isOpen}
                    onClose={() => setIsOpen(false)}
                    title={`${mode.toUpperCase()} Section`}
                    className="bg-gradient-to-br from-white to-gray-50"
                >
                    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6 p-1">
                        <SectionForm
                            register={register}
                            errors={errors}
                            mode={mode}
                            control={control}
                            selectedClass={selectedClass}
                            setSelectedClass={setSelectedClass}
                            classOptions={classOptions}
                        />
                        <div className="flex justify-end pt-4 border-t border-gray-100 mt-auto">
                            {mode !== "view" && (
                                <Button 
                                    type="submit" 
                                    loading={mode == "edit" ? isUpdatingStatus : isPending} 
                                    loadingLabel={mode === "edit" ? "Updating..." : "Creating..."} 
                                    variant="primary"
                                    className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 shadow-md"
                                >
                                    {mode === "edit" ? "Update Section" : "Create Section"}
                                </Button>
                            )}
                        </div>
                    </form>
                </SidePanel>

                {/* Confirm Delete Modal */}
                <ConfirmBox
                    isOpen={confirmOpen}
                    title="Delete Section"
                    message={`Are you sure you want to delete "${selected?.name}"? This action cannot be undone.`}
                    loading={isPending}
                    onCancel={() => setConfirmOpen(false)}
                    onConfirm={async () => {
                        try {
                            await deleteClass(selected._id);
                            refetch();
                            setConfirmOpen(false);
                        } catch (err) {
                            console.error(err);
                        }
                    }}
                    className="rounded-2xl"
                />
            </div>
        </div>
    );
}