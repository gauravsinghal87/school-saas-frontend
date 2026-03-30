import { ROLE_LAYOUT } from "../layouts";

const RoleBasedLayout = ({ children }) => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) return null;
    const Layout = ROLE_LAYOUT[user.role];

    if (!Layout) return <div>No layout found</div>;

    return <Layout>{children}</Layout>;
};

export default RoleBasedLayout;