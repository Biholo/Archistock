import Card from "../../components/Card/Card";
import { Fragment, useEffect, useState } from "react";
import ArchistockApiService from "../../services/ArchistockApiService";
import SubscriptionCard from "../../components/Card/Subscription/SubscriptionCard";
import PurchaseModal from "../../components/Modals/PurchaseModal";

const ExtendStorage = () => {

    const archistockApiService = new ArchistockApiService();
    const [storage, setStorage] = useState<number>(0);
    const [subscriptions, setSubscriptions] = useState<any[]>([]);
    const [showModal, setShowModal] = useState<boolean>(false);
    const [selectedSubscription, setSelectedSubscription] = useState<any>();

    useEffect(() => {
        archistockApiService.getUserStorage(localStorage.getItem('accessToken') as string).then((res) => {
            setStorage(res.length);
        });
    }, []);

    useEffect(() => {
        archistockApiService.getSubscriptions().then((res) => {
            setSubscriptions(res);
            console.log(res);
        });
    }, [])

    const onSelectSubscription = (subscription: any) => {
        setSelectedSubscription(subscription);
        setShowModal(true);
    }

    return (
        <Fragment>
            <div className='m-5'>
                <h1 className='text-xl font-bold mb-3'>Extend Storage:</h1>
                <p>Need more storage ? Extend it with our plans !</p>
                <p>Currently, you are subscribed to : <span className="fw-bold">{storage} storage(s)</span></p>
                <div className="flex flex-wrap flex-row justify-center">
                    {subscriptions.map((subscription) => {
                        return <SubscriptionCard key={subscription.id} subscription={subscription} onSelectSubscription={(e: any) => { onSelectSubscription(e) }} />
                    })}
                </div>
            </div>
            {selectedSubscription && showModal && (
                <PurchaseModal show={showModal} subscription={selectedSubscription} onPurchase={() => { console.log('Purchased !') }} />
            )}
        </Fragment>
    );
}

export default ExtendStorage;