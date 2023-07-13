import { ChangeDetectorRef, Component } from '@angular/core';
import { ActivService } from './services/activ.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'activ-angular';

  ideas: any[];

  constructor(
    private cRef: ChangeDetectorRef,
    private activService: ActivService,
  ) {
    this.ideas = [];
  }

  async ngOnInit() {
    this.cRef.detectChanges();
    await this.activService.init();
    await this.getIdeas();
  }

  async getIdeas() {
    const getAllIdeas = await this.activService.getAllIdeas();
    this.ideas = getAllIdeas?.data;
    this.cRef.detectChanges();
  }

  goToIPFSUrl(idea: any) {
    window.open(idea?.url, '_blank');
  }
}
