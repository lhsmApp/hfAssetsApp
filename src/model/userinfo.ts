export class UserInfo {
  /*id: string;
  username: string;
  fullName: string;
  email: string;
  phone: string;
  avatarId: string;
  avatarPath: string;
  description: string;
  token: string;*/

  userName:string;//用户名称
  passWord:string;//用户密码
  userCode:string;//用户编码
  sessionId:string;//sessionID
  departCode:string;//当前选择部门
  departName:string;//当前选择部门
  avatarId: string;
  avatarPath: string;
  description: string;
}


export interface LoginInfo {
  //access_token: string;
  //user: UserInfo;

  ischeck:boolean;
  usercode:string;
  password:string;
  departcode:string;
  departname:string;
}
