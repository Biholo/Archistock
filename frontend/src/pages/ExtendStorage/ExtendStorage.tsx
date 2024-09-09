import { Fragment, useEffect, useState } from "react";
import ArchistockApiService from "../../services/ArchistockApiService";
import SubscriptionCard from "../../components/Card/Subscription/SubscriptionCard";
import PurchaseModal from "../../components/Modals/PurchaseModal";
import { getCookie, useAuth } from "../../contexts/AuthContext";
import { toast } from "react-toastify";

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
            if(res.status == 201) {
                toast.success("Achat effectué avec succès.");
                setShowModal(false);
                setStorage(storage + 1);
            }
            else {
                toast.error("Une erreur s'est produite lors de l'achat. Veuillez réessayer.");
                setShowModal(false);
            }
        });
    }

    return (
        <Fragment>
            <div className='m-5'>
                <h1 className="text-2xl font-bold mb-3">Nos offres</h1>
                <p>
                    Retrouvez ci-dessous les différentes offres d'abonnement que nous proposons. Vous pouvez souscrire à un abonnement pour augmenter votre espace de stockage.
                </p>
                <p className="font-semibold">Actuellement, vous possèdez <span className="font-bold">{storage} {storage > 1 ? "Abonnements" : "Abonnement"}</span></p>
                <div className="flex flex-wrap flex-row justify-center gap-5 mt-8">
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