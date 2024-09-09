import React, { useEffect, useState } from 'react';
import {
    Cloud,
    Gear
} from "@phosphor-icons/react";

import { useParams } from 'react-router-dom';
import Button from '../../../../components/Button/Button';
import ArchistockApiService from '../../../../services/ArchistockApiService';
import { useAuth } from '../../../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function CompanyDetail() {
    const { user } = useAuth();
    const { id } = useParams();

    const archistockApiService = new ArchistockApiService();
    const navigate = useNavigate();

    const [company, setCompany] = useState<any>();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user && user.id && id) {
            setLoading(true); // Démarre le chargement
            archistockApiService.findOneCompanyById(id, user.id).then(
                (response: any) => {
                    setCompany(response);
                    setLoading(false); // Termine le chargement
                }
            ).catch((error) => {
                console.error("Erreur lors de la récupération de l'entreprise :", error);
                setLoading(false); // Même en cas d'erreur, on arrête le chargement
            });
        }
    }, [id, user]);

    if (loading) {
        return (
            <div style={styles.loaderContainer}>
                <div style={styles.loader}></div>
                <p>Chargement...</p>
            </div>
        );
    }

    return (
        <div>
            <div className='flex w-full justify-between'>
                <h2>{company?.name}</h2>
                <div>
                    <Button css="mr-3">
                        <Cloud size={40} /> Ajouter un espace de stockage
                    </Button>
                    <Button onClick={() => navigate(`/company/${company?.id}/parameter`)}>
                        <Gear size={40} />
                    </Button>
                </div>
            </div>
            <div>

            </div>
        </div>
    );
}

const styles = {
    loaderContainer: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
    },
    loader: {
        border: '16px solid #f3f3f3', /* Light grey */
        borderTop: '16px solid #3498db', /* Blue */
        borderRadius: '50%',
        width: '120px',
        height: '120px',
        animation: 'spin 2s linear infinite',
    },
};

// Ajoutez les styles pour l'animation de rotation
const styleSheet = document.styleSheets[0];
styleSheet.insertRule(`
@keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
}`, styleSheet.cssRules.length);
