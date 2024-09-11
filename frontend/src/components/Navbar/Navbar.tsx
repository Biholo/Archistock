import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Cloud, Menu } from "lucide-react"
import { Link } from 'react-router-dom'

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)

  const navItems = [
    { name: 'Accueil', href: '/' },
    { name: 'Prix', href: '/pricing' },
  ]

  return (
    <header className="px-4 lg:px-6 h-14 flex items-center">
      <Link className="flex items-center justify-center" to="/">
        <Cloud className="h-6 w-6 text-primary" />
        <span className="ml-2 text-2xl font-bold text-gray-900">Archistock</span>
      </Link>
      
      {/* Desktop Navigation */}
      <nav className="ml-auto hidden md:flex items-center gap-4 sm:gap-6">
        {navItems.map((item) => (
          <Link 
            key={item.name}
            className="text-sm font-medium hover:underline underline-offset-4" 
            to={item.href}
          >
            {item.name}
          </Link>
        ))}
        <Button variant="ghost" size="sm">
          Login
        </Button>
        <Button size="sm">
          Register
        </Button>
      </nav>

      {/* Mobile Navigation */}
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild className="md:hidden ml-auto">
          <Button variant="ghost" size="icon">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="right">
          <nav className="flex flex-col gap-4">
            {navItems.map((item) => (
              <Link 
                key={item.name}
                className="text-lg font-medium hover:underline underline-offset-4" 
                to={item.href}
                onClick={() => setIsOpen(false)}
              >
                {item.name}
              </Link>
            ))}
            <Button variant="ghost" onClick={() => setIsOpen(false)}>
              Login
            </Button>
            <Button onClick={() => setIsOpen(false)}>
              Register
            </Button>
          </nav>
        </SheetContent>
      </Sheet>
    </header>
  )
}