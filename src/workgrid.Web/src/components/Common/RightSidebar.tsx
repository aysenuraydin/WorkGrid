import withRouter from './withRouter';

const RightSidebar = (props : any) => {

    window.onscroll = function () {
        scrollFunction();
    };

    const scrollFunction = () => {
        const element = document.getElementById("back-to-top");
        if (element) {
            if (document.body.scrollTop > 100 || document.documentElement.scrollTop > 100) {
                element.style.display = "block";
            } else {
                element.style.display = "none";
            }
        }
    };

    const toTop = () => {
        document.body.scrollTop = 0;
        document.documentElement.scrollTop = 0;
    };

    return (
        <button
            onClick={() => toTop()}
            className="btn btn-primary btn-icon" id="back-to-top">
            <i className="ri-arrow-up-line"></i>
        </button>
    );
};

export default withRouter(RightSidebar);
