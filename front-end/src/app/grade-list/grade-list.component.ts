import { Component, OnInit } from '@angular/core';
import { GradeService } from '../grade.service';
import { Grade } from '../grade.model';
import {
  MatCell,
  MatCellDef,
  MatColumnDef,
  MatHeaderCell,
  MatHeaderCellDef,
  MatHeaderRow, MatHeaderRowDef,
  MatRow,
  MatRowDef,
  MatTable,
} from '@angular/material/table';
import { MatCard } from '@angular/material/card';
import { MatButton } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { GradeFormComponent } from '../grade-form/grade-form.component';
import {AuthService} from "../auth.service";
import {NgIf} from "@angular/common";

@Component({
  selector: 'app-grade-list',
  templateUrl: './grade-list.component.html',
  styleUrls: ['./grade-list.component.css'],
  standalone: true,
  imports: [
    MatColumnDef,
    MatTable,
    MatCell,
    MatHeaderCell,
    MatHeaderCellDef,
    MatCellDef,
    MatHeaderRow,
    MatRow,
    MatRowDef,
    MatCard,
    MatButton,
    NgIf,
    MatHeaderRowDef,
  ],
})
export class GradeListComponent implements OnInit {
  grades: Grade[] = [];
  displayedColumns: string[] = ['subjectName', 'value', 'actions']; // Use 'actions' for buttons

  constructor(
    private gradeService: GradeService,
    private dialog: MatDialog,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.loadGrades();
  }

  loadGrades() {
    this.gradeService.getGrades().subscribe((grades) => {
      this.grades = grades;
    });
  }

  openGradeDialog(grade?: Grade) {
    const dialogRef = this.dialog.open(GradeFormComponent, {
      data: grade,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        if (grade) {
          this.updateGrade(result);
        } else {
          this.addGrade(result);
        }
      }
    });
  }

  updateGrade(grade: Partial<Grade>) {
    this.gradeService.updateGrade(grade.id!, grade).subscribe(() => {
      this.loadGrades();
    });
  }

  deleteGrade(id: number) {
    this.gradeService.deleteGrade(id).subscribe(() => {
      this.loadGrades();
    });
  }

  addGrade(grade: Partial<Grade>) {
    this.gradeService.addGrade(grade).subscribe(() => {
      this.loadGrades();
    });
  }

  canEditOrDelete(): boolean {
    return this.authService.isTeacherOrAdmin();
  }
}
