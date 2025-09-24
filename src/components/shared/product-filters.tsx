import { Input } from "@/components/ui/input";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import Link from "next/link";

export default function ProductFilters({ categories, searchParams }) {
  const { q, category, sort } = searchParams;

  return (
    <div className="mb-8 flex flex-col md:flex-row items-center justify-between gap-4">
      <div className="w-full md:w-1/3">
        <form>
          <Input
            type="search"
            name="q"
            placeholder="Search products..."
            defaultValue={q}
            className="w-full"
          />
        </form>
      </div>
      <div className="flex items-center gap-4">
        <Select name="category" defaultValue={category}>
          <SelectTrigger className="w-full md:w-[180px]">
            <SelectValue placeholder="Filter by category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">
              <Link href="/store">All Categories</Link>
            </SelectItem>
            {categories.map((cat) => (
              <SelectItem key={cat.id} value={cat.id}>
                <Link href={`/store?category=${cat.id}`}>{cat.name}</Link>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select name="sort" defaultValue={sort}>
          <SelectTrigger className="w-full md:w-[180px]">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">Newest</SelectItem>
            <SelectItem value="price-asc">Price: Low to High</SelectItem>
            <SelectItem value="price-desc">Price: High to Low</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
