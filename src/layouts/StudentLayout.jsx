import BaseLayout from "./BaseLayout";
import { MENU_CONFIG } from "../utils/menuConfig";
import { ROLES } from "../utils/roles";

const StudentLayout = () => {
    return (
        <BaseLayout
            title="Student Panel"
            menu={MENU_CONFIG[ROLES.STUDENT]}
        />
    );
};

export default StudentLayout;