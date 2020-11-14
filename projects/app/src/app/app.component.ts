import {AfterViewInit, Component, ElementRef, ViewChild, ViewEncapsulation} from '@angular/core';
import sdk from '@stackblitz/sdk';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class AppComponent implements AfterViewInit {
  @ViewChild('stackBlitzHost') stackBlitzHost: ElementRef<HTMLDivElement>;

  ngAfterViewInit(): void {
    sdk.embedProjectId(this.stackBlitzHost.nativeElement, 'rxjs-debug-playground', {
      openFile: new URLSearchParams(location.search).get('file') || 'index.ts',
      view: 'both',
      theme: 'dark',
      width: '100%',
      height: '100%',
      hideDevTools: true,
      hideExplorer: true,
      hideNavigation: true,
      forceEmbedLayout: true,
    });
  }
}
