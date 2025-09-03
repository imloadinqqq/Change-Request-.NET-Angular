import { Injectable } from '@angular/core';
import { OverlayContainer } from '@angular/cdk/overlay';

@Injectable()
export class AppOverlayContainer extends OverlayContainer {
  protected override _createContainer(): void {
    super._createContainer();

    // overlay container attach to <body>
    if (this._containerElement && !document.body.contains(this._containerElement)) {
      document.body.appendChild(this._containerElement);
    }
  }
}
