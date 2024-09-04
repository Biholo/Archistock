import React, { useEffect, useState, useCallback } from "react"; 
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
        const downloadUrl = `http://localhost:8000/files/invoices/${invoiceName}`;
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
        <>
            <table className="table">
                <thead>
                <tr className='text-black'>
                    <th>N°</th>
                    <th>Nom</th>
                    <th>Date de facturation</th>
                    <th>Montant TTC</th>
                    <th>Objet</th>
                    <th>Actions</th>
                </tr>
                </thead>
                <tbody>
                    {invoices && invoices.map((invoice: any, index: number) => (
                        <tr key={index}>
                            <td>{index + 1}</td>
                            <td>{invoice.name}</td>
                            <td>{invoice.invoiceDate.split('T')[0]}</td>
                            <td>{invoice.usersubscription.subscription.price.toFixed(2)}€</td>
                            <td>{invoice.usersubscription.name}</td>
                            <td>
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
        </>
    )
}

export default UserInvoices;
