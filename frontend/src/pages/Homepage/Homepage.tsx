import React, { useState } from 'react'
import Button from '../../components/Button/Button'

const cardsData = [
    {
        title: 'Sécurité de vos données',
        text: 'Vos fichiers sont protégés par des protocoles de cryptage avancés, assurant une sécurité maximale à chaque étape, de la transmission au stockage.',
        icon: '/images/icons/lock_icon.png'
    },
    {
        title: 'Simplicité d\'utilisation',
        text: 'Une interface intuitive vous permet de gérer et organiser vos documents en quelques clics, sans nécessiter de compétences techniques.',
        icon: '/images/icons/mouse_icon.png'
    },
    {
        title: 'Collaboration efficace',
        text: 'Les espaces de stockage partagés facilitent la collaboration en permettant à chaque membre de l\'équipe d\'accéder et de modifier les fichiers en temps réel.',
        icon: '/images/icons/handshake_icon.png'
    },
    {
        title: 'Chatbot intelligent pour l\'assistance',
        text: 'Un chatbot disponible 24/7 répond instantanément à vos questions, vous offrant une assistance continue et personnalisée.',
        icon: '/images/icons/message_icon.png'
    },
    {
        title: 'Suivi et statistiques détaillés',
        text: 'Des outils de suivi offrent une visibilité complète sur l\'utilisation de l\'espace de stockage, avec des statistiques pour optimiser la gestion de vos documents.',
        icon: '/images/icons/stats_icon.png'
    },
    {
        title: 'Intégration facile avec d\'autres outils',
        text: 'L\'API permet une intégration fluide avec vos logiciels existants, centralisant la gestion de vos fichiers pour plus d\'efficacité.',
        icon: '/images/icons/link_icon.png'
    }

]
const faqs = [
    {
        id: 'answer-1',
        question: 'What types of hosting plans do you offer?',
        answer: 'We offer shared hosting, VPS hosting, dedicated server hosting, and cloud hosting plans.',
    },
    {
        id: 'answer-2',
        question: 'What is the uptime guarantee for your hosting services?',
        answer: 'We guarantee an uptime of 99.9% for all our hosting services.',
    },
    {
        id: 'answer-3',
        question: 'Do you provide website migration assistance?',
        answer: 'Yes, we offer free website migration assistance for new customers.',
    },
    {
        id: 'answer-4',
        question: 'What security measures do you have in place?',
        answer: 'We employ advanced security measures including firewalls, DDoS protection, and regular security audits.',
    }
];
export default function Homepage() {

    const [activeId, setActiveId] = useState(null);

    const toggleAnswer = (id) => {
        setActiveId(activeId === id ? null : id);
    };
    return (
        <div className='flex flex-col'>
            <div className='h-screen'>
                <div className='bg-[#134461] h-full flex flex-col justify-between'>

                    <div>
                        <div className='h-[70px]'></div>
                        <div className='flex flex-col items-center'>
                            <h1 className='text-white text-4xl font-bold text-center mt-10'>Bienvenue sur Archistock <br /> Votre solution de gestion de fichiers sécurisée</h1>
                            <p className='text-white my-8'>Conçue spécialement particulier et les entreprises, notre solution vous permet de stocker, partager et gérer vos documents en toute sérénité.</p>
                            <Button css='ext-white'>Découvrir maintenant</Button>
                        </div>
                    </div>

                    <img src="/images/bg-homepage.png" alt="" />

                </div>
            </div>
            <div className='bg-[#2F89B0] h-[30px]'></div>
            <div className='h-screen flex flex-col items-center'>
                <h2 className='text-2xl md:text-3xl lg:text-4xl font-bold text-white text-3xl py-10 text-[#15344E]'>Qu'est ce que Archistock ?</h2>

            </div>
            <div className='h-screen flex flex-col items-center bg-[#15344E]'>
                <h2 className='text-2xl md:text-3xl lg:text-4xl font-bold text-white text-3xl py-10'>Pourquoi utiliser Archistock ?</h2>
                <div className="grid grid-cols-3 gap-x-20 gap-y-0 h-full px-10">
                    {cardsData.map((card, index) => (
                        <div key={index} className='flex flex-col items-center justify-center w-[450px]'>
                            <div className='w-[140px] h-[140px] flex items-center justify-center'>
                                <img src={card.icon} alt="" className='w-full h-full object-contain' />
                            </div>
                            <h3 className='text-white text-xl mt-2'>{card.title}</h3>
                            <p className='text-white text-sm text-center mt-1'>{card.text}</p>
                        </div>
                    ))}
                </div>

            </div>
            <div className='h-80 flex flex-col items-center'>
                <h2 className='text-2xl md:text-3xl lg:text-4xl font-bold py-10 text-[#15344E]'>En savoir plus ?</h2>
                <section className="max-w-5xl mx-auto py-10 sm:py-20">
                    <div className="w-full px-7 md:px-10 xl:px-2 py-4">
                        <div className="mx-auto w-full max-w-5xl border border-slate-400/20 rounded-lg bg-white">
                            {faqs.map(({ id, question, answer }) => (
                                <div key={id} className="border-b border-[#0A071B]/10">
                                    <button
                                        className="question-btn flex w-full items-start gap-x-5 justify-between rounded-lg text-left text-lg font-bold text-slate-800 focus:outline-none p-5"
                                        onClick={() => toggleAnswer(id)}
                                    >
                                        <span>{question}</span>
                                        <svg
                                            stroke="currentColor"
                                            fill="currentColor"
                                            strokeWidth="0"
                                            viewBox="0 0 24 24"
                                            className={`mt-1.5 md:mt-0 flex-shrink-0 h-5 w-5 text-[#5B5675] transition-transform ${activeId === id ? 'rotate-180' : ''}`}
                                            height="1em"
                                            width="1em"
                                            xmlns="http://www.w3.org/2000/svg"
                                        >
                                            <path d="M16.293 9.293 12 13.586 7.707 9.293l-1.414 1.414L12 16.414l5.707-5.707z"></path>
                                        </svg>
                                    </button>
                                    {activeId === id && (
                                        <div className="answer pt-2 pb-5 px-5 text-sm lg:text-base text-[#343E3A] font-medium">
                                            {answer}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            </div>
        </div>
    )
}
