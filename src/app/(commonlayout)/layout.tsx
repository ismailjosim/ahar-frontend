import PublicNavbar from "@/components/shared/PublicNavbar"
import PublicFooter from "@/components/shared/PublicFooter"

export default function CommonLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <>
      <PublicNavbar />
      {children}
      <PublicFooter />
    </>
  )
}
