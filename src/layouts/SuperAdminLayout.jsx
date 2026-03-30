import BaseLayout from "./BaseLayout";
import { MENU_CONFIG } from "../utils/menuConfig";
import { ROLES } from "../utils/roles";

const SuperAdminLayout = () => {
    return (
        <BaseLayout
            title="Super Admin"
            menu={MENU_CONFIG[ROLES.SUPER_ADMIN]}
        />
    );
};

export default SuperAdminLayout;