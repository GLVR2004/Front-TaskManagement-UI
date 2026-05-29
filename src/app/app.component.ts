import { Component } from '@angular/core';
import { KanbanComponent } from './componets/kanban/kanban.component';
import { RouterOutlet } from '@angular/router';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, KanbanComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'TaskManagement-UI';
}
