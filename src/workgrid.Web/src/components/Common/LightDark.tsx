import { useThemeMode } from "hooks/useThemeMode";

const LightDark = () => {
    const { isDark, toggle } = useThemeMode();
    return (
        <div className="ms-1 header-item d-none d-sm-flex">
            <button onClick={toggle} type="button"
                className={`btn btn-icon btn-ghost-secondary rounded-circle`}>
                <i className={`bx ${isDark ? "bx-sun" : "bx-moon"} fs-22`}></i>
            </button>
        </div>
    );
};

export default LightDark;