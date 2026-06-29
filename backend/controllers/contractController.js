import Contract from "../models/Contract.js";
import analyseContractText from "../services/geminiServices.js";
import extractedTextFormPDF from "../services/pdfServices.js";

export const uploadContent = async (req, res)=> {
    try {
        if(!req.file) {
            return res.status(400).json({
                error : 'Please upload a pdf file'
            });
        }

        const text = await extractedTextFormPDF(req.file.buffer);
        console.log(`Parsed text length  : ${text.length} characters`);

        // Gemini Analysis
        const analysis = await analyseContractText(text);

        const newContract = new Contract({
            userId : req.user.id,
            fileName : req.file.originalname,
            fileSize : req.file.size,
            rawText : text,
            analysis : analysis
        });

        await newContract.save();

        res.status(200).json ( {
            message : 'PDF contract upload and parsed successfully!,',
            contractId : newContract._id,
            analysis : analysis,
        });
    } catch (error) {
        console.error('Error in contractController', error);
        res.status(500).json({
            error : error.message || 'Failed to parse PDF contract'
        });
    }
}

export const getContracts = async (req, res) => {
    try {
        const contracts = await Contract.find({userId : req.user.id}).sort({createdAt : -1});
        return res.status(200).json(contracts);
    } catch (error) {
        console.error('Error in getContracts controller : ', error);
        return res.status(500).json({
            error : 'Failed to fetch your saved contracts'
        });
    }
}