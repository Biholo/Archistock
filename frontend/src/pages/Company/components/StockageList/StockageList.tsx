import CustomPieChart from "../../../../components/Stats/CustomPieChart/CustomPieChart";
import {
  User,
  Gear,
  Gavel,
  UserGear,
  Users
} from "@phosphor-icons/react";

const dataTest = [
  { name: 'Espace libre', value: 30 },
  { name: 'Image PNG', value: 10 },
  { name: 'Image JPEG', value: 10 },
  { name: 'PDF', value: 10 },
  { name: 'Word', value: 10 },
  { name: 'Excel', value: 10 },
  { name: 'Powerpoint', value: 10 },
  { name: 'Autre', value: 10 },
];

const dataUser = [
  { name: 'Kilian', value: 10 },
  { name: 'Alexandre', value: 10 },
  { name: 'Alexis', value: 10 },
  { name: 'Maxime', value: 10 },
  { name: 'Jules', value: 10 },
  { name: 'Tom', value: 10 },
  { name: 'Julien', value: 10 },
  { name: 'Léo', value: 10 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#AF19FF', '#FF1963', '#19FFDC', '#DC19FF', '#FF5719', '#1963FF', '#FF7C19'];


export default function StockageList({ sharedStorageSpaces }) {
  return (
    <div className='mt-5 w-full h-full'>
      <div className='flex w-full justify-between bg-white p-3 rounded shadow relative'>
        <div className="w-2/3 flex">
          <div className='flex flex-col mr-10'>
            <div className="flex items-center border-b-2 pb-1 w-2/5 border-black w-full">
              <h3 className='text-xl mr-4 '>Equipe Tech</h3>
            </div>
            <div className="mt-2 flex flex-col w-[200px]">
              <div className="flex items-center mr-2">
                <p className='mb-1 text-normal'>Utilisateurs</p>
                <p className="ml-3 mr-1">8</p>
                <User size={25} />
              </div>
              <ul className="flex flex-col justify-start items-start flex-wrap max-h-28">
                <li className="text-sm m-0 flex items-center">Kilian <Gavel className="ml-2" size={18} /></li>
                <li className="text-sm m-0 flex items-center">Oliwer <UserGear className="ml-2" size={18} /></li>
                <li className="text-sm m-0 flex items-center">Damien <Users className="ml-2" size={18} /></li>
                <li className="text-sm m-0 ">Steven</li>
                <li className="text-sm m-0 ">Steven</li>
                <li className="text-sm m-0 ">Steven</li>
                <li className="text-sm m-0 ">Steven</li>
                <li className="text-sm m-0 ">Steven</li>
              </ul>
            </div>

          </div>
          <div className="flex flex-col">
            <h3 className='text-xl mr-4 border-b-2 pb-1 border-black'>Dernière modification</h3>
            <div className="mt-2">
              <p className='text-sm'>Ajd : [18:50]  <span className="text-sm text-sky-600">Kilian</span> - <span className="font-light">Ajout photo séminaire</span></p>
              <p className='text-sm'>15 août : [14:30]  <span className="text-sm text-sky-600">Damien</span> - <span className="font-light">Mise à jour du document de présentation</span></p>
              <p className='text-sm'>14 août : [09:00]  <span className="text-sm text-sky-600">Kilian</span> - <span className="font-light">Révision des objectifs du projet</span></p>
              <p className='text-sm'>13 août : [16:45]  <span className="text-sm text-sky-600">Oliwer</span> - <span className="font-light">Correction des erreurs dans le rapport</span></p>
              <p className='text-sm'>12 août : [11:20]  <span className="text-sm text-sky-600">Damien</span> - <span className="font-light">Ajout des commentaires dans le plan stratégique</span></p>
              <p className='text-sm'>11 août : [08:00]  <span className="text-sm text-sky-600">Steven</span> - <span className="font-light">Mise à jour des données financières</span></p>
            </div>
          </div>

        </div>
        <div className="flex w-1/3">
          <CustomPieChart colors={COLORS} width={375} height={190} data={dataUser} />
          <CustomPieChart colors={COLORS} width={375} height={190} data={dataTest} />
        </div>

        <Gear size={35} className="cursor-pointer absolute right-2 top-2" />


      </div>
    </div>
  )
}
