import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Input from '../../components/Input/Input';
import Button from '../../components/Button/Button';
import Card from '../../components/Card/Card';
import UserInvoices from '../../components/User/UserInvoices';
import ArchistockApiService from '../../services/ArchistockApiService';
import { toast } from 'react-toastify';
import UserStatistics from '../../components/UserStatistics/UserStatistics';
import RemoveProfileModal from "../../components/Modals/RemoveProfileModal/RemoveProfileModal";

const archistockApiService = new ArchistockApiService();

export default function Profil() {
  const { user, setUser } = useAuth(); // Access setUser from AuthContext
  const [profileUser, setProfileUser] = useState<any>({});
  const [currentTab, setCurrentTab] = useState('informations');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {   
    setProfileUser(user);
  }, [user]);

  const handleCLickOnNewPassword = () => {
    navigate('/profile/change-password');
  };

  const handleUpdateInput = (e: any) => {
    const { name, value } = e.target;
    if(name == "street" || name == "city" || name == "postalCode") {
      setProfileUser({
        ...profileUser,
        address: {
          ...profileUser.address,
          [name]: value
        }
      });
    } else {
        setProfileUser({
            ...profileUser,
            [name]: value
        });
    }
  };
  
  const handleUpdateProfile = () => {
    archistockApiService.updateProfile(profileUser).then((response) => {
      setProfileUser(response.data);
      setUser(response.data); // Update the AuthContext with the new user data
      toast.success('Profile updated successfully');
    }).catch((error) => {
      toast.error('An error occurred while updating your profile');
    });
  };

  const handleConfirmDelete = async () => {
    await archistockApiService.deleteUser(user.id);
    navigate("/");
    setIsModalVisible(false);
  };

  const handleDeleteAccount = () => {
    setIsModalVisible(true);
  }

  const handleCancelDelete = () => {
    setIsModalVisible(false);
  };

  return (
    <div className='m-5'>
      <h1 className='text-3xl font-black mb-3'>Your Profile</h1>
      <div role="tablist" className="tabs tabs-bordered ">
        <a
          role="tab"
          className={`tab text-black ${currentTab === 'informations' && 'tab-active'}`}
          onClick={() => { setCurrentTab('informations'); }}
        >
          Informations
        </a>
        <a
          role="tab"
          className={`tab text-black ${currentTab === 'factures' && 'tab-active'}`}
          onClick={() => { setCurrentTab('factures'); }}
        >
          Factures
        </a>
        <a
          role="tab"
          className={`tab text-black ${currentTab === 'statistiques' && 'tab-active'}`}
          onClick={() => { setCurrentTab('statistiques'); }}
        >
          Statistiques
        </a>
      </div>
      <Card css="mt-10">
        {currentTab === 'informations' ? (
          <div className='flex flex-col'>
            <div className='flex md:flex-row flex-col w-full justify-between gap-[40px]'>
              <div className='flex flex-col gap-2 md:w-1/2 w-full'>
                <h2 className='text-xl font-semibold'>Informations personnelles</h2>
                <div className='flex flex-col gap-5 w-full'>
                  <Input label='Nom' name="lastName" value={profileUser.lastName} onChange={handleUpdateInput} />
                  <Input label='Prénom' name="firstName" value={profileUser.firstName} onChange={handleUpdateInput} />
                  <Input label='Email' name="email" value={profileUser.email} onChange={handleUpdateInput} />
                  <Input label="Téléphone" name="phoneNumber" value={profileUser.phoneNumber} onChange={handleUpdateInput} />
                  <a className='text-primary cursor-pointer' onClick={handleCLickOnNewPassword}>Changer le mot de passe</a>
                </div>
              </div>
              {profileUser && profileUser.address && (
                <div className='flex flex-col gap-2 md:w-1/2 w-full'>
                  <h2 className='text-xl font-semibold'>Adresse</h2>
                  <div className='flex flex-col gap-5 w-full'>
                    <Input label='Rue' name="street" value={profileUser.address.street} onChange={handleUpdateInput} />
                    <Input label='Ville' name="city" value={profileUser.address.city} onChange={handleUpdateInput} />
                    <Input label='Code Postal' name="postalCode" value={profileUser.address.postalCode} onChange={handleUpdateInput} />
                  </div>
                </div>
              )}
            </div>
            <Button
              color='primary'
              css='mt-3'
              onClick={handleUpdateProfile}
              disabled={user === profileUser}
            >
              Mettre à jour
            </Button>
            <Button color='danger' css='mt-3' onClick={handleDeleteAccount}>
              Supprimer le compte
            </Button>
          </div>
        ) : currentTab === 'factures' ? (
          <UserInvoices />
        ) : currentTab === 'statistiques' ? (
          <UserStatistics />
        ) : null}
      </Card>
      <RemoveProfileModal
        isVisible={isModalVisible}
        onClose={handleCancelDelete}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}
