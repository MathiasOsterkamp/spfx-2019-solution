import '@pnp/sp/webs';
import '@pnp/sp/site-groups';
import { ISiteGroupInfo } from '../interfaces/models/ISiteGroupInfo';
import { IPnPService } from '../interfaces/IPnPService';
export declare class PnPService implements IPnPService {
    constructor(absoluteWebUrl: string);
    /**
     * Get all site groups
     */
    getAllSiteGroups(): Promise<ISiteGroupInfo[]>;
}
