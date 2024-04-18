import { useEffect, useRef, useState } from 'react';
import '../css/Filters.css';
import { Colors } from '../types/Colors';
import Multiselect from 'multiselect-react-dropdown';
import { ColorMultiselect } from '../types/ColorMultiselect';
import { useLocation, useSearchParams } from 'react-router-dom';
import { Speed } from '../types/Speed';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { DateCriteria } from '../types/DateCriteria';


function Filters() {

    // Destructure necessary hooks and functions
    const [, setSearchParams] = useSearchParams();
    const location = useLocation();

    // State declarations with initial values
    const [startDate, setStartDate] = useState<Date | undefined>(undefined);
    const [selectedColors, setSelectedColors] = useState<string[]>([]);
    const [selectedColorsObject, setSelectedColorsObject] = useState<
        ColorMultiselect[]
    >([]);
    const [speed, setSpeed] = useState<number | undefined>(undefined);
    const [speedCriteria, setSpeedCriteria] = useState<string>(Speed.LESS);
    const [dateCriteria, setDateCriteria] = useState<string>(
        DateCriteria.AFTER,
    );
    const [hasPulseLaser, setHasPulseLaser] = useState<boolean>(false);

    // Reference declarations
    const multiselectRef = useRef<Multiselect | null>(null);

    // Initialize allColors state with keys from Colors object
    const [allColors] = useState<ColorMultiselect[]>(
        Object.keys(Colors).map((color) => ({
            name: color,
            id: color.toLowerCase(),
        })),
    );

    useEffect(() => {
        const searchParams = new URLSearchParams(location.search);
        const colorsFromURL = searchParams.getAll('colors');
        const speedFromURL = parseInt(searchParams.get('speed') || '', 10);
        const pulseLaserFromURL = searchParams.get('pulse-laser') === 'true';
        const speedCriteriaFromURL = searchParams.get(
            'speed-criteria',
        ) as keyof typeof Speed;
        const dateFromURL = searchParams.get('date');
        const dateCriteriaFromURL = searchParams.get(
            'date-criteria',
        ) as keyof typeof DateCriteria;

        if (!isNaN(speedFromURL)) {
            setSpeed(speedFromURL);
            if (Object.values(Speed).includes(speedCriteriaFromURL)) {
                setSpeedCriteria(speedCriteriaFromURL);
            }
        }

        if (dateFromURL) {
            setStartDate(new Date(dateFromURL));
            if (dateCriteriaFromURL) {
                setDateCriteria(dateCriteriaFromURL);
            }
        }

        setHasPulseLaser(pulseLaserFromURL);
        setSelectedColors(colorsFromURL);

        const selectedColorsObject = colorsFromURL.map((color) => ({
            name: color,
            id: color.toLowerCase(),
        }));
        setSelectedColorsObject(selectedColorsObject);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        const queryParams = new URLSearchParams();

        // Add speed parameters
        if (speed && speed >= 50 && speed <= 200) {
            queryParams.set('speed', speed.toString());
            if (speedCriteria) {
                queryParams.set('speed-criteria', speedCriteria);
            }
        }

        // Add date parameters
        if (startDate) {
            queryParams.set('date', startDate.toISOString());
            if (dateCriteria) {
                queryParams.set('date-criteria', dateCriteria);
            }
        }

        // Add color parameters
        selectedColors.forEach((color) => {
            queryParams.append('colors', color);
        });

        // Add pulse laser parameter
        queryParams.set('pulse-laser', hasPulseLaser.toString());

        // Update search params
        setSearchParams(queryParams);
    }, [speed, speedCriteria, selectedColors, dateCriteria, startDate, hasPulseLaser, setSearchParams]);

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
        const newSpeed = parseInt(event.target.value, 10);
        setSpeed(newSpeed);
    };

    const resetFilters = () => {
        setStartDate(undefined);
        setSelectedColors([]);
        setSelectedColorsObject([]);
        setSpeed(undefined);
        setSpeedCriteria(Speed.LESS);
        setDateCriteria(DateCriteria.AFTER);
        setHasPulseLaser(false);
        if (multiselectRef.current) {
            multiselectRef.current.resetSelectedValues();
        }
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
                        ref={multiselectRef}
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
                        value={speedCriteria}
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
                    <select
                        value={dateCriteria}
                        onChange={(event) =>
                            setDateCriteria(event.target.value)
                        }
                    >
                        {Object.entries(DateCriteria).map(
                            ([key, value], index) => (
                                <option key={index} value={key}>
                                    {value}
                                </option>
                            ),
                        )}
                    </select>
                    <DatePicker
                        selected={startDate}
                        onChange={(date) => setStartDate(date!)}
                        minDate={new Date(1980, 0, 1)}
                        maxDate={new Date(2020, 11, 31)}
                        showYearDropdown
                        scrollableYearDropdown
                    />
                </div>
                <div className="filter-element">
                    <label>Pulse-Laser:</label>
                    <select
                        value={hasPulseLaser.toString()}
                        onChange={(event) =>
                            setHasPulseLaser(event.target.value === 'true')
                        }
                    >
                        <option value="false">No</option>
                        <option value="true">Yes</option>
                    </select>
                </div>
            </div>
            <div>
                <button className="reset" onClick={resetFilters}>
                    Reset filter
                </button>
            </div>
        </div>
    );
}

export default Filters;
