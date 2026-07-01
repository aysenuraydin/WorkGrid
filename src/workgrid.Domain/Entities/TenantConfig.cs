using workgrid.Domain.Common;

namespace workgrid.Domain.Entities;

public class TenantConfig : BaseAuditableEntity<long>
{

    public string PrimaryColor { get; set; } = "#4f46e5";
    public string SecondaryColor { get; set; } = "#9a96e9";
    public string SuccessColor { get; set; } = "#10b981";
    public string DangerColor { get; set; } = "#ef4444";
    public string WarningColor { get; set; } = "#f59e0b";
    public string InfoColor { get; set; } = "#3b82f6";
    public string LightColor { get; set; } = "#f3f4f6";
    public string DarkColor { get; set; } = "#1f2937";


    public string TopbarBg { get; set; } = "#ffffff";
    public bool IsGradientTopbar { get; set; } = false;
    public string TopbarFirstColor { get; set; } = "#4f46e5";
    public string TopbarSecondColor { get; set; } = "#06b6d4";
    public string TopbarDeg { get; set; } = "135";
    public string TopbarTextColor { get; set; } = "#1a1a2e";


    public string SidebarBg { get; set; } = "#4f46e5";
    public bool IsGradientSideBar { get; set; } = false;
    public string SideBarFirstColor { get; set; } = "#4f46e5";
    public string SideBarSecondColor { get; set; } = "#06b6d4";
    public string SideBarDeg { get; set; } = "135";
    public string SidebarTextColor { get; set; } = "#ffffff";

    public string LogoSmHeight { get; set; } = "40px";
    public string LogoDarkHeight { get; set; } = "40px";
    public string LogoLightHeight { get; set; } = "40px";



    public string LogoSmUrl { get; set; } = "adeb1bd7063248cea590963d97ef7990.png";
    public string LogoLightUrl { get; set; } = "3b8cab61db094a8190f9ad9ed8849213.png";
    public string LogoDarkUrl { get; set; } = "d8eba46b36164d87a7daf930172966fc.png";
    public string FaviconUrl { get; set; } = "196b7c3114fe49b2b408dca00615e202.ico";

    public bool IsGradientBg { get; set; } = false;
    public string BgFirstColor { get; set; } = "#ffffff";
    public string Deg { get; set; } = "135";
    public string BgSecondColor { get; set; } = "#ffffff";
    public string bgSolidColor { get; set; } = "#ffffff";
    public bool IsBgImg { get; set; } = false;
    public bool isBgFlat { get; set; } = true;
    public string BgImgUrl { get; set; } = "/assets/images/bg-pattern.png";

    public string FontFamily { get; set; } = "'Inter', sans-serif";
    public string FontSize { get; set; } = "14px";
    public string BorderRadius { get; set; } = "4px";

    public bool ShowCalendar { get; set; } = true;
    public bool ShowCrm { get; set; } = true;
    public bool ShowECommerce { get; set; } = false;
    public bool ShowBLog { get; set; } = false;
    public bool ShowLanding { get; set; } = false;
    public bool ShowTask { get; set; } = true;
    public bool ShowChat { get; set; } = true;
    public bool ShowKanban { get; set; } = true;

    public string MainView { get; set; } = "dashboard";

    public string LayoutType { get; set; } = "vertical";
    public string LayoutModeType { get; set; } = "light";
    public string LeftSidebarType { get; set; } = "dark";
    public string LayoutWidthType { get; set; } = "lg";
    public string LayoutPositionType { get; set; } = "fixed";
    public string TopbarThemeType { get; set; } = "light";
    public string LeftSidebarSizeType { get; set; } = "lg";
    public string LeftSidebarViewType { get; set; } = "default";
    public string LeftSidebarImageType { get; set; } = "none";
    public string Preloader { get; set; } = "disable";
    public string BackgroundImageType { get; set; } = "none";
    public string SidebarVisibilityType { get; set; } = "show";
}

