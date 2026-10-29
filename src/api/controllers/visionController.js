import { identifyCropDamage } from "../services/visionService.js";
import { getFarmerByUserId } from "../models/farmerModel.js";
import { listLandsByFarmer } from "../models/landModel.js";

const missingVisionSetup = "AI crop identification is not configured yet. The MAO administrator must add GEMINI_API_KEY on the server before the system can analyze fruits, vegetables, and crops.";

export async function analyzeFarmImage(req, res, next) {
  try {
    if (!req.file) return res.status(422).json({ message: "A farm image is required." });
    const farmer = await getFarmerByUserId(req.user.id);
    const lands = farmer ? await listLandsByFarmer(farmer.id) : [];
    const selectedLand = lands.find(land => String(land.id) === String(req.body.landId));
    if (req.body.landId && !selectedLand) return res.status(422).json({ message: "The selected land could not be found in your farm records." });
    const reportContext = { reportedCrop: req.body.reportedCrop, reportedDamageType: req.body.reportedDamageType, farmerNotes: req.body.farmerNotes };
    const landContext = selectedLand ? { landName: selectedLand.name, cropTypes: selectedLand.crop_types, ...reportContext } : reportContext;
    const analysis = await identifyCropDamage(req.file.buffer, req.file.mimetype, landContext);
    if (!analysis) return res.json({ analysis: null, notice: missingVisionSetup, configured: false });
    res.json({ analysis, notice: analysis.qualityCheck === "needs_clearer_photo" ? "The crop is not clear enough for a reliable advisory. Take a close, well-lit photo of the leaves, fruit, or vegetable and capture again." : null, configured: true });
  } catch (error) { next(error); }
}
