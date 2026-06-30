import { decodeVinNumber } from "../services/vinServices.js";

export const checkVin = async (req, res) => {
    try {
        const { vin } = req.params;

        if (!vin) {
            return res.status(400).json({
                error: 'Please provide a Vin Number'
            });
        }
        const carInfo = await decodeVinNumber(vin);
        res.status(200).json({
            message: 'VIN decoded successfully!',
            carInfo: carInfo
        });
    } catch (error) {
        console.error('Error in vinController :', error);
        res.status(500).json({
            error: error.message || 'failed to decode VIN'
        });
    }
}

export const checkPlate = async (req, res) => {
    try {
        const { plate, state } = req.query;

        if (!plate || !state) {
            return res.status(400).json({
                error: 'Please provide both plate number and state (e.g. CA, TX, NY)'
            });
        }

        const url = `https://us-license-plate-to-vin.p.rapidapi.com/licenseplateapi.php?plate=${encodeURIComponent(plate.trim().toUpperCase())}&state=${encodeURIComponent(state.trim().toUpperCase())}`;

        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'x-rapidapi-key': process.env.RAPID_API_KEY,
                'x-rapidapi-host': 'us-license-plate-to-vin.p.rapidapi.com'
            }
        });

        if (!response.ok) {
            throw new Error(`License plate API responded with status ${response.status}`);
        }

        const plateData = await response.json();

        // API returns an object with VIN, make, model, year
        const vin = plateData?.vin || plateData?.VIN || plateData?.results?.[0]?.vin;
        if (!vin) {
            return res.status(404).json({
                error: 'No vehicle found for that plate and state combination. Please double-check and try again.'
            });
        }

        // Now decode the VIN through NHTSA for full specs (free, no quota cost)
        const carInfo = await decodeVinNumber(vin);

        res.status(200).json({
            message: 'License plate decoded successfully!',
            vin,
            carInfo
        });

    } catch (error) {
        console.error('Error in checkPlate controller:', error);
        res.status(500).json({
            error: error.message || 'Failed to decode license plate'
        });
    }
}

export const checkIndianPlate = async (req, res) => {
    try {
        const { plate } = req.query;

        if (!plate) {
            return res.status(400).json({
                error: 'Please provide an Indian vehicle number (e.g. UP77AM5674)'
            });
        }

        const response = await fetch('https://vehicle-rc-information.p.rapidapi.com/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-rapidapi-host': 'vehicle-rc-information.p.rapidapi.com',
                'x-rapidapi-key': process.env.INDIAN_RC_API_KEY
            },
            body: JSON.stringify({ VehicleNumber: plate.trim().toUpperCase() })
        });

        const data = await response.json();

        if (!response.ok || !data.success) {
            return res.status(404).json({
                error: data.error || 'No vehicle found for that registration number. Please verify and try again.'
            });
        }

        const r = data.data;

        res.status(200).json({
            message: 'Indian vehicle registration decoded successfully!',
            vehicleInfo: {
                registrationNumber: r.registrationNo || plate.toUpperCase(),
                ownerName: r.ownerName || 'N/A',
                make: r.makerModel || 'N/A',
                model: r.vehicleModel || 'N/A',
                fuelType: r.fuelType || 'N/A',
                vehicleClass: r.vehicleClass || 'N/A',
                color: r.vehicleColor || 'N/A',
                regDate: r.registrationDate || 'N/A',
                regUpto: r.fitnessUpto || 'N/A',
                insuranceUpto: r.insuranceUpto || 'N/A',
                insuranceCompany: r.insuranceCompany || 'N/A',
                rto: r.registrationAuthority || 'N/A',
                chassis: r.chassisNo || 'N/A',
                engine: r.engineNo || 'N/A',
                rcStatus: r.rcStatus || 'N/A',
                seatCapacity: r.seatCapacity || 'N/A',
                fuelNorms: r.fuelNorms || 'N/A',
            }
        });

    } catch (error) {
        console.error('Error in checkIndianPlate controller:', error);
        res.status(500).json({
            error: error.message || 'Failed to decode Indian vehicle registration'
        });
    }
}
