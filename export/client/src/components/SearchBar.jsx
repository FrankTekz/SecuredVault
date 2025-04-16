import { useState } from "react";
import { Input } from "@/components/ui/input";

const SearchBar = () => {
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <div className="relative">
      <Input
        type="text"
        placeholder="Search vault..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="pr-10"
      />
      <i className="fas fa-search absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"></i>
    </div>
  );
};

export default SearchBar;
