import { DataType } from 'common/enums/DataType';
import { ShowOrHideButton } from './ShowOrHideButton';
import { MoveAction } from './MoveAction';
import { useMenu } from 'context/MenuContext';
import { useRestoreDeletedMenuItem } from 'hooks/useMenuItems';
import { toast } from 'react-toastify';
import { ChangePrivacyButton } from './ChangePrivacyButton';

export const EditPanel = ({ item}: { item: any }) => { //! 
    const { mutate: restoreDeletedMenuItem } = useRestoreDeletedMenuItem(); 
    const {
        isMove,
        setIsMove, 
        actions,
        isAllDatas 
    } = useMenu();

    const isMoveActive = isMove[item.id]?.active;

    const toggleMove = () => {
        setIsMove((prev: any) => ({
            ...prev,
            [item.id]: {
                active: !prev[item.id]?.active,
                initialOrder: prev[item.id]?.initialOrder ?? item.order,
            },
        }));
    };

    const backToDelete = async(id:number) => {
        await restoreDeletedMenuItem({id}, {
            onSuccess: () => {
                toast.success("Menu itemi oluşturulamadı!");
            },
            onError: () => toast.error("Menu itemi başarıyla oluşturuldu!")
        }); 
    } 

    return (
        <div className="ps-2 d-flex gap-1 w-100 text-primary borderNone">

            {isAllDatas ? (
                <>
                    <ShowOrHideButton item={item} />
                    <ChangePrivacyButton item={item} />
                    <i
                        className="hoverIcon d-none ri-pencil-fill fs-14"
                        onClick={() => {
                            actions.setModalType(DataType.Edit);

                            if(item.isHeader){
                                actions.toggleDividerModal();
                                actions.setDivider(item);
                            }
                            else {
                                actions.toggleItemModal();
                                actions.setMenuItem(item);
                            }

                        }}
                    />
                    <i
                        className="hoverIcon d-none ri-delete-bin-5-fill fs-14"
                        onClick={() => {
                            actions.setDeleteModal(true);
                            actions.setDeleteItem(item);
                        }}
                    />
                    {!isMoveActive && (
                        <i className="hoverIcon d-none ri-drag-move-2-fill fs-14" onClick={toggleMove} />
                    )}
                    {isMoveActive && (
                        <MoveAction item={item} />
                    )}
                </>
            ) : (
                <>
                    <i
                        className="hoverIcon d-none ri-arrow-go-back-fill fs-14"
                        onClick={() => backToDelete(item.id)}
                    />
                    <i
                        className="hoverIcon d-none ri-delete-bin-5-fill fs-14"
                        onClick={() => {
                            actions.setDeleteModal(true);
                            actions.setDeleteItem(item);
                        }}
                    />
                </>
            )}
        </div>
    );
};