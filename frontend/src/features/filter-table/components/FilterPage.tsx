import Filters from "./Filters";
import FilterTable from "./FilterTable";
import '../css/FiltersPage.css'

function FilterPage() {
    return (
        <div className="filter-page">
            <Filters />
            <FilterTable />
        </div>
    );
}

export default FilterPage;
