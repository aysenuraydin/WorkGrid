import { RelationshipList } from './components/RelationshipsList';
import { RelationshipTables } from './components/RelationshipTables';

export const Relationships = ({  }) => {    
    return (
        <div className="row p-1 pt-3" style={{minHeight: "70vh" }}>
            <div className="col-3">
                <RelationshipList  />
            </div>
            <div className="col-9" style={{overflow: "auto", height: "70vh"}}>
                <RelationshipTables />
            </div>
        </div>
    )
}  
