import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"

interface MenuSearchFilterOptionProps {
  searchQuery: string
  setSearchQuery: (query: string) => void
}

const MenuSearchFilterOption = ({ searchQuery, setSearchQuery }: MenuSearchFilterOptionProps) => {
  return (
    <div className="relative w-full flex items-center">
      <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none transition-colors group-focus-within:text-primary" />
      <Input
        type="text"
        placeholder="Search Ahar Bengal delicacies..."
        className="h-14 pl-12 pr-4 text-base w-full bg-card border-border rounded-xl shadow-xs focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:border-primary transition-all duration-200"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
    </div>
  )
}

export default MenuSearchFilterOption
