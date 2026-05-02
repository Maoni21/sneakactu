import Link from 'next/link'

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="sa-footer">
      <div className="sa-footer__inner">
        {/* Brand col */}
        <div className="sa-footer__col sa-footer__brand">
          <img src="/logo-dark.svg" alt="SneakActu" height="28" style={{ display: 'block' }} />
          <p className="sa-footer__tag">
            Le média indépendant des sneakers et marques émergentes — depuis Paris.
          </p>
        </div>

        {/* Sections */}
        <div className="sa-footer__col">
          <h5>Sections</h5>
          <Link href="/articles">Actus</Link>
          <Link href="/releases">Releases</Link>
          <Link href="/emergentes">Émergentes</Link>
          <Link href="/guides">Guides</Link>
          <Link href="/marques">Marques</Link>
        </div>

        {/* Marques */}
        <div className="sa-footer__col">
          <h5>Marques</h5>
          <Link href="/marques/nike">Nike</Link>
          <Link href="/marques/adidas">Adidas</Link>
          <Link href="/marques/new-balance">New Balance</Link>
          <Link href="/marques/asics">Asics</Link>
          <Link href="/marques/jordan">Jordan</Link>
        </div>

        {/* À propos */}
        <div className="sa-footer__col">
          <h5>À propos</h5>
          <Link href="/mentions-legales">Mentions légales</Link>
          <Link href="/confidentialite">Confidentialité</Link>
          <Link href="/contact">Contact</Link>
        </div>
      </div>

      <div className="sa-footer__rule">
        <span>© {year} SneakActu · sneakactu.fr</span>
        <span>Fait à Paris · Hébergé sur Vercel</span>
      </div>
    </footer>
  )
}
