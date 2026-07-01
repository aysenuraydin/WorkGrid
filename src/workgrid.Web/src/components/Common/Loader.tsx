import React from 'react';
import { Spinner } from 'reactstrap';

import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Loader = (props: any) => {
    return (
        <React.Fragment>
            <div className="d-flex flex-column align-items-center justify-content-center mx-2 mt-2">
                <Spinner color="primary" size={props.size}> Loading... </Spinner>
                {props?.isText && <span className='text-primary mt-2'>Loading...</span>}
            </div>
            {toast.error(props.error, { position: "top-right", hideProgressBar: false, progress: undefined, toastId: "" })}
        </React.Fragment>
    );
};

export default Loader;
