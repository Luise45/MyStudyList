import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { HwService } from '../services/hw.service';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-hw-create',
  imports: [FormsModule, CommonModule, ReactiveFormsModule],
  templateUrl: './hw-create.html',
  styleUrls: ['./hw-create.css'],
  providers:[HwService]
})
export class HwCreate {


  hwForm:FormGroup;
  hwId!:number;
  form: any;

  constructor(

    private fb: FormBuilder,
    private hwService:HwService,
    private router:Router
  )
{
  this.hwForm = this.fb.group({

    date:['', Validators.required],
    subject: ['', Validators.required],
    task_type:['', Validators.required],
    notes: [null]
  });
}


createHw():void{

  if(this.hwForm.invalid) return;


  const formData = this.hwForm.value;
  this.hwService.createHw(formData).subscribe(() => {


    this.router.navigate(['/hws']);
  });


}



showEmojiPicker = false;
emojis = ['📚', '🌱', '🔬', '🧪', '🧠', '🧮', '📖', '🎵', '🧬', '🩺', '🖌️', '🎥'];

toggleEmojiPicker() {
  this.showEmojiPicker = !this.showEmojiPicker;
}

addEmojiToSubject(emoji: string) {
  const current = this.hwForm.get('subject')?.value || '';
  if (!current.includes(emoji)) {
    this.hwForm.get('subject')?.setValue(current + emoji);
  }
  this.showEmojiPicker = false;
}

}
