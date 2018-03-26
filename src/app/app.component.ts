import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { toBase64String } from '@angular/compiler';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  client_access_key: string = '39d565f4983246caa953080774e95a86';
  request: any = { query: '', alexa: '', apiai: '' };
  response: any = { alexa: '', apiai: '' };
  queryForm: FormGroup;

  constructor(private http: HttpClient) {
  }

  ngOnInit() {
    this.queryForm = new FormGroup({
      'query': new FormControl(null, Validators.required)
    });
  }

  sendDialogFlow() {
    console.log(this.queryForm);
    let query = this.queryForm.value.query;
    let headers = {
      "Authorization": `Bearer ${this.client_access_key}`
    }
    let apiAiUrl = `https://lgp4j6q0kc.execute-api.us-east-1.amazonaws.com/dev?v=20180309&query=${query}&lang=en&sessionId=1234`;
    this.request.apiai = `\n\nRequest \n \n${apiAiUrl}`;
    this.http.get(apiAiUrl, { headers: headers }).subscribe((res: any) => {
      console.log("Success:" + JSON.stringify(res, null, 2));
      let speechText = res.result.fulfillment.speech;
      let data: any = {};
      try {
        data = JSON.parse(speechText);
        if (data.type) {
          speechText = data.text;
        }
      } catch (error) {
        console.log('Cannot parse speechText since it is not a json string', error);
      }
      this.response.apiai = res;
      this.queryForm.reset();

    }, err => {
      console.log("Error" + JSON.stringify(err, null, 2));
    });
  }


  sendAlexa() {
    let headers = {
      'Authorization': '',
      'Content-Type': 'application/json',
    }
    let input = this.queryForm.value.query;
    let apiAlexaUrl = `https://runtime.lex.us-east-1.amazonaws.com/bot/EzipLexBot/alias/ezipLexBot/user/dummyuser/text`;
    this.request.alexa = `\n\nRequest \n \n${apiAlexaUrl}`;
    this.http.post(apiAlexaUrl, { query: input }, { headers: headers }).subscribe((res: any) => {
      this.response.alexa = res;
      this.queryForm.reset();
    }, err => {
      console.log("Error", err);
    });

  }

  

}
