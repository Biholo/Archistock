import ProgressBar from '../ProgressBar/ProgressBar';
import Button from '../Button/Button';
import Card from '../Card/Card';

export default function SubscriptionCard( { upgradePlan, cancellation  } ) {
  return (
    <div className='w-[350px] bg-white p-3 rounded flex flex-col items-center shadow'>
        <h4 className='text-center text-xl font-medium'>Abonnements intermédiaires</h4>
        <h3>Equipe Tech</h3>
        <img className='w-1/2' src="/images/storage-1.png" alt="" />
        <ProgressBar css="my-2" value={50} maxValue={100} label={'60 GB / 100 GB'}/>
        <div className="flex items-center justify-center w-full">
            <Button css="text-normal bg-red-500 border-none hover:bg-red-600 mr-2 w-1/4" onClick={cancellation}>Résillier</Button>
            <Button css="text-normal w-3/4" onClick={upgradePlan}>Mettre à jour l'espace</Button>
        </div>
        <p className='text-xs mt-1'>*Vous serez prélevez de 5,99 € le 10 septembres</p>
    </div>
  )
}
