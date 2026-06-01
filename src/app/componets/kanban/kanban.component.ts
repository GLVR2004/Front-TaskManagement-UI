import { Component, OnInit, inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CommonModule } from '@angular/common';
import {
  DragDropModule,
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { TaskDto } from '../../models/task.model';
import { TaskService } from '../../services/task.service';
import { TaskDialogComponent } from '../../task-dialog/task-dialog.component';

@Component({
  selector: 'app-kanban',
  standalone: true,
  imports: [
    CommonModule,
    DragDropModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
  ],
  templateUrl: './kanban.component.html',
  styleUrls: ['./kanban.component.scss'],
})
export class KanbanComponent implements OnInit {
  todo: TaskDto[] = [];
  done: TaskDto[] = [];

  private taskService = inject(TaskService);
  private dialog = inject(MatDialog);
  private snackBar = inject(MatSnackBar);

  ngOnInit(): void {
    this.loadTasks();
  }

  loadTasks(): void {
    this.taskService.getTasks().subscribe({
      next: (tasks) => {
        this.todo = tasks.filter((t) => !t.isComplete);
        this.done = tasks.filter((t) => t.isComplete);
      },
      error: (err) => {
        console.error('Error al cargar tareas', err);
        this.snackBar.open('Error al cargar las tareas', 'Cerrar', {
          duration: 3000,
        });
      },
    });
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(TaskDialogComponent, { width: '400px' });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.taskService.createTask(result).subscribe({
          next: () => {
            this.loadTasks();
            this.snackBar.open('Tarea creada con éxito', 'Cerrar', {
              duration: 3000,
            });
          },
          error: (err) => {
            console.error('Error al crear tarea', err);
            this.snackBar.open('Error al crear la tarea', 'Cerrar', {
              duration: 3000,
            });
          },
        });
      }
    });
  }

  drop(event: CdkDragDrop<TaskDto[]>): void {
    const { previousContainer, container, previousIndex, currentIndex } = event;

    if (previousContainer === container) {
      moveItemInArray(container.data, previousIndex, currentIndex);
    } else {
      const task = previousContainer.data[previousIndex];
      transferArrayItem(
        previousContainer.data,
        container.data,
        previousIndex,
        currentIndex,
      );

      this.taskService.completeTask(task.id).subscribe({
        next: () =>
          this.snackBar.open('Tarea actualizada', 'Cerrar', { duration: 2000 }),
        error: (err) => {
          console.error('No se pudo actualizar la tarea', err);
          this.snackBar.open('Error al actualizar', 'Cerrar', {
            duration: 3000,
          });
          transferArrayItem(
            container.data,
            previousContainer.data,
            currentIndex,
            previousIndex,
          );
        },
      });
    }
  }
}
