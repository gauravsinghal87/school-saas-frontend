import { useState, useEffect } from "react";
import { set, useForm } from "react-hook-form";
import SidePanel from "../../../components/common/SlidePanel";
import ClassForm from "./ClassForm";
import Button from "../../../components/common/Button";
import { createClassMutation, updateClassMutation, deleteClassMutation, updateSubscriptionStatusMutation } from "../../../hooks/useQueryMutations";
import { classesListMutation } from "../../../hooks/useQueryMutations";
import DataTable from "../../../components/common/ReusableTable";
import ConfirmBox from "../../../components/common/ConfirmBox";
import ToggleButton from "../../../components/common/ToggleButton";




export default function Classes() {
    const [isOpen, setIsOpen] = useState(false);
    const [isloading, setIsLoading] = useState(false);
    const [limit, setLimit] = useState(10);

    const [mode, setMode] = useState("create");
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [selected, setSelected] = useState(null);
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const STATUS_MAP = {
        active: { label: "Active", bg: "bg-success/10", text: "text-success" },
        inactive: { label: "Inactive", bg: "bg-error/10", text: "text-error" },
    };
    const { mutateAsync: updateSubscriptionStatus, isPending: isUpdatingStatus } = updateSubscriptionStatusMutation();

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
  label: "Name",
  sortable: true,
  render: (val) => {
    if (!val) return "—";

    const num = parseInt(val);

    // handle suffix
    let suffix = "th";
    if (num % 10 === 1 && num !== 11) suffix = "st";
    else if (num % 10 === 2 && num !== 12) suffix = "nd";
    else if (num % 10 === 3 && num !== 13) suffix = "rd";

    return `${num}${suffix} `;
  },
},

  {
    key: "studentCount",
    label: "Students",
  },
{
  key: "sections",
  label: "Sections",
  render: (val) => {
    if (!val || val.length === 0) return "—";

    return (
      <div className="flex gap-1 flex-wrap">
        {val.map((sec) => (
          <span
            key={sec._id}
            className="px-2 py-0.5 text-xs bg-gray-100 rounded"
          >
            {sec.name}
          </span>
        ))}
      </div>
    );
  },
},
  {
    key: "createdAt",
    label: "Created",
    render: (val) =>
      val ? new Date(val).toLocaleDateString() : "—",
  },
];

    const { mutateAsync: createClass, isPending } = createClassMutation();

    const { register, handleSubmit, control, reset, formState: { errors } } = useForm({
        defaultValues: {
            name: "",
            price: "",
            duration_days: "",
            features: "",
            status: "active",
        },
    });
    const { data: apiResponse, isLoading, refetch } = classesListMutation({ page, limit, search });
    const { mutateAsync: updateClass, isPending: isupdating } = updateClassMutation();
    const { mutateAsync: deleteClass } = deleteClassMutation();
const tableData = apiResponse?.results || [];
const total = apiResponse?.pagination?.totalItems ?? 0;
    // Load data
    //   const fetchData = async () => {
    //     const res = await getSubscriptions();
    //     setData(res.data);
    //   };

    //   useEffect(() => {
    //     fetchData();
    //   }, []);

    // Open modal
const openModal = (type, item = null) => {
  setMode(type);
  setSelected(item);

  if (type === "edit" && item) {
    reset({
      name: item.name,
      academicSessionId: item.academicSessionId,
    });
  } else {
    reset({
      name: "",
      academicSessionId: "",
    });
  }

  setIsOpen(true);
};

    // Submit
const onSubmit = async (formData) => {
    console.log("formdata",formData);
  try {
    const payload = {
      name: formData.name,
      academicSessionId: formData.academicSessionId,
    };

    if (mode === "create") {
      await createClass(payload);
    } else {
      await updateClass({
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

    // Delete
    const handleDelete = async () => {
        await deleteClass(selected._id);
        refetch();
        setIsOpen(false);
    };

    return (
        <div className="p-6">


            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-text-heading">Classes</h1>
                    <p className="text-sm text-text-secondary mt-0.5">
                        Manage all Classes on EduCore.
                    </p>
                </div>
                <div className="flex justify-end">
                    <Button onClick={() => openModal("create")} >
                        Add Class
                    </Button>
                </div>
            </div>
            {/* Add Button */}


            {/* List */}
            <div className="grid gap-3 mt-6 ">
                {/* {data.map((item) => (
                    <div key={item._id} className="border p-4 rounded-md flex justify-between">
                        <div>
                            <h3 className="font-bold">{item.name}</h3>
                            <p>₹ {item.price}</p>
                        </div>

                        <div className="flex gap-2">
                            <button onClick={() => openModal("view", item)}>View</button>
                            <button onClick={() => openModal("edit", item)}>Edit</button>
                            <button onClick={() => openModal("delete", item)}>Delete</button>
                        </div>
                    </div>
                ))} */}

                <DataTable
                    title="All Classes"
                    data={tableData}
                    columns={COLUMNS}
                    loading={isLoading}
                    rowKey="_id"
                    serverMode
                    onAdd={() => openModal("create")}
                    addLabel="Add Subscription"
                    onSearch={(val) => { setSearch(val); setPage(1); }}

                    onEdit={(row) => openModal("edit", row)}
                    onDelete={(row) => {
                        setSelected(row);
                        setConfirmOpen(true);
                    }}
                    


                    searchPlaceholder="Search classes..."
                />
            </div>

            {/* Modal */}
            <SidePanel
                open={isOpen}
                onClose={() => setIsOpen(false)}
                title={`${mode.toUpperCase()} Class`}
            >

                <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">

                    <ClassForm
                        register={register}
                        errors={errors}
                        mode={mode}
                        control={control}
                    />

                    <div className="flex justify-end mt-auto">
                        {mode !== "view" && (
                            <Button type="submit" loading={mode == "edit" ? isupdating : isPending} loadingLabel={mode === "edit" ? "Updating..." : "Creating..."} variant="primary">
                                {mode === "edit" ? "Update" : "Create"}
                            </Button>
                        )}
                    </div>
                </form>

            </SidePanel>
            <ConfirmBox
                isOpen={confirmOpen}
                title="Delete Subscription"
                message={`Are you sure you want to delete "${selected?.name}"?`}
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
            />
        </div>
    );
}