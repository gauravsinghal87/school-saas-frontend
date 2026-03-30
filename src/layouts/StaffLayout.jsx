import BaseLayout from "./BaseLayout";
import { MENU_CONFIG } from "../utils/menuConfig";
import { ROLES } from "../utils/roles";

const StaffLayout = () => {
    return (
        <BaseLayout
            title="Staff Panel"
            menu={MENU_CONFIG[ROLES.STAFF]}
        />
    );
};

export default StaffLayout;