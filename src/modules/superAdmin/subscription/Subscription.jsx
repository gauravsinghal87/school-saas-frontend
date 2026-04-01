import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import Modal from "../../../components/common/";
import SubscriptionForm from "./components/SubscriptionForm";
// import {
//   createSubscription,
//   updateSubscription,
//   deleteSubscription,
//   getSubscriptions,
// } from "./subscription.api";

export default function Subscription() {
  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState("create");
  const [selected, setSelected] = useState(null);
  const [data, setData] = useState([]);

  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  // Load data
  const fetchData = async () => {
    const res = await getSubscriptions();
    setData(res.data);
  };

  useEffect(() => {
    fetchData();
  }, []);

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
    //   if (mode === "create") {
    //     await createSubscription(formData);
    //   } else if (mode === "edit") {
    //     await updateSubscription(selected._id, formData);
    //   }

    //   fetchData();
    //   setIsOpen(false);
    }
     catch (err) {
      console.error(err);
    }
  };

  // Delete
  const handleDelete = async () => {
    // await deleteSubscription(selected._id);
    // fetchData();
    // setIsOpen(false);
  };

  return (
    <div className="p-6">

      {/* Add Button */}
      <button
        onClick={() => openModal("create")}
        className="bg-primary text-white px-4 py-2 rounded-md mb-4"
      >
        Add Subscription
      </button>

      {/* List */}
      <div className="grid gap-3">
        {data.map((item) => (
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
        ))}
      </div>

      {/* Modal */}
      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title={`${mode.toUpperCase()} Subscription`}
      >
        {mode === "delete" ? (
          <div className="flex flex-col gap-4">
            <p>Are you sure you want to delete this subscription?</p>

            <button
              onClick={handleDelete}
              className="bg-red-600 text-white py-2 rounded-md"
            >
              Delete
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
            
            <SubscriptionForm
              register={register}
              errors={errors}
              mode={mode}
            />

            {mode !== "view" && (
              <button className="bg-primary text-white py-2 rounded-md">
                {mode === "edit" ? "Update" : "Create"}
              </button>
            )}
          </form>
        )}
      </Modal>
    </div>
  );
}