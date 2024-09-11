import React, { useState } from 'react'
// import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Button from '@/components/Button/Button'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { ChartNoAxesCombined, Shield, Smartphone, Users, Share2, MessageSquare, Link as LinkIcon } from "lucide-react"

import { Link } from 'react-router-dom'

export default function Homepage() {

    return (
        <main className="flex-1">
        <section className="flex justify-center w-full py-12 md:py-24 lg:py-32 xl:py-48 bg-[#CBE3FF]">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                    Stockage Cloud Sécurisé pour Tous
                  </h1>
                  <p className="my-5 max-w-[600px] text-gray-500 md:text-xl">
                    Stockez, synchronisez et partagez vos fichiers facilement. Accédez à vos données de n'importe où, à tout moment.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Button color="primary" css='w-[200px]'>
                    Commencer
                  </Button>
                  <Button color="neutral" css='w-[200px]'>
                    En savoir plus
                  </Button>
                </div>
              </div>
              <img
                alt="Stockage Cloud"
                className="mx-auto aspect-video  rounded-xl object-cover object-center sm:w-full lg:order-last shadow-md"
                height="550"
                src="/images/sky-cloud.png"
                width="550"
              />
            </div>
          </div>
        </section>
        <section className="flex justify-center w-full py-12 md:py-24 lg:py-32 bg-white">
          <div className="container px-4 md:px-6">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-center mb-12">Pourquoi Nous Choisir</h2>
            <div className="grid gap-6 lg:grid-cols-4">
              <div className="flex flex-col items-center space-y-2 border-gray-200 p-4 rounded-lg">
                <Shield className="h-12 w-12 text-primary" />
                <h3 className="text-xl font-bold">Stockage Sécurisé</h3>
                <p className="text-sm text-gray-500 text-center">Vos données sont cryptées et protégées à tout moment.</p>
              </div>
              <div className="flex flex-col items-center space-y-2 border-gray-200 p-4 rounded-lg">
                <Smartphone className="h-12 w-12 text-primary" />
                <h3 className="text-xl font-bold">Accès Partout</h3>
                <p className="text-sm text-gray-500 text-center">Accédez à vos fichiers depuis n'importe quel appareil, où que vous soyez.</p>
              </div>
              <div className="flex flex-col items-center space-y-2 border-gray-200 p-4 rounded-lg">
                <Users className="h-12 w-12 text-primary" />
                <h3 className="text-xl font-bold">Facile à Utiliser</h3>
                <p className="text-sm text-gray-500 text-center">Interface intuitive pour une gestion des fichiers sans effort.</p>
              </div>
              <div className="flex flex-col items-center space-y-2 border-gray-200 p-4 rounded-lg">
                <ChartNoAxesCombined className="h-12 w-12 text-primary" />
                <h3 className="text-xl font-bold">Analyses Détailées</h3>
                <p className="text-sm text-gray-500 text-center">Suivi et statistiques complets de vos données.</p>
              </div>
            </div>
          </div>
        </section>
        <section className="flex justify-center w-full py-12 md:py-24 lg:py-32 bg-[#CBE3FF]">
          <div className="container px-4 md:px-6">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-center mb-12">Fonctionnalités Clés</h2>
            <div className="grid gap-6 lg:grid-cols-3">
              <div className="flex flex-col items-center space-y-2 border-gray-200 p-4 rounded-lg bg-white">
                <Share2 className="h-12 w-12 text-primary" />
                <h3 className="text-xl font-bold">Stockage Partagé</h3>
                <p className="text-sm text-gray-500 text-center">
                  Collaborez facilement avec vos collègues sur des fichiers et dossiers partagés.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-2 border-gray-200 p-4 rounded-lg bg-white">
                <MessageSquare className="h-12 w-12 text-primary" />
                <h3 className="text-xl font-bold">Chatbot Intelligent</h3>
                <p className="text-sm text-gray-500 text-center">
                  Obtenez une assistance instantanée grâce à notre chatbot alimenté par l'IA.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-2 border-gray-200 p-4 rounded-lg bg-white">
                <LinkIcon className="h-12 w-12 text-primary" />
                <h3 className="text-xl font-bold">Intégration Facile</h3>
                <p className="text-sm text-gray-500 text-center">
                  Intégrez facilement vos outils et applications préférés.
                </p>
              </div>
            </div>
          </div>
        </section>
        <section className="flex justify-center w-full py-12 md:py-24 lg:py-32 bg-white">
          <div className="container px-4 md:px-6">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-center mb-12">
              Questions Fréquemment Posées
            </h2>
            <Accordion type="single" collapsible className="w-full max-w-3xl mx-auto">
              <AccordionItem value="item-1">
                <AccordionTrigger>Mes données sont-elles sécurisées ?</AccordionTrigger>
                <AccordionContent>
                  Vos données sont protégées par un cryptage AES 256 bits, tant en transit qu'au repos. Nous proposons également
                  une authentification à deux facteurs pour une couche de sécurité supplémentaire.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-2">
                <AccordionTrigger>Quels sont les plans tarifaires ?</AccordionTrigger>
                <AccordionContent>
                  Nous proposons un plan gratuit avec 5 Go de stockage et des plans payants à partir de 9,99 $/mois pour 1 To de stockage.
                  Des plans d'entreprise avec un stockage illimité sont également disponibles.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-3">
                <AccordionTrigger>Y a-t-il une limite de taille de fichier ?</AccordionTrigger>
                <AccordionContent>
                  Les fichiers individuels sont limités à 5 Go dans nos plans standards. Les plans d'entreprise n'ont pas de limite de taille de fichier.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-4">
                <AccordionTrigger>Puis-je accéder à mes fichiers hors ligne ?</AccordionTrigger>
                <AccordionContent>
                  Oui, vous pouvez marquer des fichiers pour un accès hors ligne sur nos applications mobiles et de bureau. Ces fichiers seront
                  disponibles même sans connexion Internet.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </section>
      </main>
    )
}
