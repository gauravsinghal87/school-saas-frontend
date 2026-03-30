import BaseLayout from "./BaseLayout";
import { MENU_CONFIG } from "../utils/menuConfig";
import { ROLES } from "../utils/roles";

const ParentLayout = () => {
    return (
        <BaseLayout
            title="Parent Panel"
            menu={MENU_CONFIG[ROLES.PARENT]}
        />
    );
};

export default ParentLayout;