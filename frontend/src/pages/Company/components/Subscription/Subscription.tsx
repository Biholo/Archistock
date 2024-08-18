import React, { useState } from 'react'
import SubscriptionCard from '../../../../components/SubscriptionCard/SubscriptionCard'
import Button from '../../../../components/Button/Button';
import { File, FilePng, FileJpg, FileTxt, FilePdf, FileZip, FileDoc, FileXls, FileSvg, MicrosoftWordLogo } from '@phosphor-icons/react';
import Input from '../../../../components/Input/Input';
import ProgressBarMultiple from '../../../../components/ProgressBarMultiple/ProgressBarMultiple';

export default function Subscription() {

  const [isCancellationCard, setIsCancellationCard] = useState(false);
  const [isUpgradeCard, setIsUpgradeCard] = useState(false);

  const handleCancellation = () => {
    setIsCancellationCard(true);
  }

  const handleUpgrade = () => {
    setIsUpgradeCard(true);
  }



  return (
    <div className='mt-5'>
      <SubscriptionCard cancellation={handleCancellation} upgradePlan={handleUpgrade} />
      {
        isCancellationCard && (
          <div className='bg-card-invitation flex items-center justify-center'>
            <div className='card-invitation bg-white px-5 py-2 rounded w-2/5 relative'>
              <h3 className='text-2xl text-center'>Résiliation d'abonnement</h3>
              <p className='text-sm my-3 text-center'>Résiliation "abonnement intermédiaires" affecté à "Equipe Tech"</p>
              <div>
                <h5>Vous ne pourrez plus avoir accès à ces fichiers :</h5>
                <div className='flex justify-center items-center'>
                  <ul className='my-4 space-y-2 flex flex-col justify-center'>
                    <li className='flex items-center'>
                      <span className='w-[50px] flex justify-center items-center '>9</span> - <FilePng size={24} className='mr-2 text-blue-500' /> Fichier PNG
                    </li>
                    <li className='flex items-center'>
                      <span className='w-[50px] flex justify-center'>10</span> - <FileJpg size={24} className='mr-2 text-yellow-500' /> Fichier JPG
                    </li>
                    <li className='flex items-center'>
                      <span className='w-[50px] flex justify-center'>75</span> - <FilePdf size={24} className='mr-2 text-red-500' /> Document PDF
                    </li>
                    <li className='flex items-center'>
                      <span className='w-[50px] flex justify-center'>1</span> - <FileDoc size={24} className='mr-2 text-blue-700' /> Document Word
                    </li>
                    <li className='flex items-center'>
                      <span className='w-[50px] flex justify-center'>300</span> - <FileXls size={24} className='mr-2 text-green-500' /> Fichier Excel
                    </li>
                    <li className='flex items-center'>
                      <span className='w-[50px] flex justify-center'>8.662</span> - <FileTxt size={24} className='mr-2 text-gray-500' /> Fichier texte
                    </li>
                    <li className='flex items-center'>
                      <span className='w-[50px] flex justify-center'>1.001</span> - <FileZip size={24} className='mr-2 text-orange-500' /> Archive
                    </li>
                    <li className='flex items-center'>
                      <span className='w-[50px] flex justify-center'>112</span> - <FileSvg size={24} className='mr-2 text-purple-500' /> Fichier vectoriel
                    </li>
                    <li className='flex items-center'>
                      <span className='w-[50px] flex justify-center'>8.520</span> - <File size={24} className='mr-2 text-black' /> Autres types
                    </li>

                  </ul>
                </div>
              </div>
              <div>
                <p className='text-center text-xs'>Note: Vous ainsi que toutes les personnes de cette espace n'auront plus accès à ces fichiers a compté du 16 septembre 2024.</p>
                <div className='flex my-2'>
                  <Button css='w-1/4 text-normal bg-neutral-300 border-none hover:bg-neutral-400 hover:text-black mr-2' onClick={() => setIsCancellationCard(false)}>Annuler</Button>
                  <Button css='text-normal bg-red-500 border-none hover:bg-red-600 w-3/4' color='danger'>Confirmer la résiliation</Button>
                </div>
              </div>
            </div>
          </div>
        )
      }
      {
        isUpgradeCard && (
          <div className='bg-card-invitation flex items-center justify-center'>
            <div className='card-invitation bg-white px-5 py-2 rounded w-2/5 relative'>
              <div>
                <h3 className='text-2xl text-center'>Mise à jour de votre abonnement</h3>
                <p className='text-sm my-3 text-center'>Sélectionnez le volume que vous shouaitez ajouter</p>
                <div className='flex flex-col'>
                  <div className='flex items-center justify-around'>
                    <button>+ 20 GO</button>
                    <button>+ 40 GO</button>
                    <button>+ 60 GO</button>
                  </div>
                  <div className='flex justify-center items-center'>
                    <p className='text-normal mr-3'>Sélectionnez le volume à ajouter à votre espace de stockage :</p>
                    <div className='flex items-center'>
                      <Input css='w-full w-[100px]' type='number' placeholder='10' />
                      <p className='ml-3'>GO</p>
                    </div>
                  </div>
                  <ProgressBarMultiple values={[50, 30, 20]} maxValue={100} css='my-2' labels={['70 GO', '35 GO', '15 GO']} colors={['#34d399', '#cbd5e1', '#FFBB28']} />

                  <div>

                  </div>
                </div>
              </div>
              <div className='flex my-2'>
                <Button css='w-1/4 text-normal bg-neutral-300 border-none hover:bg-neutral-400 hover:text-black mr-2' onClick={() => setIsUpgradeCard(false)}>Annuler</Button>
                <Button css='text-normal w-3/4' >Continuer</Button>
              </div>
            </div>
          </div>
        )
      }
    </div>
  )
}
