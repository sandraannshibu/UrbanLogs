import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { INavigationEvent, INavigationIcon, INavigationLinkCollection } from 'src/app/model/toolbar';
import { appName } from 'src/environments/environment';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss'],
})
export class ToolbarComponent implements OnInit {
  
  /**
   * Handles the different links in toolbar
   */
  @Input() navCollection: INavigationLinkCollection[] = [];

  /**
   * Handles the different icon in toolbar
   */
   @Input() navIcons: INavigationIcon[] = [];

  /**
   * Handles different events emitted by toolbar
   */
  @Output() navEventEmitter = new EventEmitter<number>();


  homeEvent = INavigationEvent.HOME;
  title: string = appName

  constructor() {}

  ngOnInit(): void {}

  handleNavigationEvents(event: number) {
    this.navEventEmitter.emit(event);
  }
}
