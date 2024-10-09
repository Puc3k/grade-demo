import {Component, Inject, OnInit} from '@angular/core';
import {GradeService} from '../grade.service';
import {FormsModule} from '@angular/forms';
import {MatFormField, MatLabel} from '@angular/material/form-field';
import {MatInput} from '@angular/material/input';
import {MatButton} from '@angular/material/button';
import {MatCard, MatCardContent, MatCardTitle} from '@angular/material/card';
import {Subject} from "../subject.model";
import {MatOption} from "@angular/material/core";
import {MatSelect} from "@angular/material/select";
import {SubjectService} from "../subject.service";
import {NgForOf} from "@angular/common";
import {Grade} from "../grade.model";
import {MAT_DIALOG_DATA, MatDialogModule, MatDialogRef} from '@angular/material/dialog';
import {MatToolbar} from "@angular/material/toolbar";

@Component({
  selector: 'app-grade-form',
  templateUrl: './grade-form.component.html',
  styleUrls: ['./grade-form.component.css'],
  standalone: true,
  imports: [
    MatCard,
    MatCardTitle,
    MatCardContent,
    FormsModule,
    MatFormField,
    MatOption,
    MatSelect,
    MatButton,
    MatInput,
    NgForOf,
    MatLabel,
    MatDialogModule,
    MatToolbar
  ]
})
export class GradeFormComponent implements OnInit {
  subjectId: number = 0;
  subjects: Subject[] = [];
  value: number = 0;
  isEditing: boolean = false;
  gradeId: number | null = null;

  constructor(
    private gradeService: GradeService,
    private subjectService: SubjectService,
    public dialogRef: MatDialogRef<GradeFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Partial<Grade>
  ) {
  }


  ngOnInit() {
    this.loadSubjects();

    if (this.data && this.data.id) {
      this.isEditing = true;
      this.gradeId = this.data.id;
      this.value = this.data.value ?? 0;
      this.subjectId = this.data.subjectId ?? 0;
    } else {
      this.isEditing = false;
      this.gradeId = null;
      this.value = 0;
      this.subjectId = 0;
    }
  }

  loadSubjects() {
    this.subjectService.getSubjects().subscribe((subjects) => {
      this.subjects = subjects;
    });
  }

  saveGrade() {
    const selectedSubject = this.subjects.find(subject => subject.id === this.subjectId);

    if (!selectedSubject) {
      console.error('Nie znaleziono przedmiotu');
      return;
    }

    const grade: Grade = {
      id: this.gradeId || 0,
      value: this.value,
      subjectId: this.subjectId,
      subjectName: selectedSubject.name
    };

    if (this.isEditing && this.gradeId) {
      this.gradeService.updateGrade(this.gradeId, grade).subscribe(response => {
        this.dialogRef.close(response);
      });
    } else {
      // If adding, call the add service
      this.gradeService.addGrade(grade).subscribe(response => {
        this.dialogRef.close(response);
      });
    }
  }
}
