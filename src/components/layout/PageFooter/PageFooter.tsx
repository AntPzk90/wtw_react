import { Logo } from '@/components/layout/Logo/Logo'

export const PageFooter = () => {
  return (
    <footer className="page-footer">
      <Logo isLight />

      <div className="copyright">
        <p>© 2019 What to watch Ltd.</p>
      </div>
    </footer>
  )
}
