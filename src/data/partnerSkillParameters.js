// @ts-nocheck -- Don't try to infer the type of this file since it's too large
import partnerSkillParameters from "~/raw_data/Pal/Content/Pal/DataTable/PassiveSkill/DT_PartnerSkillParameter.json";
import { convertDataTableType } from "~/utils/convertDataTableType";

/**
 * @type {typeof import("../types/PartnerSkillParameters.ts").PartnerSkillParameters}
 */
export const partnerSkillParametersMap = convertDataTableType(partnerSkillParameters);
