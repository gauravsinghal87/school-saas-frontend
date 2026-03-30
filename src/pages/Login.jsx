import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLoginMutation } from "../hooks/useQueryMutations";

const Login = () => {
    const navigate = useNavigate();

    const {
        mutate,
        isPending,
        isError,
        error,
    } = useLoginMutation();

    const [form, setForm] = useState({
        email: "",
        password: "",
    });

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        mutate(form, {
            onSuccess: (res) => {
                const role = res?.user?.role;
                console.log("Logged in as:", role);
                console.log('`/${role}/dashboard`', `/${role}/dashboard`)

                console.log("Logged in as:", role);
                if (role === "school_admin") navigate("/school-admin/dashboard");
                else if (role === "super_admin") navigate("/super-admin/dashboard");
                else if (role === "student") navigate("/student/dashboard");
                else if (role === "parent") navigate("/parent/dashboard");
                else if (role === "staff") navigate("/staff/dashboard");
            },
        });
    };

    return (
        <div className="h-screen flex items-center justify-center bg-gray-100">
            <form
                onSubmit={handleSubmit}
                className="bg-white p-6 rounded-lg shadow w-80"
            >
                <h2 className="text-xl font-bold mb-4 text-center">Login</h2>

                {isError && (
                    <div className="mb-3 text-red-500 text-sm">
                        {error?.message || "Login failed"}
                    </div>
                )}

                <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={form.email}
                    onChange={handleChange}
                    className="w-full mb-3 p-2 border rounded"
                />

                <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    value={form.password}
                    onChange={handleChange}
                    className="w-full mb-4 p-2 border rounded"
                />

                <button
                    type="submit"
                    disabled={isPending}
                    className={`w-full py-2 rounded text-white ${isPending ? "bg-gray-400" : "bg-blue-500"
                        }`}
                >
                    {isPending ? "Logging in..." : "Login"}
                </button>
            </form>
        </div>
    );
};

export default Login;