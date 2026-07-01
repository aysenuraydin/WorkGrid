import { useDataTable } from 'context/DatatableContext';
import { Input } from 'reactstrap'

export const ChangePageSize = ({}) => {
    const {  pageSize, setPageSize } = useDataTable();
    return (
        <>
            <div style={{
                width:"80px", 
                position:"absolute",
                bottom:"0.2rem",
                left:"10rem"
                }} className='p-0'>
                <Input 
                    name="modalSize"
                    id="modalSize-field"
                    type="select"
                    className="w-100 form-sm p-1 ps-2"
                    validate={{
                        required: { value: true },
                    }} 
                    onChange={(e) => setPageSize(Number(e.target.value))}
                    value={pageSize}
                >
                    <option value="5">5</option>
                    <option value="6">6</option>
                    <option value="7">7</option>
                    <option value="8">8</option>
                    <option value="9">9</option>
                    <option value="10">10</option>
                </Input>
            </div>
        </>
    )
}
