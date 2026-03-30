import BaseLayout from "./BaseLayout";
import { MENU_CONFIG } from "../utils/menuConfig";
import { ROLES } from "../utils/roles";

const AdminLayout = () => {
    return (
        <BaseLayout
            title="Admin Panel"
            menu={MENU_CONFIG[ROLES.SCHOOL_ADMIN]}
        />
    );
};

export default AdminLayout;