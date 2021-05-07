import * as React from "react";
import styles from "./HelloWorld.module.scss";
import { IHelloWorldProps } from "./IHelloWorldProps";
import { ISiteGroupInfo, PnPService } from "@custom/spfx-2019-lib";
import { IHelloWorldState } from "./IHelloWorldState";

export default class HelloWorld extends React.Component<
  IHelloWorldProps,
  IHelloWorldState
> {
  constructor(props: IHelloWorldProps) {
    super(props);
    this.state = { groups: [] };
  }

  public async componentDidMount(): Promise<void> {
    const service = new PnPService(this.props.absoluteWebUrl);
    let groups = await service.getAllSiteGroups();
    this.setState({ groups: groups });
  }
  public render(): React.ReactElement<IHelloWorldProps> {
    return (
      <div className={styles.helloWorld}>
        <div className={styles.container}>
          <div className={styles.row}>
            <div className={styles.column}>
              <span className={styles.title}>Welcome to SharePoint!</span>
              {this.state.groups.map((group: ISiteGroupInfo) => (
                <p className={styles.subTitle}>{group.Title}</p>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }
}
