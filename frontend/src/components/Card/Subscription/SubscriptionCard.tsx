import { Fragment } from "react";
import Card from "../Card";
import Badge from "../../Badge/Badge";
import Button from "../../Button/Button";

const SubscriptionCard = ({ subscription, onSelect } : any) => {

    const formatPrice = (price:string) => {
        const formattedPrice = parseFloat(price).toFixed(2);
        const [euros, cents] = formattedPrice.split('.');
        return { euros, cents };
    }

    const { euros, cents } = formatPrice(subscription.price);

    // Convert the features string into an array
    const featureList = subscription.features.split('\n').filter((feature: any) => feature);

    return (
        <Fragment>
            <Card title={""} css="w-auto">
                {subscription.name === "Basic" && (
                    <Badge color="success" css="absolute text-white fw-black -translate-x-10 -translate-y-10 text-md font-bold p-3">Best Offer !</Badge>
                )}
                
                <div className="flex flex-col">
                    <h2 className="text-3xl font-bold">
                        <span className="text-4xl">{euros}</span><span className="text-2xl">,{cents} € </span>
                        - <span className="text-secondary">{subscription.name}</span> Subscription
                    </h2>
                    <div className="flex flex-col mt-5">
                        <ul className="text-lg list-disc list-inside">
                            {featureList.map((feature: any, index: number) => (
                                <li key={index}>{feature}</li>
                            ))}
                            <li className="text-sm">And more...</li>
                        </ul>
                    </div>
                    <Button color="success" css="mt-10" onClick={() => { onSelect(subscription) }}>Subscribe here</Button>
                </div>
            </Card>
        </Fragment>
    );
}

export default SubscriptionCard;
