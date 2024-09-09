import React, { useEffect, useState, Fragment } from "react";
import Button from "../Button/Button";
import Input from "../Input/Input";

const PurchaseModal = ({ show, subscription, onPurchase, onClose }: any) => {
  const [formData, setFormData] = useState({
    fullName: "",
    expirationDate: "",
    cardNumber: "",
    cvv: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // if card number change, format it
    if (e.target.name === "cardNumber") {
      const value = e.target.value.replace(/\D/g, "").substring(0, 16);
      const cardNumber = value.match(/.{1,4}/g)?.join(" ") || "";
      setFormData({
        ...formData,
        [e.target.name]: cardNumber,
      });
    } else if (e.target.name === "expirationDate") {
      const value = e.target.value.replace(/\D/g, "").substring(0, 4);
      const expirationDate = value.match(/.{1,2}/g)?.join("/") || "";
      setFormData({
        ...formData,
        [e.target.name]: expirationDate,
      });
    } else {
      setFormData({
        ...formData,
        [e.target.name]: e.target.value,
      });
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    // set loading true, fake wait time, set loading false
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onPurchase();
      onClose();
    }, 2000);
  };

  return (
    <Fragment>
      <div
        className={`fixed z-10 inset-0 overflow-y-auto ${
          show ? "block" : "hidden"
        }`}
      >
        <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
          <div className="fixed inset-0 transition-opacity" aria-hidden="true">
            <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
          </div>
          <span
            className="hidden sm:inline-block sm:align-middle sm:h-screen"
            aria-hidden="true"
          >
            &#8203;
          </span>
          <div
            className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full"
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-headline"
          >
            <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
              <div className="sm:flex sm:items-start">
                <form
                  className="mt-3 text-center sm:mt-0 sm:text-left w-full"
                  onSubmit={handleSubmit}
                >
                  <h3
                    className="text-lg leading-6 font-medium text-gray-900"
                    id="modal-headline"
                  >
                    Abonnement {subscription.name}
                  </h3>
                  <hr className="m-3" />
                  <div className="flex flex-col mt-3">
                    <p>Information de la carte de paiement</p>
                    <Input
                      type="text"
                      placeholder="John Doe"
                      css="mt-2 w-full"
                      label="Nom"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                      required={true}
                    />
                    <Input
                      type="text"
                      placeholder="1234 5678 9101 1121"
                      css="mt-2 w-full"
                      label="Numéro de carte"
                      name="cardNumber"
                      value={formData.cardNumber}
                      onChange={handleChange}
                      required={true}
                    />
                    <div className="flex flex-row flex-wrap gap-2 w-full">
                      <Input
                        type="text"
                        placeholder="MM/YY"
                        css="mt-2 w-full"
                        label="Date d'expiration"
                        name="expirationDate"
                        value={formData.expirationDate}
                        onChange={handleChange}
                        required={true}
                      />
                      <Input
                        type="text"
                        placeholder="123"
                        css="mt-2 w-full"
                        label="CVV"
                        name="cvv"
                        value={formData.cvv}
                        onChange={handleChange}
                        required={true}
                      />
                    </div>
                  </div>
                  <div className="divider">OU</div>
                  <div className="flex justify-between mt-3 gap-2">
                    <Button color="danger" css="w-full">
                      Pay with
                      <img
                        className="-ml-2.5 w-14 mb-0"
                        src="https://upload.wikimedia.org/wikipedia/commons/b/ba/Stripe_Logo%2C_revised_2016.svg"
                      />
                    </Button>
                  </div>

                  <div className="mt-2">
                    <p className="text-sm text-gray-500">
                      Vous allez acheter l'abonnement {subscription.name} pour{" "}
                      {subscription.price} €
                    </p>
                  </div>
                  <div className="px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                    <Button
                      color="success"
                      css="ml-3"
                      onClick={() => {
                        handleSubmit;
                      }}
                      disabled={
                        !(
                          formData.fullName &&
                          formData.cardNumber &&
                          formData.expirationDate &&
                          formData.cvv
                        )
                      }
                      loading={loading}
                    >
                      Acheter
                    </Button>
                    <Button
                      color="neutral"
                      css="ml-3"
                      onClick={() => onClose()}
                    >
                      Annuler
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default PurchaseModal;
