import { useEffect, useState } from 'react';
import '../css/Filters.css';
import { Colors } from '../types/Colors';
import Multiselect from 'multiselect-react-dropdown';
import { ColorMultiselect } from '../types/ColorMultiselect';
import { useLocation, useSearchParams } from 'react-router-dom';
import { Speed } from '../types/Speed';
import DatePicker from 'react-datepicker';

function Filters() {

    const [searchParams, setSearchParams] = useSearchParams();
     const [endDate, setEndDate] = useState(new Date());
    const [startDate, setStartDate] = useState(new Date());
    const location = useLocation();
    const [selectedColors, setSelectedColors] = useState<string[]>([]);
    const [selectedColorsObject, setSelectedColorsObject] = useState<
        ColorMultiselect[]
    >([]);
     const [speed, setSpeed] = useState<number>(50);
     const [allColors, ] = useState<ColorMultiselect[]>(
         Object.keys(Colors).map((color) => ({
             name: color,
             id: color.toLowerCase(), 
         })),
    );
    const [speedCriteria,setSpeedCriteria] = useState<string>(Speed.LESS);
    
    useEffect(() => {
         const searchParams = new URLSearchParams(location.search);
        const colorsFromURL = searchParams.getAll('colors');
        const speedFromURL = searchParams.get('speed');
        const speedCriteriaFromURL = searchParams.get(
            'speed-criteria',
        ) as keyof typeof Speed;
       if (speedFromURL && !isNaN(parseInt(speedFromURL, 10))) {
           setSpeed(parseInt(speedFromURL, 10));
       }
        if (
            speedCriteriaFromURL &&
            Object.values(Speed).includes(speedCriteriaFromURL)
        ) {
            setSpeedCriteria(speedCriteriaFromURL);
        }
        setSelectedColors(colorsFromURL);
        const selected =colorsFromURL.map((color) => ({
            name: color,
            id: color.toLowerCase(),
        }));
        setSelectedColorsObject(selected)
    },[])
    

    useEffect(() => {
        const queryParams = new URLSearchParams();
        if (speed) {
            queryParams.set('speed', speed.toString());
            if (speedCriteria) {
                queryParams.set('speed-criteria', speedCriteria);
            }
        }
        selectedColors.forEach((color) => {
            queryParams.append('colors', color);
        });
        setSearchParams(queryParams);
    }, [speed, speedCriteria, selectedColors]);

     const onSelect = (
         selectedList: ColorMultiselect[],
         selectedItem: ColorMultiselect,
     ) => {
         const updatedList = [...selectedColors, selectedItem.name];
         setSelectedColors(updatedList);
     };

     const onRemove = (
         selectedList: ColorMultiselect[],
         removedItem: ColorMultiselect,
     ) => {
           const updatedList = selectedColors.filter(
               (item) => item !== removedItem.name,
           );
         setSelectedColors(updatedList);
     };
    
    const handleSpeedChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        console.log(event.target.value)
        const newSpeed = parseInt(event.target.value, 10); 
        setSpeed(newSpeed);
    };
      const handleEndDateChange = (date: any) => {
          setStartDate(date);
      };

    return (
        <div className="filters">
            <div>
                <h3>Filters</h3>
            </div>
            <div>
                <div className="filter-element">
                    <label>Colors</label>
                    <Multiselect
                        options={allColors}
                        onSelect={onSelect}
                        selectedValues={selectedColorsObject}
                        onRemove={onRemove}
                        displayValue="name"
                    />
                </div>
                <div className="filter-element">
                    <label>Maximum Speed:</label>
                    <select
                        onChange={(event) =>
                            setSpeedCriteria(event.target.value)
                        }
                    >
                        {Object.values(Speed).map((speedOption, index) => (
                            <option key={index} value={speedOption}>
                                {speedOption}
                            </option>
                        ))}
                    </select>
                    <input
                        value={speed || ''}
                        type="number"
                        onChange={handleSpeedChange}
                    />
                </div>
                <div className="filter-element">
                    <label>Date of Manufacture</label>
                    <div>
                       <DatePicker selected={startDate} onChange={(date) => setStartDate(date!)} />
                    </div>
                </div>
            </div>
            <div></div>
        </div>
    );
}

export default Filters;
