import { useState } from 'react';
import axios from 'axios';
import Input from "./components/Input.js";
import Dropdown from "./components/Dropdown.js";
import {CatValues, NumValues} from "./constants/index.js";

const houseData = {
    LotFrontage: 70.05,
    LotArea: 10516.83,
    OverallQual: 6.1,
    YearBuilt: 1971.1,
    TotalBsmtSF: 1041.1,
    GrLivArea: 1515.5,
    FullBath: 1.6,
    GarageCars: 1.77,
    SaleCondition: "Normal",
    KitchenQual: "TA",
    HouseStyle:"2Story",
    Neighborhood:"CollgCr",
    MSZoning:"RL"
};

export default function Home() {
    const [inputData, setInputData] = useState(houseData);
    const [prediction, setPrediction] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleChange = (type,value) => {
        setInputData((prev) => ({ ...prev, [type]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true)
        try {
            const response = await axios.post('http://127.0.0.1:5000/predict', inputData);
            setPrediction(response.data.predicted_price);
        } catch (error) {
            console.error('Error making prediction:', error);
        } finally {
            setLoading(false)
        }
    };

    return (
        <div className="px-2 md:px-10 py-6 space-y-5 md:border md:border-4 mx-auto my-2 md:w-3/4 lg:w-1/2 bg-white">
            <div className='text-[30px] font-semibold font-roboto flex justify-center'>
                <h1>House Price Predictor</h1>
            </div>
            <form onSubmit={handleSubmit}>
                <div className="flex flex-col justify-center ">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm font-medium">
                    {
                        NumValues.map(item=>(
                            <div>
                                <Input
                                    label={item.label}
                                    onChange={(value)=>handleChange(item.name,parseFloat(value))}
                                    labelClassName="mb-1"
                                    min={item.min}
                                    max={item.max}
                                    value={inputData[item.name]}
                                />
                            </div>
                        ))
                    }

                    {
                        CatValues.map(item=>(
                            <div>
                                <Dropdown
                                    label={item.label}
                                    onChange={(value)=>handleChange(item.name,value)}
                                    options={item.data}
                                    selectedOption={inputData[item.name]}
                                />
                            </div>
                        ))
                    }

                </div>
                <button
                    type="submit"
                    disabled={loading}
                    className="px-4 py-2 cursor-pointer bg-blue-800 rounded-md text-white transition ease-in-out duration-100 hover:scale-110"
                >
                    Predict
                </button>

                    {prediction &&
                        <div className="px-2 md:px-10 py-10 bg-gray-200 mt-10 flex justify-center text-base md:text-[25px] rounded-md">
                            <span className="pr-1">Predicted Sale Price : </span>
                            <span className="font-semibold">{parseFloat(prediction).toFixed(2)}</span>
                        </div>
                    }
                </div>
            </form>
        </div>
    );
}