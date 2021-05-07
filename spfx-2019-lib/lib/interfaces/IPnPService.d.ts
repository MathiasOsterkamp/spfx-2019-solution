import { ISiteGroupInfo } from "./models/ISiteGroupInfo";
export interface IPnPService {
    getAllSiteGroups(): Promise<ISiteGroupInfo[]>;
}
