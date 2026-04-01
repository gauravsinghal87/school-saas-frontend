import { useState, useEffect } from "react";
import { set, useForm } from "react-hook-form";
import SidePanel from "../../../components/common/SlidePanel";
import SubscriptionForm from "./components/SubscriptionForm";
import Button from "../../../components/common/Button";
import { createSubscriptionMutation, updateSubscriptionMutation, deleteSubscriptionMutation, updateSubscriptionStatusMutation } from "../../../hooks/useQueryMutations";
import { subscriptionList } from "../../../hooks/useQueryMutations";
import DataTable from "../../../components/common/ReusableTable";
import ConfirmBox from "../../../components/common/ConfirmBox";
import ToggleButton from "../../../components/common/ToggleButton";




export default function Subscription() {
    const [isOpen, setIsOpen] = useState(false);
    const [isloading, setIsLoading] = useState(false);
    const [limit, setLimit] = useState(10);

    const [mode, setMode] = useState("create");
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [selected, setSelected] = useState(null);
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    console.log("selected", selected);
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
        { key: "name", label: "Subscription Name", sortable: true },

        {
            key: "price",
            label: "Price",
            sortable: true,
            render: (val) => `₹ ${val}`,
        },

        {
            key: "duration_days",
            label: "Duration (Days)",
            sortable: true,
            width: "140px",
        },

        { key: "features", label: "Features" },
        {
            key: "status",
            label: "Status",
            sortable: true,
            width: "110px",
            render: (val, row) => (
                <ToggleButton
                    isActive={val === "active"}
                    //   loading={isupdating && selected?._id === row._id}
                    onToggle={() => handleToggleStatus(row)}
                />
            ),
        },

        {
            key: "createdAt",
            label: "Created",
            sortable: true,
            render: (val) =>
                val
                    ? new Date(val).toLocaleDateString()
                    : "—",
        },
    ];

    const { mutateAsync: createSubscriptionPlan, isPending } = createSubscriptionMutation();
    console.log("ispending", isPending);

    const { register, handleSubmit, control, reset, formState: { errors } } = useForm({
        defaultValues: {
            name: "",
            price: "",
            duration_days: "",
            features: "",
            status: "active",
        },
    });
    const { data: apiResponse, isLoading, refetch } = subscriptionList({ page, limit, search });
    const { mutateAsync: updateSubscription, isPending: isupdating } = updateSubscriptionMutation();
    console.log("isupdating", isupdating);
    const { mutateAsync: deleteSubscription } = deleteSubscriptionMutation();
    const tableData = apiResponse?.data || [];
    const total = apiResponse?.data?.pagination?.total ?? 0;

    console.log("tabledata", tableData);

    console.log("apiresponse", apiResponse);
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

        if (item) {
            reset(item); // fill form
        } else {
            reset({});
        }

        setIsOpen(true);
    };

    // Submit
    const onSubmit = async (formData) => {
        try {
            if (mode === "create") {
                await createSubscriptionPlan(formData);
            } else if (mode === "edit") {
                console.log("updatedformdata", formData);
                await updateSubscription({ id: selected._id, formData });

            }

            refetch();
            setIsOpen(false);
        } catch (err) {
            console.error(err);
        }
    };

    // Delete
    const handleDelete = async () => {
        await deleteSubscription(selected._id);
        refetch();
        setIsOpen(false);
    };

    return (
        <div className="p-6">


            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-text-heading">Schools</h1>
                    <p className="text-sm text-text-secondary mt-0.5">
                        Manage all Subscribtions on EduCore.
                    </p>
                </div>
                <div className="flex justify-end">
                    <Button onClick={() => openModal("create")} >
                        Add Subscription
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
                    title="All Subscriptions"
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


                    searchPlaceholder="Search subscriptions..."
                />
            </div>

            {/* Modal */}
            <SidePanel
                open={isOpen}
                onClose={() => setIsOpen(false)}
                title={`${mode.toUpperCase()} Subscription`}
            >

                <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">

                    <SubscriptionForm
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
                        await deleteSubscription(selected._id);
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