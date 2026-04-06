import Input from "../../../components/common/Input";
import Select from "../../../components/common/Select";
import { Controller } from "react-hook-form";
import { classesListMutation } from "../../../hooks/useQueryMutations";

export default function SectionForm({
    register,
    errors,
    mode = "create",
    control,
    selectedSectionCircle,
    classOptions
}) {
    console.log("classoptions in form", classOptions);
    const isView = mode === "view";
    const { data: classData } = classesListMutation({ page: 1, limit: 100 });
    console.log("classdata", classData);
    // const classOptions = classData?.results?.map((cls) => ({
    //     label: cls.name,
    //     value: cls._id,
    // })) || [];

    console.log("classoptions", classOptions);

    return (
        <div className="space-y-5">
            {/* Class Select */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Class <span className="text-red-500">*</span>
                </label>
<Controller
    name="classId"
    control={control}
    rules={{ required: "Class is required" }}
    render={({ field }) => {
        return (
            <Select
                value={field.value || ""}   // ✅ IMPORTANT FIX
                onChange={(val) => field.onChange(val?.value || val)}
                options={classOptions}
                placeholder="Choose a class"
                error={errors.classId?.message}
            />
        );
    }}
/>
            </div>

            {/* Section Name */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Section Name <span className="text-red-500">*</span>
                </label>
                <Input
                    type="text"
                    placeholder="e.g., Section A"
                    register={register("name", { required: "Section name is required" })}
                    error={errors.name?.message}
                    disabled={isView}
                />
                {selectedSectionCircle && (
                    <p className="text-xs text-blue-600 mt-1">
                        Selected from circle: Section {selectedSectionCircle}
                    </p>
                )}
            </div>
        </div>
    );
}