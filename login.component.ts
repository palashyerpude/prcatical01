import { Component,OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Verification } from './verification';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
 
 loginForm:FormGroup;
  loginError:string;
//   loginForm: FormGroup({
// email:new FormControl(),
// username:new FormControl(),
// password:new FormControl()
// })
// loginForm:any={email:"",username:"",password:""}
// arr:Array<Verification>=[]

  constructor(private formBuilder: FormBuilder, private http: HttpClient) { }

  ngOnInit() {
    
    this.loginForm = this.formBuilder.group({
      email: ['', Validators.required],
      password: ['', Validators.required]
    });

  }

  onSubmit() {
    if (this.loginForm.invalid) {
      return;
    }

    const loginData = {
      email: this.loginForm.value.email,
      password: this.loginForm.value.password
    };

    this.http.post('/api/login', loginData).subscribe(
      response => {
        // TODO: Handle successful login
      },
      error => {
        this.loginError = error.error.message;
      }
    );
  }

}
