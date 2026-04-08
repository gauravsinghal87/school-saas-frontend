import React, { useState } from "react";
import {
    Calendar,
    Plus,
    Search,
    Edit2,
    Trash2,
    CalendarDays,
    Loader2
} from "lucide-react";

import Textarea from "../../../components/common/Textarea";
import Button from "../../../components/common/Button";
import Card from "../../../components/common/Card";
import Input from "../../../components/common/Input";
import SlidePanel from "../../../components/common/SlidePanel"; // 👈 Your new component

import {
    createHolidayMutation,
    deleteHolidayMutation,
    getHolidaysQuery,
    updateHolidayMutation,
} from "../../../hooks/useQueryMutations";

const HolidaysPage = () => {
    const [form, setForm] = useState({ date: "", title: "", description: "" });
    const [search, setSearch] = useState("");
    const [editId, setEditId] = useState(null);
    const [showForm, setShowForm] = useState(false);

    const { data, isLoading } = getHolidaysQuery({ page: 1, limit: 50, search });

    const createMutation = createHolidayMutation();
    const updateMutation = updateHolidayMutation();
    const deleteMutation = deleteHolidayMutation();

    const holidays = data?.data?.holidays || [];
    const isProcessing = createMutation.isLoading || updateMutation.isLoading;

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const closeForm = () => {
        setShowForm(false);
        setEditId(null);
        setForm({ date: "", title: "", description: "" });
    };

    const handleSubmit = async () => {
        try {
            if (editId) {
                await updateMutation.mutateAsync({ holidayId: editId, data: form });
            } else {
                await createMutation.mutateAsync(form);
            }
            closeForm();
        } catch (err) { console.error(err); }
    };

    const handleEdit = (item) => {
        setForm({
            date: item.date?.split("T")[0],
            title: item.title,
            description: item.description,
        });
        setEditId(item._id);
        setShowForm(true);
    };

    return (
        <div className="min-h-screen bg-surface-page px-4 py-8">
            <div className="max-w-7xl mx-auto space-y-6">


                {/* --- HEADER --- */}
                <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div>
                        <h1 className="text-3xl font-extrabold text-text-heading font-['Montserrat'] tracking-tight">
                            Holiday Management
                        </h1>
                        <p className="text-text-secondary mt-1">
                            Schedule and review academic breaks
                        </p>
                    </div>
                    <Button
                        onClick={() => setShowForm(true)}
                        className="bg-button-primary hover:bg-button-primary-hover text-button-primary-text flex items-center gap-2 px-6 py-3 shadow-md transition-transform active:scale-95"
                    >
                        <Plus size={18} />
                        <span className="font-['Montserrat'] font-bold uppercase tracking-wider text-xs">Add Holiday</span>
                    </Button>
                </header>

                {/* --- SEARCH --- */}
                <div className="relative group max-w-md">
                    <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-text-secondary group-focus-within:text-primary transition-colors">
                        <Search size={18} />
                    </div>
                    <input
                        type="text"
                        className="w-full pl-11 pr-4 py-3 bg-surface-card border border-border rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all shadow-sm text-text-primary"
                        placeholder="Search holidays..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>

                {/* --- CONTENT --- */}
                {isLoading ? (
                    <div className="flex flex-col items-center justify-center py-24 gap-3">
                        <Loader2 className="animate-spin text-primary" size={40} />
                        <span className="font-['Montserrat'] text-[10px] font-bold uppercase tracking-[0.2em] text-text-secondary">Syncing Calendar</span>
                    </div>
                ) : holidays.length === 0 ? (
                    <Card className="text-center py-20 border-dashed border-2 bg-transparent border-border">
                        <CalendarDays className="mx-auto text-text-secondary/20 mb-4" size={48} />
                        <p className="text-text-secondary font-['Montserrat'] font-semibold">No holidays found.</p>
                    </Card>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {holidays.map((item) => (
                            <div
                                key={item._id}
                                className="bg-surface-card border border-border rounded-2xl p-6 hover:shadow-lg transition-all group relative border-l-4 border-l-primary"
                            >
                                <div className="flex justify-between items-start mb-4">
                                    <div className="text-secondary font-['Montserrat'] font-extrabold text-sm uppercase tracking-tighter">
                                        {new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                    </div>
                                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button
                                            onClick={() => handleEdit(item)}
                                            className="p-1.5 hover:bg-surface-page rounded-lg text-text-secondary hover:text-primary transition-colors"
                                        >
                                            <Edit2 size={16} />
                                        </button>
                                        <button
                                            onClick={() => deleteMutation.mutate(item._id)}
                                            className="p-1.5 hover:bg-surface-page rounded-lg text-text-secondary hover:text-error transition-colors"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </div>

                                <h3 className="font-['Montserrat'] font-bold text-text-heading text-lg mb-2 leading-tight">
                                    {item.title}
                                </h3>
                                <p className="text-text-secondary text-sm leading-relaxed line-clamp-3">
                                    {item.description || "No description provided."}
                                </p>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* --- SLIDE PANEL FORM --- */}
            <SlidePanel
                open={showForm}
                onClose={closeForm}
                title={editId ? "Edit Holiday" : "Add New Holiday"}
                subtitle={editId ? "Update existing record" : "Mark a new day on the academic calendar"}
                width="max-w-md"
            >
                <div className="space-y-6 pt-2 font-['Merriweather']">
                    <Input
                        label="Date"
                        name="date"
                        type="date"
                        value={form.date}
                        onChange={handleChange}
                    />
                    <Input
                        label="Holiday Title"
                        name="title"
                        value={form.title}
                        onChange={handleChange}
                        placeholder="e.g. Annual Day"
                        className="font-['Montserrat'] font-semibold"
                    />
                    <Textarea
                        label="Description"
                        name="description"
                        value={form.description}
                        onChange={handleChange}
                        placeholder="Enter holiday details..."
                        rows={6}
                    />

                    <div className="pt-4 flex flex-col gap-3">
                        <Button
                            className="w-full bg-button-primary hover:bg-button-primary-hover text-white py-4 font-['Montserrat'] font-bold tracking-widest text-xs"
                            onClick={handleSubmit}
                            disabled={isProcessing}
                        >
                            {isProcessing ? (
                                <Loader2 className="animate-spin mx-auto" size={18} />
                            ) : (
                                editId ? "UPDATE HOLIDAY" : "SAVE HOLIDAY"
                            )}
                        </Button>
                        <button
                            onClick={closeForm}
                            className="w-full py-3 text-text-secondary font-['Montserrat'] text-[10px] font-bold uppercase tracking-widest hover:text-text-heading transition-colors"
                        >
                            Dismiss
                        </button>
                    </div>
                </div>
            </SlidePanel>
        </div>
    );
};

export default HolidaysPage;