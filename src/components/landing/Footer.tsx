import { Globe, Mail, FileText } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-card border-t py-12">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center shadow-lg">
                <span className="text-xl">📦</span>
              </div>
              <div>
                <h3 className="font-bold text-lg">ACIEXSimul</h3>
                <p className="text-xs text-muted-foreground">Simulateur de coûts export</p>
              </div>
            </div>
            <p className="text-muted-foreground text-sm max-w-sm">
              Plateforme de simulation des coûts à l'exportation basée sur les 
              Incoterms® 2026 pour les entreprises du commerce international.
            </p>
          </div>
          
          {/* Resources */}
          <div>
            <h4 className="font-semibold mb-4">Ressources</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <a href="#" className="hover:text-primary transition-colors flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  Guide Incoterms 2026
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary transition-colors flex items-center gap-2">
                  <Globe className="w-4 h-4" />
                  Codes SH
                </a>
              </li>
            </ul>
          </div>
          
          {/* Contact */}
          <div>
            <h4 className="font-semibold mb-4">Contact</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <a href="mailto:contact@aciexsimul.com" className="hover:text-primary transition-colors flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  contact@aciexsimul.com
                </a>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t mt-8 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <p>© 2026 ACIEXSimul. Tous droits réservés.</p>
          <p>Incoterms® est une marque déposée de ICC</p>
        </div>
      </div>
    </footer>
  );
}
