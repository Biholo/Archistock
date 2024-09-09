import React, { useEffect, useState, useCallback, Fragment } from "react"; 
import { useAuth } from '../../contexts/AuthContext';
import ArchistockApiService from '../../services/ArchistockApiService';
import Button from "../Button/Button";
import { Download, Eye } from "@phosphor-icons/react";
import InvoiceModal from '../Modals/InvoiceModal'; // Importez le nouveau composant modal

// Services
const archistockApiService = new ArchistockApiService();

const UserInvoices = () => {

    const { user } = useAuth();
    const [invoices, setInvoices] = useState([]);
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedInvoice, setSelectedInvoice] = useState(null);

    useEffect(() => {
        archistockApiService.getUserInvoices().then((invoices) => {
            setInvoices(invoices);
            console.log('invoices', invoices);
        });
    }, []);

    const handleDownload = useCallback((invoiceName: string) => {
        const downloadUrl = `${archistockApiService.url}/files/invoices/${invoiceName}`;
        window.open(downloadUrl, '_blank');
    }, []);

    const handleModalOpen = useCallback((invoice:any) => {
        setSelectedInvoice(invoice);
        setModalOpen(true);
    }, []);

    const handleModalClose = useCallback(() => {
        setModalOpen(false);
        setSelectedInvoice(null);
    }, []);

    return (
      <Fragment>
        <table className="table w-full overflow-x-auto">
            <thead>
                <tr className='text-black bg-blue-100 rounded'>
                    <th className="px-4 py-2 text-lg ">N°</th>
                    <th className="px-4 py-2 text-lg ">Nom</th>
                    <th className="px-4 py-2 text-lg ">Date de facturation</th>
                    <th className="px-4 py-2 text-lg ">Montant TTC</th>
                    <th className="px-4 py-2 text-lg ">Objet</th>
                    <th className="px-4 py-2 text-lg ">Actions</th>
                </tr>
            </thead>
            <tbody>
                {invoices && invoices.map((invoice: any, index: number) => (
                    <tr key={index} className={index % 2 === 0 ? '' : 'bg-blue-100'}>
                        <td className="px-4 py-2 text-lg ">{index + 1}</td>
                        <td className="px-4 py-2 text-lg ">{invoice.name}</td>
                        <td className="px-4 py-2 text-lg ">{invoice.invoiceDate.split('T')[0]}</td>
                        <td className="px-4 py-2 text-lg ">{invoice.usersubscription.subscription.price.toFixed(2)}€</td>
                        <td className="px-4 py-2 text-lg ">{invoice.usersubscription.name}</td>
                        <td className="px-4 py-2 text-lg ">
                            <ul className="flex flex-row gap-5">
                                <li>
                                    <Button color="primary" onClick={() => handleDownload(invoice.name)}>
                                        <Download size={16} />
                                    </Button>
                                </li>
                                <li>
                                    <Button color="info" onClick={() => handleModalOpen(invoice)}>
                                        <Eye size={16} />
                                    </Button>
                                </li>
                            </ul>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>

        {/* Modal pour afficher plus de détails sur la facture */}
        {selectedInvoice && (
            <InvoiceModal show={modalOpen} invoice={selectedInvoice} onClose={handleModalClose} />
        )}

      </Fragment>
    
    )
}

export default UserInvoices;
