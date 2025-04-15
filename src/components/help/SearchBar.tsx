
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

interface SearchBarProps {
  searchTerm: string;
  onSearch: (e: React.FormEvent) => void;
  onSearchTermChange: (value: string) => void;
}

export const SearchBar = ({ searchTerm, onSearch, onSearchTermChange }: SearchBarProps) => {
  return (
    <form onSubmit={onSearch} className="relative mb-8">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
      <Input 
        className="pl-10" 
        placeholder="Pesquisar por dúvidas frequentes..."
        value={searchTerm}
        onChange={(e) => onSearchTermChange(e.target.value)}
        type="search"
      />
    </form>
  );
};
