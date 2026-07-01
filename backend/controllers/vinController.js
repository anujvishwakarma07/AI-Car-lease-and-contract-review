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
    const { plate } = req.query;

    if (!plate) {
        return res.status(400).json({
            error: 'Please provide an Indian vehicle number (e.g. UP77AM5674)'
        });
    }

    try {
        const apiKey = process.env.INDIAN_RC_API_KEY;
        if (!apiKey) {
            console.warn('INDIAN_RC_API_KEY is not defined in backend env. Displaying simulated sandbox data.');
            return res.status(200).json({
                message: 'Sandbox demo mode. Displaying simulated data.',
                isDummy: true,
                comment: 'It is dummy data, for getting the real data you have to donate.',
                vehicleInfo: {
                    registrationNumber: plate.trim().toUpperCase(),
                    ownerName: 'ROHIT SHARMA (SANDBOX)',
                    make: 'TATA MOTORS',
                    model: 'NEXON EV MAX',
                    fuelType: 'ELECTRIC',
                    vehicleClass: 'MOTOR CAR (LMV)',
                    color: 'PRISTINE WHITE',
                    regDate: '15-Mar-2023',
                    regUpto: '14-Mar-2038',
                    insuranceUpto: '14-Mar-2026',
                    insuranceCompany: 'HDFC ERGO GENERAL INSURANCE',
                    rto: 'MH-12 RTO PUNE, MAHARASHTRA',
                    chassis: 'ME4T12A34B567890X',
                    engine: 'EV-3PhaseInductionMotor',
                    rcStatus: 'ACTIVE',
                    seatCapacity: '5',
                    fuelNorms: 'BHARAT STAGE VI (BS-VI)',
                    isDummy: true,
                    comment: 'It is dummy data, for getting the real data you have to donate.'
                }
            });
        }

        const response = await fetch('https://vehicle-rc-information.p.rapidapi.com/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-rapidapi-host': 'vehicle-rc-information.p.rapidapi.com',
                'x-rapidapi-key': apiKey
            },
            body: JSON.stringify({ VehicleNumber: plate.trim().toUpperCase() })
        });

        const data = await response.json();

        const isQuotaReached = 
            response.status === 429 || 
            response.status === 403 || 
            (data && (
                (data.error && (
                    data.error.toLowerCase().includes('quota') || 
                    data.error.toLowerCase().includes('limit') || 
                    data.error.toLowerCase().includes('rate limit') || 
                    data.error.toLowerCase().includes('exceed') || 
                    data.error.toLowerCase().includes('subscribe') ||
                    data.error.toLowerCase().includes('blocked')
                )) ||
                (data.message && (
                    data.message.toLowerCase().includes('quota') || 
                    data.message.toLowerCase().includes('limit') || 
                    data.message.toLowerCase().includes('rate limit') || 
                    data.message.toLowerCase().includes('exceed') || 
                    data.message.toLowerCase().includes('subscribe') ||
                    data.message.toLowerCase().includes('blocked')
                ))
            ));

        if (isQuotaReached) {
            return res.status(200).json({
                message: 'Quota exceeded. Displaying sandbox simulated data.',
                isDummy: true,
                comment: 'It is dummy data, for getting the real data you have to donate.',
                vehicleInfo: {
                    registrationNumber: plate.trim().toUpperCase(),
                    ownerName: 'ROHIT SHARMA (SANDBOX)',
                    make: 'TATA MOTORS',
                    model: 'NEXON EV MAX',
                    fuelType: 'ELECTRIC',
                    vehicleClass: 'MOTOR CAR (LMV)',
                    color: 'PRISTINE WHITE',
                    regDate: '15-Mar-2023',
                    regUpto: '14-Mar-2038',
                    insuranceUpto: '14-Mar-2026',
                    insuranceCompany: 'HDFC ERGO GENERAL INSURANCE',
                    rto: 'MH-12 RTO PUNE, MAHARASHTRA',
                    chassis: 'ME4T12A34B567890X',
                    engine: 'EV-3PhaseInductionMotor',
                    rcStatus: 'ACTIVE',
                    seatCapacity: '5',
                    fuelNorms: 'BHARAT STAGE VI (BS-VI)',
                    isDummy: true,
                    comment: 'It is dummy data, for getting the real data you have to donate.'
                }
            });
        }

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
        
        const errorMsg = error.message || '';
        const isQuota = errorMsg.toLowerCase().includes('quota') || errorMsg.toLowerCase().includes('limit');
        
        if (isQuota) {
            return res.status(200).json({
                message: 'Quota exceeded. Displaying sandbox simulated data.',
                isDummy: true,
                comment: 'It is dummy data, for getting the real data you have to donate.',
                vehicleInfo: {
                    registrationNumber: plate.trim().toUpperCase(),
                    ownerName: 'ROHIT SHARMA (SANDBOX)',
                    make: 'TATA MOTORS',
                    model: 'NEXON EV MAX',
                    fuelType: 'ELECTRIC',
                    vehicleClass: 'MOTOR CAR (LMV)',
                    color: 'PRISTINE WHITE',
                    regDate: '15-Mar-2023',
                    regUpto: '14-Mar-2038',
                    insuranceUpto: '14-Mar-2026',
                    insuranceCompany: 'HDFC ERGO GENERAL INSURANCE',
                    rto: 'MH-12 RTO PUNE, MAHARASHTRA',
                    chassis: 'ME4T12A34B567890X',
                    engine: 'EV-3PhaseInductionMotor',
                    rcStatus: 'ACTIVE',
                    seatCapacity: '5',
                    fuelNorms: 'BHARAT STAGE VI (BS-VI)',
                    isDummy: true,
                    comment: 'It is dummy data, for getting the real data you have to donate.'
                }
            });
        }

        res.status(500).json({
            error: error.message || 'Failed to decode Indian vehicle registration'
        });
    }
};
