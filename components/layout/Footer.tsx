import { EnvironmentOutlined, MailOutlined, PhoneOutlined } from '@ant-design/icons'
import Image from '@/src/shims/Image'

function BrandMark() {
  return (
    <div className="inline-flex items-center gap-3">
      <span
        className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-lg"
        style={{
          background: 'color-mix(in srgb, var(--primary) 16%, var(--bg-card))',
          border: '1px solid var(--border-strong)',
        }}
      >
        <Image src="/images/wc2026-logo.svg" alt="WC 2026" width={72} height={72} unoptimized className="h-10 w-10 object-contain" />
      </span>
      <span>
        <span className="block font-display text-lg font-extrabold leading-tight" style={{ color: 'var(--text-main)' }}>
          WC 2026
        </span>
        <span className="block text-xs font-bold uppercase tracking-[0.14em]" style={{ color: 'var(--text-muted)' }}>
          Match Center
        </span>
      </span>
    </div>
  )
}

export default function Footer() {
  return (
    <footer className="mt-auto pb-24 pt-10 md:pb-10" style={{ borderTop: '1px solid var(--border)', background: 'var(--bg-card)' }}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-8 md:grid-cols-[1.2fr_1fr] md:items-start">
          <div>
            <BrandMark />
            <p className="mt-4 max-w-xl text-sm leading-6" style={{ color: 'var(--text-muted)' }}>
              Dünya Kuboku 2026 üçün oyun təqvimi, qruplar, stadionlar, komandalar və statistika məlumatları bir yerdə.
            </p>
          </div>

          <div className="space-y-3 text-sm md:justify-self-end md:text-right" style={{ color: 'var(--text-muted)' }}>
            <a
              href="mailto:ismayilzadeanar310@gmail.com"
              className="flex items-center gap-2 no-underline md:justify-end"
              style={{ color: 'var(--text-muted)' }}
            >
              <MailOutlined aria-hidden="true" />
              ismayilzadeanar310@gmail.com
            </a>
            <a
              href="tel:+994504496536"
              className="flex items-center gap-2 no-underline md:justify-end"
              style={{ color: 'var(--text-muted)' }}
            >
              <PhoneOutlined aria-hidden="true" />
              +994 50 449 65 36
            </a>
            <p className="flex items-center gap-2 md:justify-end">
              <EnvironmentOutlined aria-hidden="true" />
              Bakı, Azərbaycan
            </p>
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-2 border-t pt-5 text-xs sm:flex-row sm:items-center sm:justify-between" style={{ borderColor: 'var(--border)', color: 'var(--text-faint)' }}>
          <span>WC 2026 Match Center</span>
          <span>Rəsmi FIFA resursu deyil.</span>
        </div>
      </div>
    </footer>
  )
}
