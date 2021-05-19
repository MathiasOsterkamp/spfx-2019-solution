import { override } from "@microsoft/decorators";
import { Log } from "@microsoft/sp-core-library";
import { BaseApplicationCustomizer } from "@microsoft/sp-application-base";
import { Dialog } from "@microsoft/sp-dialog";

import * as strings from "CustomInstallerApplicationCustomizerStrings";
import {
  SPHttpClient,
  SPHttpClientResponse,
  ISPHttpClientOptions,
} from "@microsoft/sp-http";

const LOG_SOURCE: string = "CustomInstallerApplicationCustomizer";

/**
 * If your command set uses the ClientSideComponentProperties JSON input,
 * it will be deserialized into the BaseExtension.properties object.
 * You can define an interface to describe it.
 */
export interface ICustomInstallerApplicationCustomizerProperties {
  // This is an example; replace with your own property
  testMessage: string;
}

/** A Custom Action which can be run during execution of a Client Side Application */
export default class CustomInstallerApplicationCustomizer extends BaseApplicationCustomizer<ICustomInstallerApplicationCustomizerProperties> {
  @override
  public async onInit(): Promise<void> {
    Log.info(LOG_SOURCE, `Initialized ${strings.Title}`);
    //do this only as site admin
    if (this.context.pageContext.legacyPageContext.isSiteAdmin) {
      try {
        //do installation
        await this.install();
        //if everything fine remove customizer
        await this.removeCustomizer(this.componentId);
        Log.info(LOG_SOURCE, "Removed customizer", this.context.serviceScope);
        await Dialog.alert(`Success. Refresh page!`);
      } catch (err) {
        console.log(err);
        Log.error(LOG_SOURCE, err, this.context.serviceScope);
        await Dialog.alert(`Error`);
      }
    }
    return Promise.resolve();
  }

  private async install(): Promise<void> {
    await Dialog.alert(`Do some install stuff.`);
    return;
  }

  protected removeCustomizer(componentId: string) {
    try {
      this._getdigest().then((digrestJson) => {
        console.log(digrestJson);
        const digest = digrestJson.FormDigestValue;
        const headers = {
          "X-RequestDigest": digest,
          "content-type": "application/json;odata=verbose",
        };
        const spOpts: ISPHttpClientOptions = {};
        this.context.spHttpClient
          .get(
            this.context.pageContext.web.absoluteUrl +
              `/_api/web/UserCustomActions`,
            SPHttpClient.configurations.v1,
            spOpts
          )
          .then((response: SPHttpClientResponse) => {
            response.json().then((responseJSON: any) => {
              console.log(responseJSON);

              responseJSON.value.forEach((element) => {
                //Match custom action
                if (element.ClientSideComponentId == componentId) {
                  //found custom action, call REST API to delete object
                  this.context.spHttpClient
                    .post(
                      this.context.pageContext.web.absoluteUrl +
                        "/_api/web/UserCustomActions(@v0)/deleteObject()?@v0=guid'" +
                        element.Id +
                        "'",
                      SPHttpClient.configurations.v1,
                      spOpts
                    )
                    .then((response: SPHttpClientResponse) => {
                      console.log(
                        "I think I just deleted a custom action via REST API---"
                      );
                    });
                }
              });
            });
          });
      });
    } catch (error) {
      console.error(error);
    }
  }

  private _getdigest(): Promise<any> {
    const spOpts: ISPHttpClientOptions = {};
    return this.context.spHttpClient
      .post(
        this.context.pageContext.web.absoluteUrl + `/_api/contextinfo`,
        SPHttpClient.configurations.v1,
        spOpts
      )
      .then((response: SPHttpClientResponse) => {
        return response.json();
      });
  }
}
