import BaseLayout from "./BaseLayout";
import { MENU_CONFIG } from "../utils/menuConfig";
import { ROLES } from "../utils/roles";

const TeacherLayout = () => {
    return (
        <BaseLayout
            title="Teacher Panel"
            menu={MENU_CONFIG[ROLES.STAFF]}
        />
    );
};

export default TeacherLayout;