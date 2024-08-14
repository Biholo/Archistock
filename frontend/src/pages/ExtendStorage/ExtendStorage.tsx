import { Fragment, useEffect, useState } from "react";
import ArchistockApiService from "../../services/ArchistockApiService";
import SubscriptionCard from "../../components/Card/Subscription/SubscriptionCard";
import PurchaseModal from "../../components/Modals/PurchaseModal";
import { getCookie, useAuth } from "../../contexts/AuthContext";

const ExtendStorage = () => {

    const archistockApiService = new ArchistockApiService();
    const [storage, setStorage] = useState<number>(0);
    const [subscriptions, setSubscriptions] = useState([]);
    const [showModal, setShowModal] = useState<boolean>(false);
    const [selectedSubscription, setSelectedSubscription] = useState<any>();

    useEffect(() => {
        archistockApiService.getUserStorage().then((res) => {
            setStorage(res.length);
        });
    }, []);

    useEffect(() => {
        archistockApiService.getSubscriptions().then((res) => {
            setSubscriptions(res);
        });
    }, [])

    const onSelectSubscription = (subscription: any) => {
        setSelectedSubscription(subscription);
        setShowModal(true);
    }

    const handlePurchase = () => {
        archistockApiService.purchaseSubscription(selectedSubscription.id).then((res) => {
            console.log(res);
            setStorage(storage + 1);
        });
    }

    return (
        <Fragment>
            <div className='m-5'>
                <h1 className='text-xl font-bold mb-3'>Extending Storage</h1>
                <p className="font-semibold">Currently, you are subscribed to : <span className="font-bold">{storage} storage(s)</span></p>
                <div className="flex flex-wrap flex-row justify-center mt-5">
                    {subscriptions.length > 0 && subscriptions.map((subscription: any) => (
                        <SubscriptionCard key={subscription.id} subscription={subscription} onSelect={onSelectSubscription} />
                    ))}
                </div>
            </div>
            {selectedSubscription && showModal && (
                <PurchaseModal show={showModal} subscription={selectedSubscription} onPurchase={handlePurchase} onClose={() => setShowModal(false)} />
            )}
        </Fragment>
    );
}

export default ExtendStorage;