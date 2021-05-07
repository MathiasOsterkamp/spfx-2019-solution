
import { sp } from '@pnp/sp';
import '@pnp/sp/webs';
import '@pnp/sp/site-groups';
import { ISiteGroupInfo } from '../interfaces/models/ISiteGroupInfo';
import { IPnPService } from '../interfaces/IPnPService';



export class PnPService  implements IPnPService {
  
 constructor(absoluteWebUrl:string){
  sp.setup({
    sp: {
      baseUrl: absoluteWebUrl
    }
  });
 }
  /**
   * Get all site groups
   */
  public async getAllSiteGroups(): Promise<ISiteGroupInfo[]> {
    return await sp.web.siteGroups.get() as ISiteGroupInfo[];
  }

  
}
