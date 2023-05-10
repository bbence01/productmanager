import { Observable } from "rxjs";
import { User } from "./user";

export class CommentP {
  public id: number = 0
  public body: string= ""
  public postId: number=0
  public user: User = new User()

}
