import { Component, OnInit, Input } from '@angular/core';
import {NgForm} from '@angular/forms';

import { User } from '../../../models/users.model';
import { Project, Task } from '../../../models/projects.model';
import { DataService } from '../../../services/data.service';

@Component({
  selector: 'app-form-edit-task',
  templateUrl: './form-edit-task.component.html',
  styleUrls: ['./form-edit-task.component.scss']
})

export class FormEditTaskComponent implements OnInit {
  user: User;
  users: User[];
  project: Project;
  task: Task = {}

  @Input("user_id") user_id;
  @Input("project_id") project_id;
  @Input("task_id") task_id;
    
  constructor(private _dataService: DataService) {}


  fillTask(f){
    console.log(f)
    for (let key in f.value) {
      if (f.value[key] && (key != 'assigned') && (key != 'checklist')) this.task[key] = f.value[key]
    }
  }

  editTask(f){
    event.preventDefault();
    this.fillTask(f)
    console.log(this.task)
    this._dataService.getProjectById(this.project_id).subscribe((data:Project) =>{
      this.project = data['projects'];
      this.project.tasks.splice(this.project.tasks.findIndex(task => task['_id'] === this.task_id ),1,this.task)
      this._dataService.putProject(this.project).subscribe()
      this.goBack()
    })
    // console.log(f.value)
  }

  addAssignedUser(id){
    console.log(id)
    event.preventDefault()
    if (id != "Assign a member" && !(this.checkAssigned(id))){

    this._dataService.getUserById(id).subscribe((data:User)=> {
      console.log(this.task.assigned)
      this.task.assigned.push({...data['users'], user_id: data['users']._id})
      console.log(this.task.assigned)
      })
    }
  }

  checkAssigned(id){
    return this.task.assigned.some((el) => {
      return el['user_id'] === id;
    }); 
  }

  unnasignedUser(id){
    event.preventDefault();
    let index = this.task.assigned.indexOf({user_id : id});
    this.task.assigned.splice(index,1)
    console.log(id)
  }

  addToCheckList(i: NgForm){
    event.preventDefault()
    //TODO ajouter si '' ou existe déjà, ne pas
    let name = i.value
    console.log(i.value)
    this.task.checklist.push({name, done: false})
    // i.controls.value.reset
  }

  removeFromChecklist(i){
    event.preventDefault()
    this.task.checklist.splice(i,1)
  }

  goBack(){
    event.preventDefault()
    console.log('check function goBack() in form-edit-task.component.ts')
  }

  deleteTask(){
    event.preventDefault()
    this._dataService.getProjectById(this.project_id).subscribe((data:Project) =>{
      this.project = data['projects'];
      this.project.tasks.splice(this.project.tasks.findIndex(task => task['_id'] === this.task_id ),1)
      this._dataService.putProject(this.project).subscribe()
      this.goBack()
    })
  }

  ngOnInit() {
    this._dataService.getProjectById(this.project_id).subscribe((data:Project) =>{
      this.project = data['projects'];
      console.log(this.project)
    })
    this._dataService.getTaskById(this.project_id,this.task_id).subscribe((data:Task)=>{
      console.log(data)
      this.task = data;
      
    })
  }
}
