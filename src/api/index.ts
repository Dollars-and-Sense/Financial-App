import { getLocalStorage, setLocalStorage } from '../utils/utils';
import { get, authGet, post, authPost, authPut } from './request';

const URL : string = "https://finapp.aayushh.com";
const API : any = {
  login: URL + "/login",
  signup: URL + "/signup",
  auth: `${URL}/auth`,
  edit: `${URL}/edit`,
  getClass: `${URL}/class`,

   //teacher
   createClass: `${URL}/create-class`,
   getStudent: `${URL}/students`,

   //Students
   addClass: `${URL}/add-class`,
   answer: `${URL}/answer`,
   getAnswers: `${URL}/answer`
 }

export default {
  login: function({ email, password }: any) {
    return post(API.login, { email, password });
  },
  signup: function({email, password, firstName, lastName, username}: any) {
    return post(API.signup, {email, password, firstName, lastName, username});
  },
  auth: function(){
    return authPost(API.auth,{});
  },
  answer: function({ q_id, typesType, answer } : any){
    return authPut(API.answer, {q_id, typesType, answer});
  },
  addClass: function({code} : any){
    return authPost(API.addClass, {code});
  },
  getClass: function(){
    return authGet(API.getClass);
  },
  getStudent: function(){
    return authGet(API.getStudent);
  },
  createClass : function ({ className, school } : any){
    return authPost(API.createClass, { className, school });
  }
};
