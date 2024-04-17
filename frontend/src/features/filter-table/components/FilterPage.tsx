import Filters from "./Filters";
// import FilterTable from "./FilterTable";
import '../css/FiltersPage.css'
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
function FilterPage() {

        const location = useLocation();

        useEffect(() => {
            const searchParams = new URLSearchParams(location.search);
            const queryParams: { [key: string]: string | string[] } = {};

            for (const [key, value] of searchParams.entries()) {
                 if (key === 'colors') {
                     queryParams[key] = queryParams[key]
                         ? [...(queryParams[key] as string[]), value]
                         : [value];
                 } else {
                     
                     queryParams[key] = value;
                 }
            }
            console.log(queryParams)
            // Example:
            // fetch(`http://localhost:8080?${new URLSearchParams(queryParams)}`)
            //     .then(response => response.json())
            //     .then(data => {
            //         // Handle response data
            //     })
            //     .catch(error => {
            //         // Handle errors
            //     });
        }, [location.search]);

    return (
        <div className="filter-page">
            <Filters />
            {/* <FilterTable /> */}
        </div>
    );
}

export default FilterPage;
